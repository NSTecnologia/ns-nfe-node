const nsAPI = require('../../api_module/nsAPI');
const { gravarLinhaLog } = require('../../api_module/util');
const url = "https://nfe.ns.eti.br/nfe/issue"

class response {
    constructor({ status, motivo, nsNRec, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.nsNRec = nsNRec;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    
    try {
        let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI
    } 
    
    catch (error) {
        gravarLinhaLog("[ERRO_EMISSAO]: " + error)
        return error
    }
}

module.exports = { sendPostRequest }