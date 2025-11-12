# CloudGames – Frontend

## Visão Geral
O **CloudGames** é uma aplicação web que integra os microserviços de **Users** e **Games**, oferecendo uma experiência completa para jogadores e administradores.  
Este frontend foi desenvolvido em Angular e fornece telas para cadastro, login, gerenciamento de biblioteca e promoções.

---

## Informações Técnicas

### 🔧 Tecnologias utilizadas
- **Frontend Framework**: Angular ^18.2.0  
- **Angular CLI**: ^18.2.4  
- **Linguagem**: TypeScript ~5.5.4  
- **Core Libraries**:  
  - RxJS ^7.8.1  
  - Zone.js ^0.14.8  
- **UI Framework**: Bootstrap ^5.3.3  

### Instalação

# Instalar dependências
npm install

## Informações Técnicas
# Ambiente de desenvolvimento
ng serve --proxy-config proxy.conf.json ou npm start

- O frontend roda em: http://localhost:4200  
- O proxy redireciona chamadas `/api` para o backend (http://localhost:5002)  

## Dependências com microserviços

### Users API
- Cadastro, login, perfis de usuário, biblioteca.  
- **Endpoints principais**:  
  - `POST /api/users/register`  
  - `POST /api/users/login`  
  - `GET /api/users/{id}/library`  

### Games API
- Listagem de jogos, promoções, busca.  
- **Endpoints principais**:  
  - `GET /api/games`  
  - `GET /api/promotions`  
  - `POST /api/promotions` (somente Admin)  

---

## 👤 Manual do Usuário

### Cadastro e Login
- Acesse a tela de **Cadastro**.  
- Informe nome, e-mail e senha.  
- Após cadastro, faça login com suas credenciais.  
- O sistema gera um **token JWT** que mantém sua sessão ativa.  

### Biblioteca
- Usuários podem visualizar sua biblioteca em **"Minha Biblioteca"**.  
- Inicialmente estará vazia.  
- Jogos são adicionados à biblioteca quando o usuário realiza uma compra ou resgate.  
- Caso não haja jogos, o sistema informa que a biblioteca está vazia.  

### Promoções
- A tela de **Promoções** lista todas as promoções ativas.  
- Usuários comuns podem apenas visualizar.  
- Administradores podem criar novas promoções através da tela **Cadastrar Promoção**, com formulário validado.  

### Perfis de Usuário
- **Usuário comum**  
  - Pode se cadastrar, logar, buscar jogos, visualizar promoções e gerenciar sua biblioteca.  

- **Administrador**  
  - Possui todas as permissões de usuário comum.  
  - Pode criar promoções.  
  - Pode gerenciar usuários e jogos (se implementado no backend).  
  - No frontend, o botão **Cadastrar Promoção** só aparece para administradores.  
