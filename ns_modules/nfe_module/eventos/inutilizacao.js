const nsAPI = require('../../api_module/nsAPI')
const downloadInut = require("./downloadInutilizacao")

const url = "https://nfe.ns.eti.br/nfe/inut"

class body {
    constructor(cUF, tpAmb, ano, CNPJ, serie, nNFIni, nNFFin, xJust) {
        this.cUF = cUF;
        this.tpAmb = tpAmb;
        this.ano = ano;
        this.CNPJ = CNPJ;
        this.serie = serie;
        this.nNFIni = nNFIni;
        this.nNFFin = nNFFin;
        this.xJust = xJust;
    }
}

class response {
    constructor({ status, motivo, retornoInutNFe, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.retornoInutNFe = retornoInutNFe;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo, tpDown, caminhoSalvar) {
    
    try {
        
        let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))

        let downloadInutBody = new downloadInut.body(responseAPI.retornoInutNFe.chave, "2", tpDown)

        let downloadInutResponse = await downloadInut.sendPostRequest(downloadInutBody, caminhoSalvar)

        return downloadInutResponse

    } 
    
    catch (error) {
        
        return error
    }


}

module.exports = { body, sendPostRequest }
