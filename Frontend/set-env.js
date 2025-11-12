const fs = require('fs');
const path = require('path');

// O caminho para o arquivo que vamos modificar
const envFile = path.join(__dirname, 'src/environments/environment.prod.ts');

// Pega a chave da variável de ambiente que a GitHub Action vai criar
const apiKey = process.env.APIM_KEY;

// Se, por algum motivo, a chave não existir, o build vai falhar (o que é bom, para nos avisar do erro)
if (!apiKey) {
  console.error('ERRO: A variável de ambiente APIM_KEY não foi definida!');
  process.exit(1);
}

// Lê o arquivo de ambiente de produção
fs.readFile(envFile, 'utf8', (err, data) => {
  if (err) {
    console.error('ERRO ao ler o arquivo environment.prod.ts:', err);
    return process.exit(1);
  }

  // Usa uma expressão regular para encontrar e substituir a linha da chave
  const result = data.replace(/APIM_SUBSCRIPTION_KEY: '.*'/g, `APIM_SUBSCRIPTION_KEY: '${apiKey}'`);

  // Escreve o conteúdo atualizado de volta no mesmo arquivo
  fs.writeFile(envFile, result, 'utf8', (err) => {
    if (err) {
      console.error('ERRO ao escrever no arquivo environment.prod.ts:', err);
      return process.exit(1);
    }
    console.log(`Sucesso: O arquivo ${envFile} foi atualizado com a API Key.`);
  });
});