const nsAPI = require('../../api_module/nsAPI')

const url = "https://nfe.ns.eti.br/util/resendemail"

class Body {
    constructor(chNFe, tpAmb, anexarPDF, anexarEvento, email) {
        this.chNFe = chNFe;
        this.tpAmb = tpAmb;
        this.anexarPDF = anexarPDF;
        this.anexarEvento = anexarEvento;
        this.email = email;
    }
}

class Response {
    constructor({ status, motivo, }) {
        this.status = status;
        this.motivo = motivo;
    }
}

async function sendPostRequest(conteudo) {

    try {

        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI

    }

    catch (error) {
        gravarLinhaLog("[ERRO_ENVIO_EMAIL]: " + error)
    }

}

module.exports = { Body, sendPostRequest }
