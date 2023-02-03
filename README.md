# Loja Stripe

Esta aplicação trata-se de uma loja feita com Node JS e a API do Stripe.

## Requisitos

- express
- stripe
- dotenv
- cors

## Observação sobre dotenv

O arquivo .env não está neste repositório, pois ele contém a chave privada da API do Stripe. Ou seja, para você baixar esta aplicação e fazê-la funcionar no seu computador, será necessário criá-lo e informar as seguintes variáveis:

- SERVER_URL=http://localhost:3000
- STRIPE_PRIVATE_KEY=

## Instalação

Para instalar esta aplicação, siga os seguintes passos:

1. Clone o repositório usando o comando `git clone https://github.com/wdpedroborges/loja-stripe`
2. Instale as dependências do projeto usando o comando `npm install`
3. Inicie o servidor usando o comando `node app.js`

## Funcionalidades

- Adicionar produtos ao carrinho
- Alterar a quantidade
- Verificar preço no lado do servidor
- Realizar pagamentos via Stripe

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.txt) para mais detalhes.