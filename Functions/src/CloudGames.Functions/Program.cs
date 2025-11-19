using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Instrumentation.Http;
using OpenTelemetry.Instrumentation.Runtime;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using System;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

var host = new HostBuilder()
    .ConfigureAppConfiguration((context, config) =>
    {
        config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
              .AddEnvironmentVariables();
    })
    .ConfigureServices((context, services) =>
    {
        services.AddLogging(logging =>
        {
            logging.ClearProviders();
            logging.AddSerilog();
        });

        services.AddHttpClient();
        
        var configuration = context.Configuration;
        
        // Configure Games API HttpClient
        var gamesBaseUrl = configuration["Games:BaseUrl"] ?? "http://localhost:5002";
        services.AddHttpClient("games", client =>
        {
            client.BaseAddress = new Uri(gamesBaseUrl);
            client.Timeout = TimeSpan.FromSeconds(30);
        });
        var serviceName = configuration["Service:Name"] ?? "CloudGames.Functions";
        var otlpEndpoint = configuration["OTLP:Endpoint"];
        var otlpEnabled = bool.TryParse(configuration["OTLP:Enabled"] ?? configuration["OTLP__Enabled"], out var enabled) && enabled;

        services.AddOpenTelemetry()
            .ConfigureResource(resource => resource.AddService(serviceName))
            .WithMetrics(metrics =>
            {
                metrics.AddRuntimeInstrumentation()
                       .AddHttpClientInstrumentation();

                if (otlpEnabled && !string.IsNullOrWhiteSpace(otlpEndpoint))
                {
                    metrics.AddOtlpExporter(options =>
                    {
                        options.Endpoint = new Uri(otlpEndpoint);
                    });
                }
            })
            .WithTracing(tracing =>
            {
                tracing.AddSource(serviceName)
                       .AddHttpClientInstrumentation();

                if (otlpEnabled && !string.IsNullOrWhiteSpace(otlpEndpoint))
                {
                    tracing.AddOtlpExporter(options =>
                    {
                        options.Endpoint = new Uri(otlpEndpoint);
                    });
                }
            });
    })
    .ConfigureFunctionsWorkerDefaults()
    .Build();

try
{
    host.Run();
}
finally
{
    Log.CloseAndFlush();
}
