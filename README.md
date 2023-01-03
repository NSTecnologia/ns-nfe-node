# ns-nfe-node

Esta biblioteca possibilita a comunicação e o consumo da solução API para NFe da NS Tecnologia.

Para implementar esta biblioteca em seu projeto, você pode:

1. Realizar a instalação do [pacote](https://www.npmjs.com/package/ns-nfe-node) através do npm:

       npm install ns-nfe-node

2. Realizar o download da biblioteca pelo [GitHub](https://github.com/NSTecnologia/ns-nfe-node/archive/refs/heads/main.zip) e adicionar a pasta "ns-modules" em seu projeto.

# Exemplos de uso do pacote

Para que a comunicação com a API possa ser feita, é necessário informar o seu Token no cabeçalho das requisições. 

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

Os parâmetros deste método são:

+ *nfeJSON* = objeto NFe que será serializado para envio;
+ *2* = tpAmb = ambiente onde será autorizado a NFe. *1 = produção, 2 = homologação / testes* ;
+ *"XP"* = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no Download;
+ *"Documentos/NFe"* = diretório onde serão salvos os documentos obtidos no download;

O retorno deste método é um objeto json contendo um compilado dos retornos dos métodos realizados pela emissão sincrona:

       responseSincrono {
           statusEnvio: 200,
           statusConsulta: 200,
           statusDownload: 200,
           cStat: 100,
           motivo: 'Consulta realizada com sucesso',
           xMotivo: 'Autorizado o uso da NF-e',
           nsNRec: '3753664',
           chNFe: '43210914139046000109550000000257891100116493',
           nProt: '135210000895542',
           xml: '<?xml version="1.0" encoding="utf-8"?><nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"><NFe><infNFe versao=...</nfeProc>',
           json: undefined, // json da NFe autorizada quando tpDown = "J", ou "JP"
           pdf: undefined, // base64 do PDF da NFe ( DANFE ) autorizada quando tpDown = "P", "XP", "JP"
           erros: undefined // array de erros quando a comunicação, emissão, ou processamento apresentar erros
         }
       }
    
Podemos acessarmos os dados de retorno e aplicarmos validações da seguinte forma. Tenhamos como exemplo:

       if (retorno.statusEnvio == "200" || retorno.statusEnvio == "-6" || retorno.statusEnvio == "-7") {
           var statusEnvio = retorno.statusEnvio;
           var nsNRec = retorno.nsNRec;

           // Verifica se houve sucesso na consulta
           if (retorno.statusConsulta == "200") {
               var statusConsulta = retorno.statusConsulta
               var motivo = retorno.motivo
               var xMotivo = retorno.xMotivo

               // Verifica se a nota foi autorizada
               if (retorno.cStat == "100" || retorno.cStat == "150") {
                   // Documento autorizado com sucesso
                   var cStat = retorno.cStat
                   var chNFe = retorno.chNFe
                   var nProt = retorno.nProt
                   var statusDownload = retorno.statusDownload

                   if (retorno.statusDownload == "200") {
                       // Verifica de houve sucesso ao realizar o downlaod da NFe
                       let xml = retorno.xml
                       let json = retorno.json
                       let pdf = retorno.pdf
                   }

                   else {
                       // Aqui você pode realizar um tratamento em caso de erro no download
                       statusDownload = retorno.statusDownload
                       let erros = retorno.erros
                   }
               }

               else {
                   // NFe não foi autorizada com sucesso ou retorno diferente de 100 / 150
                   motivo = retorno.motivo
                   xMotivo = retorno.xMotivo
                   let erros = retorno.erros
               }
           }

           else {
               // Consulta não foi realizada com sucesso ou com retorno diferente de 200
               var motivo = retorno.motivo;
               var xMotivo = retorno.xMotivo;
               var erros = retorno.erros;
           }
       }
       else {
           // NFe não foi enviada com sucesso
           var statusEnvio = retorno.statusEnvio;
           var motivo = retorno.motivo;
           var xMotivo = retorno.xMotivo;
           var erros = retorno.erros;
       }

## Eventos

### Cancelar NFe

Para realizarmos um cancelamento de uma NFe, devemos gerar o objeto do corpo da requisição e depois, fazer a chamada do método. Veja um exemplo:
       
       const cancelarNFe = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/eventos/cancelamento')
       const util = require('./node_modules/ns-nfe-node/ns_modules/api_module/util')

       let corpo = new cancelarNFe.Body(
           "43210914139046000109550000000257891100116493",
           "2",
           util.dhEmiGet(),
           "135210000895542",
           "CANCELAMENTO REALIZADO PARA TESTES DE INTEGRACAO EXEMPLO NODE JS"
       )

       cancelarNFe.sendPostRequest(corpo, "X", "Documentos/NFe/Eventos").then(() => { })
        
Os parâmetros informados no método são:

+ *requisicaoCancelamento* =  Objeto contendo as informações do corpo da requisição de cancelamento;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de cancelamento;
+ *@"NFe/Eventos/"* = diretório onde serão salvos os arquivos obtidos no download do evento de cancelamento;
+ *true* = exibeNaTela = parâmetro boolean que indica se será exibido na tela, ou não, o PDF obtido no download do evento de cancelamento;

### Carta de Correção para NFe

Para emitirmos uma carta de correção de uma NFe, devemos gerar o objeto do corpo da requisição, utilizando a classe *CartaCorrecao.Body*, e utilzar o método *CartaCorrecao.sendPostRequest*, da seguinte forma:

       const cartaCorrecaoNFe = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/eventos/cartaCorrecao')
       const util = require('./node_modules/ns-nfe-node/ns_modules/api_module/util')

       let corpo = new cartaCorrecaoNFe.Body(
           "43210914139046000109550000000257891100116493",
           "2",
           util.dhEmiGet(),
           "2",
           "CARTA DE CORRECAO ADICIONADA PARA TESTES DE INTEGRACAO COM EXEMPLO NODE JS"
       )

       cartaCorrecaoNFe.sendPostRequest(corpo, "XP", "Documentos/NFe/Eventos").then(() => {})
        
Os parâmetros informados no método são:

+ *corpo* =  Objeto contendo as informações do corpo da requisição da carta de correção;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de carta de correção;
+ *"Documentos/NFe/Eventos"* = diretório onde serão salvos os arquivos obtidos no download do evento de carta de correção;

### Inutilização de numeração da NFe

Para emitirmos uma inutilização de numeração da NFe, devemos gerar o objeto do corpo da requisição, utilizando a classe *Inutilizacao.Body*, e utilizar o método *Inutilizacao.sendPostRequest*, da seguinte forma:

       const inutilizarNFe = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/eventos/inutilizacao')

       let corpo = new inutilizarNFe.Body("43", "2", "21", "14139046000109", "0", "22539", "22539", "INUTILIZADO PARA TESTES DE INTEGRACAO")

       inutilizarNFe.sendPostRequest(corpo, "X", "Documentos/NFe/Eventos").then(getResponse => { console.log(getResponse) })
        
Os parâmetros informados no método são:

+ *requisicaoInutilizar* =  Objeto contendo as informações do corpo da requisição de inutilização;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de inutilização;
+ *@"NFe/Eventos/"* = diretório onde serão salvos os arquivos obtidos no download do evento de inutilização;
+ *true* = exibeNaTela = parâmetro boolean que indica se será exibido na tela, ou não, o PDF obtido no download do evento de inutilização;

## Utilitários

Ainda com esta biblioteca, é possivel acessar método utilitários da API de NFe. Veja exemplos:

### Consulta de cadastro de contribuinte

       const consultaCad = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/util/consultarCadastro')

       let corpo = new consultaCad.Body(
           "14139046000109",
           "RS",
           "190185748"
       )

       consultaCad.sendPostRequest(corpo).then(getResponse => { console.log(getResponse) })

### Consultar situação de NFe
        
       const consultarNFe = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/util/consultarSituacao')
       let corpo = new consultarNFe.Body("14139046000109","43210914139046000109550000000257891100116493","2","4.00")

       consultarNFe.sendPostRequest(corpo).then(() => {})
        
### Consultar Status de Web Service

       const consultarStatusWS = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/util/consultarStatusWS')

       let corpo = new consultarStatusWS.Body(
           "14139046000109",
           "43",
           "2",
           "4.00"
       )

       consultarStatusWS.sendPostRequest(corpo).then(() => {})

### Agendamento de Envio de E-Mail de NFe
        
       const enviarEmail = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/util/envioEmail')

       let corpo = new enviarEmail.Body(
           "43210914139046000109550000000257891100116493",
           "2",
           "true",
           "true",
           "fernando.konflanz@nstecnologia.com.br"
       )

       enviarEmail.sendPostRequest(corpo).then(() => { })
        
### Listagem de nsNRec's vinculados à uma NFe

       const listarNSNRec = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/util/listarNSNrec')
       let corpo = new listarNSNRec.Body("43210914139046000109550000000257891100116493")

       listarNSNRec.sendPostRequest(corpo).then(() => {})

### Gerar prévia de DANFE 

       const nsAPI = require('ns-nfe-node/ns_modules/nfe_module/util/previa')
       const nfeJSON = require('./nfe.json')

       var previa = nsAPI.sendPostRequest(nfeJSON).then(() => { () })

### Informações Adicionais

Para saber mais sobre o projeto NFe API da NS Tecnologia, consulte a [documentação](https://docsnstecnologia.wpcomstaging.com/docs/ns-nfe/)


