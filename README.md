# Digital Republic - Donus Challenge

## Node Version: v14.17.5

## Siga o passo a passo para conseguir testar o projeto em sua máquina.

1. Clone o repositório para sua máquina.
2. Abra um terminal na pasta raiz onde você salvou o repositório.
3. Digite npm i ou npm install, para instalar as dependências que foram utilizadas no projeto.
4. Digite npm run dev para deixar o servidor online. (Por padrão o servidor rodara na porta 3000).
5. Use Postman ou Insomnia para fazer requisoções para o servidor.


### Podem ser feitas requisções para:

1. Registrar um novo usuário -> http://localhost:3000/user/register
  - É esperado no corpo da requisição um body no formato {"name: "", "cpf": ""}
  
2. Sacar dinheiro da conta -> http://localhost:3000/user/withdraw
  - É esperado no corpo da requisição um body no formato {"cpf": "", "value": ""}
  
3. Depositar dinheiro na conta -> http://localhost:3000/user/deposit
  - É esperado no corpo da requisição um body no formato {"cpf": "", "value": ""}

4. E transferir dinheiro entre contas -> http://localhost:3000/user/transfer
  - É esperado no corpo da requisição um body no formato {"cpf_receiver": "",	"cpf_transfer": "", "value": ""}
