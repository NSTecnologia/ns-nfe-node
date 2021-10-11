# ns-nfe-node

Esta biblioteca possibilita a comunicação e o consumo da solução API para NFe da NS Tecnologia.

Para imlementar esta bibilioteca em seu projeto, você pode:

1. Realizar a instalação do [pacote](https://www.nuget.org/packages/ns-nfe-core/) através do npm:

       npm install ns-nfe-node

2. Realizar o download da biblioteca pelo [GitHub](https://github.com/konflanzzz/ns-nfe-core/archive/refs/heads/main.zip) e adicionar a pasta "ns-modules" em seu projeto.

# Exemplos de uso do pacote

Para que a comunicação com a API possa ser feita, é necessário informar o seu Token no cabeçalho das requisicoes. 

Para isso, crie um arquivo chamado `configParceiro.js`, e nele adicione:

       const token = ""
       const CNPJ = ""

       module.exports = {token, CNPJ}
       
Dessa forma, o pacote conseguirá importar as suas configurações, onde você estará informando o token da software house e o cnpj do emitente.

## Emissão

Para realizarmos a emissão de uma NFe, vamos utilizar os seguintes métodos.

Primeiramente, vamos fazer referencia da classe *emitirSincrono*, para utilizarmos o método **emitirNFeSincrono**

       const nsAPI = require('ns-nfe-node/ns_modules/nfe_module/emissao/emitirSincrono')

O segundo passo é importar, ou construir o arquivo de emissão em **.json** da NFe.

       const nfeJSON = require('./nfe.json')
           
Apos isso, vamo utilizar o método **sendPostRequest** da classe *EmissaoSincrona* para realizar o envio deste documento NFe para a API.
Este método realiza a emissão, a consulta de status de processamento e o download de forma sequencial.

       var retorno = nsAPI.emitirNFeSincrono(nfeJSON,"2","XP","Documentos/NFe")
       retorno.then(()=>)

Os parametros deste método são:

       codigo

+ *nfeJSON* = objeto NFe que será serializado para envio;
+ + *2* = tpAmb = ambiente onde será autorizado a NFe. *1 = produção, 2 = homologação / testes* ;
+ *"XP"* = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no Download;
+ *"Documentos/NFe"* = diretório onde serão salvos os documentos obtidos no download;
    
Podemos acessarmos os dados de retorno e aplicarmos validações da seguinte forma. Tenhamos como exemplo:

       codigo de como ler o retorno e tratar

## Eventos

### Cancelar NFe

Para realizarmos um cancelamento de uma NFe, devemos gerar o objeto do corpo da requisição, utilizando a classe *Cancelamento.Body*, e utilzar o método *Cancelamento.sendPostRequest*, da seguinte forma:
       
       codigo
        
Os parametros informados no método são:

+ *requisicaoCancelamento* =  Objeto contendo as informações do corpo da requisição de cancelamento;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de cancelamento;
+ *@"NFe/Eventos/"* = diretório onde serão salvos os arquivos obtidos no download do evento de cancelamento;
+ *true* = exibeNaTela = parametro boolean que indica se será exibido na tela, ou não, o PDF obtido no download do evento de cancelamento;

### Carta de Correção para NFe

Para emitirmos uma carta de correção de uma NFe, devemos gerar o objeto do corpo da requisição, utilizando a classe *CartaCorrecao.Body*, e utilzar o método *CartaCorrecao.sendPostRequest*, da seguinte forma:

       codigo
        
Os parametros informados no método são:

+ *requisicaoCorrecao* =  Objeto contendo as informações do corpo da requisição da carta de correção;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de carta de correção;
+ *@"NFe/Eventos/"* = diretório onde serão salvos os arquivos obtidos no download do evento de carta de correção;
+ *true* = exibeNaTela = parametro boolean que indica se será exibido na tela, ou não, o PDF obtido no download do evento de carta de correção;

### Inutilização de numeração da NFe

Para emitirmos uma inutilização de numeração da NFe, devemos gerar o objeto do corpo da requisição, utilizando a classe *Inutilizacao.Body*, e utilzar o método *Inutilizacao.sendPostRequest*, da seguinte forma:

       codigo
        
Os parametros informados no método são:

+ *requisicaoInutilizar* =  Objeto contendo as informações do corpo da requisição de inutilização;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de inutilização;
+ *@"NFe/Eventos/"* = diretório onde serão salvos os arquivos obtidos no download do evento de inutilização;
+ *true* = exibeNaTela = parametro boolean que indica se será exibido na tela, ou não, o PDF obtido no download do evento de inutilização;

## Utilitários

Ainda com esta biblioteca, é possivel acessar método utilitários da API de NFe. Veja exemplos:

### Consulta de cadastro de contribuinte

       codigo

### Consultar situação de NFe
        
       const consultarNFe = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/util/consultarSituacao')
       let corpo = new consultarNFe.body("14139046000109","43210914139046000109550000000257891100116493","2","4.00")

       consultarNFe.sendPostRequest(corpo).then(() => {})
        
### Consultar Status de Web Service

    codigo

### Agendamento de Envio de E-Mail de NFe
        
       codigo
        
### Gerar PDF a partir de um XML de NFe Autorizada
        
        codigo
        
### Listagem de nsNRec's vinculados à uma NFe

       const listarNSNRec = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/util/listarNSNrec')
       let corpo = new listarNSNRec.body("43210914139046000109550000000257891100116493")

       listarNSNRec.sendPostRequest(corpo).then(() => {})

### Gerar prévia de DANFE 

        codigo

### Informações Adicionais

Para saber mais sobre o projeto NFe API da NS Tecnologia, consulte a [documentação](https://docsnstecnologia.wpcomstaging.com/docs/ns-nfe/)

