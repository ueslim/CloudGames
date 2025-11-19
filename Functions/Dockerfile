# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj file and restore
COPY src/CloudGames.Functions/CloudGames.Functions.csproj CloudGames.Functions/
RUN dotnet restore CloudGames.Functions/CloudGames.Functions.csproj

# Copy source code
COPY src/ ./

# Restore again (to regenerate project.assets.json in clean Linux environment) and publish
RUN dotnet restore CloudGames.Functions/CloudGames.Functions.csproj && \
    dotnet publish CloudGames.Functions/CloudGames.Functions.csproj -c Release -o /app/publish --no-restore

# Runtime stage (Azure Functions .NET Isolated)
FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0
WORKDIR /home/site/wwwroot
COPY --from=build /app/publish .

ENV AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

EXPOSE 80

# ENTRYPOINT provided by base image

