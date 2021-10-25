const nsAPI = require('../../api_module/nsAPI')

const url = "https://nfe.ns.eti.br/util/wssefazstatus"

class Body {
    constructor(CNPJCont, UF, tpAmb, versao) {
        this.CNPJCont = CNPJCont;
        this.UF = UF;
        this.tpAmb = tpAmb;
        this.versao = versao;
    }
}

class Response {
    constructor({ status, motivo, retStatusServico, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.retStatusServico = retStatusServico;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {

    try {

        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI

    }

    catch (error) {
        gravarLinhaLog("[ERRO_CONSULTA_STATUS_WS]: " + error)
    }

}

module.exports = { Body, sendPostRequest }
