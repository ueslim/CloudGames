# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY src/CloudGames.Games.Api/CloudGames.Games.Api.csproj CloudGames.Games.Api/
COPY src/CloudGames.Games.Application/CloudGames.Games.Application.csproj CloudGames.Games.Application/
COPY src/CloudGames.Games.Domain/CloudGames.Games.Domain.csproj CloudGames.Games.Domain/
COPY src/CloudGames.Games.Infrastructure/CloudGames.Games.Infrastructure.csproj CloudGames.Games.Infrastructure/
RUN dotnet restore CloudGames.Games.Api/CloudGames.Games.Api.csproj

# Copy source code
COPY src/ ./

# Restore again (to regenerate project.assets.json in clean Linux environment) and publish
RUN dotnet restore CloudGames.Games.Api/CloudGames.Games.Api.csproj && \
    dotnet publish CloudGames.Games.Api/CloudGames.Games.Api.csproj -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

EXPOSE 8080

ENTRYPOINT ["dotnet", "CloudGames.Games.Api.dll"]

