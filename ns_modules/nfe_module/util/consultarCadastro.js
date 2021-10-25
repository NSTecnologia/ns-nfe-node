const nsAPI = require('../../api_module/nsAPI');
const { gravarLinhaLog } = require('../../api_module/util');

const url = "https://nfe.ns.eti.br/util/conscad"

class Body {
    constructor(CNPJCont, UF, IE, CNPJ, CPF) {
        this.CNPJCont = CNPJCont;
        this.UF = UF;
        this.IE = IE;
        this.CNPJ = CNPJ;
        this.CPF = CPF;
    }
}

class Response {
    constructor({status, motivo, retConsCad, erros}) {
        this.status = status;
        this.motivo = motivo;
        this.retConsCad = retConsCad;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {

    try {

        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI

    } 
    
    catch (error) {
        gravarLinhaLog("[ERRO_CONSULTA_CONTRIBUINTE]: " + error)
    }

}

module.exports = { Body, sendPostRequest }