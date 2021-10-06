const nsAPI = require('../../api_module/nsAPI')
const util = require('../../api_module/util')

const url = "https://nfe.ns.eti.br/nfe/get/inut"

class body {
    constructor(chave, tpAmb, tpDown) {
        this.chave = chave;
        this.tpAmb = tpAmb;
        this.tpDown = tpDown
    }
}

class response {
    constructor({ status, motivo, retInut, erros}) {
        this.status = status;
        this.motivo = motivo;
        this.retInut = retInut;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo, caminhoSalvar) {

    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))

    if (responseAPI.retInut.json != null) {
        util.salvarArquivo(caminhoSalvar, responseAPI.retInut.chave, "-procInut.json", responseAPI.retInut.json)
    }

    if (responseAPI.retInut.pdf != null) {
        let data = responseAPI.retInut.pdf;
        let buff = Buffer.from(data, 'base64');
        util.salvarArquivo(caminhoSalvar, responseAPI.retInut.chave, "-procInut.pdf", buff)
    }

    if (responseAPI.retInut.xml != null) {
        util.salvarArquivo(caminhoSalvar, responseAPI.retInut.chave, "-procInut.xml", responseAPI.retInut.xml)
    }

    return responseAPI
}

module.exports = { body, sendPostRequest }
