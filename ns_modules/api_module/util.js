var fs = require('fs');
const path = require('path')
var crypto = require('crypto')

function dhEmiGet() {

    let dhEmi = new Date()
    dhEmi = dhEmi.toISOString().slice(0, 11) + dhEmi.toLocaleTimeString() + "-03:00"

    return dhEmi
}

function gravarLinhaLog(registro) {

    let logTime = new Date()
    logTime = logTime.toLocaleTimeString() + ":" + logTime.getMilliseconds()

    var caminhoLog = "./logs"

    var fileName = new Date().toISOString().slice(0, 10).replace("-", "").replace("-", "")

    try {

        if (!fs.existsSync(caminhoLog)) {
            try {
                salvarArquivo(caminhoLog, fileName, ".log", logTime + " " + registro + "\r\n")
            }
            catch (error) {
                console.log(error)
            }
        }

        else {
            fs.appendFile(path.join(caminhoLog, fileName + ".log"), logTime + " " + registro + "\r\n", function (err) {
                if (err) {console.log(err)}
            })
        }
    }

    catch (err) {
        console.log(err);
    }
}

async function salvarArquivo(caminho, nomeArquivo, extensao, conteudo) {

    var caminhoSalvar = path.join(caminho, nomeArquivo + extensao)

    try {
        if (!fs.existsSync(caminho)){fs.mkdirSync(caminho)}
    }

    catch (err) {
        console.log(err);
    }

    fs.writeFile(caminhoSalvar, conteudo, function (err) {
        if (err) throw err;
    });

}

function gerarHashCompEntrega(chave, imagem){

    var base64Imagem = fs.readFileSync(imagem, { encoding: 'base64' });

    var sha1 = crypto.createHash("sha1").update(chave + base64Imagem).digest("hex")

    var hashComprovante = new Buffer.from(sha1, "hex").toString('base64')

    return hashComprovante
}

module.exports = { salvarArquivo, dhEmiGet, gravarLinhaLog, gerarHashCompEntrega }
