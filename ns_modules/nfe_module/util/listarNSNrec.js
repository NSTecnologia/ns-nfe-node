const nsAPI = require('../../api_module/nsAPI')
const url = "https://nfe.ns.eti.br/util/list/nsnrecs"

class body {
    constructor(chNFe) {
        this.chNFe = chNFe;
    }
}

class response {
    constructor({ status, motivo, nsNRecs, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.nsNRecs = nsNRecs;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { body, sendPostRequest }
