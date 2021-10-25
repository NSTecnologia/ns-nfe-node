const axios = require('axios')
const configParceiro = require('../../../../configParceiro')
const util = require('./util')

const header = {
    "Content-Type": "application/json",
    "X-AUTH-TOKEN": configParceiro.token
}

async function PostRequest(url, body) {

    util.gravarLinhaLog('[URL_ENVIO]: ' + JSON.stringify(url))
    util.gravarLinhaLog('[DADOS_ENVIO]: ' + JSON.stringify(body))

    responseAPI = await axios.post(url, JSON.stringify(body), { headers: header })

        .then(getResponse => {

            util.gravarLinhaLog('[DADOS_RESPOSTA]: ' + JSON.stringify(getResponse.data))

            responseAPI = getResponse.data

            return responseAPI;
        })

        .catch(getResponse => {
            
            util.gravarLinhaLog('[ERRO_ENVIAR_REQUISICAO]: ' + JSON.stringify(getResponse.response.data))

            responseAPI = getResponse.response.data

            return responseAPI;
        })

    return responseAPI
}

module.exports = { PostRequest }
