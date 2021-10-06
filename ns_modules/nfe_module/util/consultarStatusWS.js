const nsAPI = require('../../api_module/nsAPI')

const url = "https://nfe.ns.eti.br/util/wssefazstatus"

class body {
    constructor(CNPJCont, UF, tpAmb, versao) {
        this.CNPJCont = CNPJCont;
        this.UF = UF;
        this.tpAmb = tpAmb;
        this.versao = versao;
    }
}

class response {
    constructor({ status, motivo, retStatusServico, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.retStatusServico = retStatusServico;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { body, sendPostRequest }
