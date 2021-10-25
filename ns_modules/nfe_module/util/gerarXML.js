const nsAPI = require('../../api_module/nsAPI')
const url = "https://nfe.ns.eti.br/util/generatexml"

class Response {
    constructor({ status, motivo, xml, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.xml = xml;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {

    try {

        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI

    }

    catch (error) {
        gravarLinhaLog("[ERRO_OBTER_XML]: " + error)
    }

}

module.exports = { sendPostRequest }
