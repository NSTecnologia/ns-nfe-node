const nsAPI = require('../../api_module/nsAPI')

const url = "https://nfe.ns.eti.br/util/resendemail"

class body {
    constructor(chNFe, tpAmb, anexarPDF, anexarEvento, email) {
        this.chNFe = chNFe;
        this.tpAmb = tpAmb;
        this.anexarPDF = anexarPDF;
        this.anexarEvento = anexarEvento;
        this.email = email;
    }
}

class response {
    constructor({ status, motivo, }) {
        this.status = status;
        this.motivo = motivo;
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { body, sendPostRequest }
