const nsAPI = require('../../api_module/nsAPI')
const url = "https://nfe.ns.eti.br/nfe/issue"

class response {
    constructor({ status, motivo, nsNRec, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.nsNRec = nsNRec;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { sendPostRequest }