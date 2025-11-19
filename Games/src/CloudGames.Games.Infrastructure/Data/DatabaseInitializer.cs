using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System;

namespace CloudGames.Games.Infrastructure.Data
{
    public static class DatabaseInitializer
    {
        public static async Task EnsureDataBaseMigratedAsync(IServiceProvider serviceProvider)
        {
            const int maxRetries = 10;
            const int delaySeconds = 6;

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    using var scope = serviceProvider.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<GamesDbContext>();
                    var creator = db.GetService<IRelationalDatabaseCreator>();

                    if (!await creator.ExistsAsync())
                    {
                        Log.Warning("Banco não existe. Criando...");
                        await creator.CreateAsync();
                        await db.Database.MigrateAsync();
                        Log.Information("Banco criado e migrations aplicadas");
                        return; // Success, exit retry loop
                    }

                    var applied = await db.Database.GetAppliedMigrationsAsync();
                    if (!applied.Any())
                    {
                        Log.Warning("Banco existe, mas nenhuma migration aplicada. Aplicando todas...");
                        await db.Database.MigrateAsync();
                        Log.Information("Migrations aplicadas");
                        return; // Success, exit retry loop
                    }

                    var pending = await db.Database.GetPendingMigrationsAsync();
                    if (pending.Any())
                    {
                        Log.Information($"Aplicando {pending.Count()} migrations pendentes...");
                        await db.Database.MigrateAsync();
                        Log.Information("Migrations aplicadas com sucesso");
                    }
                    else
                    {
                        Log.Information("Banco atualizado, nenhuma migration pendente");
                    }
                    return; // Success, exit retry loop
                }
                catch (Exception ex) when (attempt < maxRetries)
                {
                    Log.Warning(ex, "Tentativa {Attempt}/{MaxRetries} de conectar ao banco falhou. Aguardando {Delay}s antes de tentar novamente...", attempt, maxRetries, delaySeconds);
                    await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                }
            }

            // If we get here, all retries failed
            throw new InvalidOperationException($"Não foi possível conectar ao banco de dados após {maxRetries} tentativas.");
        }
    }
}