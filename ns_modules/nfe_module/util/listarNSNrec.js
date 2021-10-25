const nsAPI = require('../../api_module/nsAPI')
const url = "https://nfe.ns.eti.br/util/list/nsnrecs"

class Body {
    constructor(chNFe) {
        this.chNFe = chNFe;
    }
}

class Response {
    constructor({ status, motivo, nsNRecs, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.nsNRecs = nsNRecs;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {

    try {

        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI

    }

    catch (error) {
        gravarLinhaLog("[ERRO_LISTAGEM_NSNREC]: " + error)
    }

}

module.exports = { Body, sendPostRequest }
