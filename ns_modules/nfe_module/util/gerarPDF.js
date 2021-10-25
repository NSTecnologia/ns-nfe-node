const nsAPI = require('../../api_module/nsAPI')
const url = "https://nfe.ns.eti.br/util/generatepdf"

class Body {
    constructor(xml, printCEAN, obsCanhoto) {
        this.xml = xml;
        this.printCEAN = printCEAN;
        this.obsCanhoto = obsCanhoto;
    }
}

class Response {
    constructor({ status, motivo, pdf }) {
        this.status = status;
        this.motivo = motivo;
        this.pdf = pdf;
    }
}

async function sendPostRequest(conteudo) {

    try {

        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI

    }

    catch (error) {
        gravarLinhaLog("[ERRO_OBTER_PDF]: " + error)
    }

}

module.exports = { Body, sendPostRequest }
