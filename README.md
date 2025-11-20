# CloudGames

Uma loja de jogos online completa.

## O que você precisa ter instalado

- **Docker Desktop** - [Baixar aqui](https://www.docker.com/products/docker-desktop/)

Só isso! O Docker vai cuidar de tudo.

## Como rodar o projeto

### 1. Baixar o código
Baixar o projeto do repositorio do GitHub
Acessar a pasta do projeto cd CloudGames

### 2. Rodar o projeto
docker compose up Aguarde alguns minutos na primeira vez demora um pouco mais. (vai baixar tudo automaticamente).

### 3. Pronto! Acesse:
- **Site**: http://localhost:4200

## Parar o projeto
Pressione Ctrl+C no terminal
Ou rode
docker compose down na linha de comando
Ou pressione STOP no painel do Docker Desktop

## Tecnologias usadas

### Frontend
- **Angular 18** - Framework web
- **TypeScript 5.5** - Linguagem de programação
- **Bootstrap 5.3** - Framework CSS para design
- **RxJS 7.8** - Programação reativa
- **Auth0 JWT** - Autenticação com tokens

### Backend
- **.NET 8** - Framework para APIs
- **C#** - Linguagem de programação
- **Entity Framework Core 9.0** - ORM para banco de dados
- **ASP.NET Core** - Framework web para APIs REST
- **Swagger/OpenAPI** - Documentação automática das APIs

### Banco de Dados e Storage
- **SQL Server 2022** - Banco de dados principal
- **Elasticsearch 8.11** - Motor de busca e indexação
- **Azurite** - Emulador do Azure Storage (filas e blobs)

### Infraestrutura e DevOps
- **Docker & Docker Compose** - Containerização
- **Nginx** - Servidor web para o frontend
- **Prometheus** - Coleta de métricas
- **Serilog** - Sistema de logs estruturados

### Arquitetura
- **Microserviços** - 3 APIs independentes (Users, Games, Payments)
- **Clean Architecture** - Separação em camadas (Domain, Application, Infrastructure)
- **Event Sourcing** - Armazenamento de eventos
- **Health Checks** - Monitoramento de saúde dos serviços
