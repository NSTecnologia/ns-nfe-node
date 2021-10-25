const nsAPI = require('../../api_module/nsAPI')

const url = "https://nfe.ns.eti.br/nfe/stats"

class Body {
    constructor(licencaCnpj, chNFe, tpAmb, versao) {
        this.licencaCnpj = licencaCnpj;
        this.chNFe = chNFe;
        this.tpAmb = tpAmb;
        this.versao = versao;
    }
}

class Response {
    constructor({status, motivo, retConsSitNFe, erros}) {
        this.status = status;
        this.motivo = motivo;
        this.retConsSitNFe = retConsSitNFe;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {

    try {

        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI

    }

    catch (error) {
        gravarLinhaLog("[ERRO_CONSULTA_SITUACAO]: " + error)
    }

}

module.exports = { Body, sendPostRequest }