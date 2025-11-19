# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY src/CloudGames.Users.Web/CloudGames.Users.Web.csproj CloudGames.Users.Web/
COPY src/CloudGames.Users.Application/CloudGames.Users.Application.csproj CloudGames.Users.Application/
COPY src/CloudGames.Users.Domain/CloudGames.Users.Domain.csproj CloudGames.Users.Domain/
COPY src/CloudGames.Users.Infra/CloudGames.Users.Infra.csproj CloudGames.Users.Infra/
RUN dotnet restore CloudGames.Users.Web/CloudGames.Users.Web.csproj

# Copy source code
COPY src/ ./

# Restore again (to regenerate project.assets.json in clean Linux environment) and publish
RUN dotnet restore CloudGames.Users.Web/CloudGames.Users.Web.csproj && \
    dotnet publish CloudGames.Users.Web/CloudGames.Users.Web.csproj -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

EXPOSE 8080

ENTRYPOINT ["dotnet", "CloudGames.Users.Web.dll"]

