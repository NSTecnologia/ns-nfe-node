const nsAPI = require('../../api_module/nsAPI')
var fs = require('fs');
const util = require("../../api_module/util")
'use strict';

const url = "https://nfe.ns.eti.br/nfe/get"

class body {
    constructor(chNFe, tpDown, tpAmb) {
        this.chNFe = chNFe;
        this.tpDown = tpDown;
        this.tpAmb = tpAmb;
    }
}

class response {
    constructor({status, motivo, chNFe, xml, pdf, nfeProc, erros}) {
        this.status = status;
        this.motivo = motivo;
        this.chNFe = chNFe;
        this.xml = xml;
        this.pdf = pdf;
        this.json = JSON.stringify(nfeProc);
        this.erros = erros
    }
}

async function sendPostRequest(body, caminho) {
    
    let responseAPI = new response(await nsAPI.PostRequest(url, body))

    if (responseAPI.json != null){
        util.salvarArquivo(caminho, responseAPI.chNFe,"-nfeProc.json",responseAPI.json)
    }

    if (responseAPI.pdf != null) {
        let data = responseAPI.pdf;
        let buff = Buffer.from(data, 'base64');
        util.salvarArquivo(caminho, responseAPI.chNFe, "-nfeProc.pdf", buff)
    }

    if (responseAPI.xml != null) {
        util.salvarArquivo(caminho, responseAPI.chNFe, "-nfeProc.xml", responseAPI.xml)
    }

    return responseAPI
}

module.exports = { body, sendPostRequest }

