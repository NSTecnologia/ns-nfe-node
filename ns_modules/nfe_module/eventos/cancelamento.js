const nsAPI = require('../../api_module/nsAPI');
const { gravarLinhaLog } = require('../../api_module/util');
const downloadEvento = require('./downloadEvento')

const url = "https://nfe.ns.eti.br/nfe/cancel"

class Body {
    constructor(chNFe, tpAmb, dhEvento, nProt, xJust) {
        this.chNFe = chNFe;
        this.tpAmb = tpAmb;
        this.dhEvento = dhEvento;
        this.nProt = nProt;
        this.xJust = xJust;
    }
}

class Response {
    constructor({ status, motivo, retEvento, erro }) {
        this.status = status;
        this.motivo = motivo;
        this.retEvento = retEvento;
        this.erro = erro
    }
}

async function sendPostRequest(conteudo, tpDown, caminhoSalvar) {

    try {
        
        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))

        if (responseAPI.status == 200) {

            if (responseAPI.retEvento.cStat == 135) {

                let downloadEventoBody = new downloadEvento.Body(
                    responseAPI.retEvento.chNFe,
                    conteudo.tpAmb,
                    tpDown,
                    "CANC",
                    "1"
                )

                try {
                    let downloadEventoResponse = await downloadEvento.sendPostRequest(downloadEventoBody, caminhoSalvar)

                    return downloadEventoResponse
                } 
                
                catch (error) {
                    gravarLinhaLog("[ERRO_DOWNLOAD_EVENTO_CANCELAMENTO]: " + error)
                    return error
                }

            }
        }

        return responseAPI
    } 
    
    catch (error) {
        gravarLinhaLog("[ERRO_CANCELAMENTO]: " + error)
        return error
    }
}

module.exports = { Body, sendPostRequest }