using CloudGames.Users.Infra.EventStore;
using CloudGames.Users.Infra.Outbox;
using CloudGames.Users.Infra.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace CloudGames.Users.Infra.Persistence
{
    public static class DatabaseInitializer
    {
        public static async Task EnsureDatabasesMigratedAsync(IServiceProvider serviceProvider)
        {
            const int maxRetries = 10;
            const int delaySeconds = 6;

            // Initialize UsersDbContext
            await EnsureDatabaseMigratedAsync<UsersDbContext>(serviceProvider, "Users", maxRetries, delaySeconds);
            
            // Initialize EventStoreSqlContext
            await EnsureDatabaseMigratedAsync<EventStoreSqlContext>(serviceProvider, "EventStore", maxRetries, delaySeconds);
            
            // Initialize OutboxContext
            await EnsureDatabaseMigratedAsync<OutboxContext>(serviceProvider, "Outbox", maxRetries, delaySeconds);
        }

        private static async Task EnsureDatabaseMigratedAsync<TContext>(
            IServiceProvider serviceProvider,
            string contextName,
            int maxRetries,
            int delaySeconds) where TContext : DbContext
        {
            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    using var scope = serviceProvider.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<TContext>();
                    var creator = db.GetService<IRelationalDatabaseCreator>();

                    // Check if database exists
                    bool dbExists = await creator.ExistsAsync();
                    
                    if (!dbExists)
                    {
                        Log.Warning("[{Context}] Banco não existe. Criando...", contextName);
                        try
                        {
                            await creator.CreateAsync();
                        }
                        catch (Exception ex) when (ex.Message.Contains("already exists") || ex.Message.Contains("já existe"))
                        {
                            // Database was created by another context, continue with migrations
                            Log.Information("[{Context}] Banco já existe (criado por outro contexto). Continuando...", contextName);
                        }
                    }
                    else
                    {
                        Log.Information("[{Context}] Banco já existe. Verificando migrations...", contextName);
                    }

                    // Always try to apply migrations (MigrateAsync is safe to call even if database exists)
                    try
                    {
                        var pending = await db.Database.GetPendingMigrationsAsync();
                        if (pending.Any())
                        {
                            Log.Information("[{Context}] Aplicando {Count} migrations pendentes...", contextName, pending.Count());
                            await db.Database.MigrateAsync();
                            Log.Information("[{Context}] Migrations aplicadas com sucesso", contextName);
                        }
                        else
                        {
                            Log.Information("[{Context}] Banco atualizado, nenhuma migration pendente", contextName);
                        }
                    }
                    catch (Exception ex) when (ex.Message.Contains("already exists") || ex.Message.Contains("já existe"))
                    {
                        // Migration table might already exist, try to get applied migrations
                        try
                        {
                            var applied = await db.Database.GetAppliedMigrationsAsync();
                            Log.Information("[{Context}] {Count} migrations já aplicadas", contextName, applied.Count());
                        }
                        catch
                        {
                            // If we can't get applied migrations, log and continue
                            Log.Warning("[{Context}] Não foi possível verificar migrations aplicadas, mas o banco existe", contextName);
                        }
                    }
                    
                    return; // Success, exit retry loop
                }
                catch (Exception ex) when (attempt < maxRetries)
                {
                    Log.Warning(ex, "[{Context}] Tentativa {Attempt}/{MaxRetries} de conectar ao banco falhou. Aguardando {Delay}s antes de tentar novamente...", 
                        contextName, attempt, maxRetries, delaySeconds);
                    await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                }
            }

            // If we get here, all retries failed
            throw new InvalidOperationException($"[{contextName}] Não foi possível conectar ao banco de dados após {maxRetries} tentativas.");
        }
    }
}

