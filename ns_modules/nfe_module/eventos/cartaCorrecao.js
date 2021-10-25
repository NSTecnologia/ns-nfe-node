const nsAPI = require('../../api_module/nsAPI')
const downloadEvento = require('./downloadEvento')

const url = "https://nfe.ns.eti.br/nfe/cce"

class body {
    constructor(chNFe, tpAmb, dhEvento, nSeqEvento, xCorrecao) {
        this.chNFe = chNFe;
        this.tpAmb = tpAmb;
        this.dhEvento = dhEvento;
        this.nSeqEvento = nSeqEvento;
        this.xCorrecao = xCorrecao;
    }
}

class response {
    constructor({ status, motivo, retEvento, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.retEvento = retEvento;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo, tpDown, caminhoSalvar) {
    
    try {
        let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))

        if (responseAPI.status == 200) {

            if (responseAPI.retEvento.cStat == 135) {

                let downloadEventoBody = new downloadEvento.body(
                    responseAPI.retEvento.chNFe,
                    conteudo.tpAmb,
                    tpDown,
                    "CCe",
                    conteudo.nSeqEvento
                )

                try {
                    let downloadEventoResponse = await downloadEvento.sendPostRequest(downloadEventoBody, caminhoSalvar)

                    return downloadEventoResponse
                }

                catch (error) {
                    gravarLinhaLog("[ERRO_DOWNLOAD_EVENTO_CORRECAO]: " + error)
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

module.exports = { body, sendPostRequest }
