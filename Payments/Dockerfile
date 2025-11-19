# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY src/CloudGames.Payments.Web/CloudGames.Payments.Web.csproj CloudGames.Payments.Web/
COPY src/CloudGames.Payments.Application/CloudGames.Payments.Application.csproj CloudGames.Payments.Application/
COPY src/CloudGames.Payments.Domain/CloudGames.Payments.Domain.csproj CloudGames.Payments.Domain/
COPY src/CloudGames.Payments.Infra/CloudGames.Payments.Infra.csproj CloudGames.Payments.Infra/
RUN dotnet restore CloudGames.Payments.Web/CloudGames.Payments.Web.csproj

# Copy source code
COPY src/ ./

# Restore again (to regenerate project.assets.json in clean Linux environment) and publish
RUN dotnet restore CloudGames.Payments.Web/CloudGames.Payments.Web.csproj && \
    dotnet publish CloudGames.Payments.Web/CloudGames.Payments.Web.csproj -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

EXPOSE 8080

ENTRYPOINT ["dotnet", "CloudGames.Payments.Web.dll"]

