# ns-nfe-node

Esta biblioteca possibilita a comunicação e o consumo da solução API para NFe da NS Tecnologia.

Para imlementar esta bibilioteca em seu projeto, você pode:

1. Realizar a instalação do [pacote](https://www.nuget.org/packages/ns-nfe-core/) através do npm:

       npm install ns-nfe-node

3. Realizar o download da biblioteca pelo [GitHub](https://github.com/konflanzzz/ns-nfe-core/archive/refs/heads/main.zip) e adicionar a pasta "src" em seu projeto no C# (.NET Core )

# Exemplos de uso do pacote

Apos instalação através do gerenciador de pacotes NuGet, faça referência dela em seu projeto:

    using ns_nfe_core;

Para que a comunicação com a API possa ser feita, é necessário informar o seu Token no cabeçalho das requisicoes. 
Com este pacote, você pode fazê-lo assim como no exemplo:

    configParceiro.token = "4dec0a34f460169dd6fb2ef9193003e0"

## Emissão

Para realizarmos a emissão de uma NFe, vamos utilizar os seguintes métodos. Tenhamos como exemplo:

    using ns_nfe_core.src.emissao;
    
    static async Task emitirNFe() // Emitir NFe
    {
        var NFeXML = layoutNFe.gerarNFeXML();
        var retorno = await EmissaoSincrona.sendPostRequest(NFeXML, "XP", true, @"NFe/Documentos/");
    }

Primeiramente, construimos um objeto da NFe, e um método ( exemplo ) que retorna este objeto:

    using ns_nfe_core.src.emissao;
    
    namespace ns_nfe_core
    {
        class layoutNFe
        {
            public static TNFe gerarNFeXML()
            {
                TNFe NFe = new TNFe
                {
                    infNFe = new TNFeInfNFe
                    {
                        versao = "4.00",
                        ide = new TNFeInfNFeIde{...}
                        emit = new TNFeInfNFeEmit{...}
                        dest = new TNFeInfNFeDest{...}
                        det = new TNFeInfNFeDet[1]
                        {
                            new TNFeInfNFeDet
                            {
                                nItem = "1",
                                prod = new TNFeInfNFeDetProd{...},
                                imposto = new TNFeInfNFeDetImposto{...},
                            }
                        },
                        total = new TNFeInfNFeTotal{...},
                        transp = new TNFeInfNFeTransp{...},
                        pag = new TNFeInfNFePag{...},
                        infAdic = new TNFeInfNFeInfAdic{...},
                    }
                };
                return NFe;
            }
        }
    }
Apos isso, vamo utilizar o método **sendPostRequest** da classe *EmissaoSincrona* para realizar o envio deste documento NFe para a API.
Este método realiza a emissão, a consulta de status de processamento e o download de forma sequencial.

Os parametros deste método são:

    var retorno = await EmissaoSincrona.sendPostRequest(NFeXML, "XP", true, @"NFe/Documentos/");
    
+ *NFeXML* = objeto NFe que será serializado para envio;
+ *"XP"* = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no Download;
+ *true* = exibeNaTela = parametro boolean que indica se será exibido na tela, ou não, o DANFE obtido no download;
+ *@"NFe/Documentos/"* = diretório onde serão salvos os documentos obtidos no download;
    
Podemos acessarmos os dados de retorno e aplicarmos validações da seguinte forma. Tenhamos como exemplo:
            
            // Verifica se houve sucesso na emissão
            if (retorno.statusEnvio == "200" || retorno.statusEnvio == "-6" || retorno.statusEnvio == "-7")
            {
                string statusEnvio = retorno.statusEnvio;
                string nsNRec = retorno.nsNRec;

                // Verifica se houve sucesso na consulta
                if (retorno.statusConsulta == "200")
                {
                    string statusConsulta = retorno.statusConsulta;
                    string motivo = retorno.motivo;
                    string xMotivo = retorno.xMotivo;
                    
                    // Verifica se a nota foi autorizada
                    if (retorno.cStat == "100" || retorno.cStat == "150")
                    {
                        // Documento autorizado com sucesso
                        string cStat = retorno.cStat;
                        string chNFe = retorno.chNFe;
                        string nProt = retorno.nProt;
                        string statusDownload = retorno.statusDownload;
                        
                        if (retorno.statusDownload == "200")
                        {
                            // Verifica de houve sucesso ao realizar o downlaod da NFe
                            string xml = retorno.xml;
                            string json = retorno.json;
                            string pdf = retorno.pdf;
                        }
                        else {
                            // Aqui você pode realizar um tratamento em caso de erro no download
                            statusDownload = retorno.statusDownload;
                            dynamic erros = retorno.erros;
                        }
                    }
                    else
                    {
                        // NFe não foi autorizada com sucesso ou retorno diferente de 100 / 150
                        motivo = retorno.motivo;
                        xMotivo = retorno.xMotivo;
                        dynamic erros = retorno.erros;
                    }
                }
                else
                {
                    // Consulta não foi realizada com sucesso ou com retorno diferente de 200
                    string motivo = retorno.motivo;
                    string xMotivo = retorno.xMotivo;
                    dynamic erros = retorno.erros;
                }
            }
            else
            {
                // NFe não foi enviada com sucesso
                string statusEnvio = retorno.statusEnvio;
                string motivo = retorno.motivo;
                string xMotivo = retorno.xMotivo;
                dynamic erros = retorno.erros;
            }

## Eventos

### Cancelar NFe

Para realizarmos um cancelamento de uma NFe, devemos gerar o objeto do corpo da requisição, utilizando a classe *Cancelamento.Body*, e utilzar o método *Cancelamento.sendPostRequest*, da seguinte forma:
        
        using ns_nfe_core.src.eventos;
        
        static async Task cancelarNFe()
        {
            var requisicaoCancelamento = new Cancelamento.Body
            {
                chNFe = "43210914139046000109550000000257891100116493",
                dhEvento = DateTime.Now.ToString("s") + "-03:00",
                nProt = "143210000654108",
                tpAmb = "2",
                xJust = "CANCELAMENTO REALIZADO PARA FINS DE TESTE DE INTEGRACAO"
            };

            var retorno = await Cancelamento.sendPostRequest(requisicaoCancelamento,"XP", @"NFe/Eventos/",true);
        }
        
Os parametros informados no método são:

+ *requisicaoCancelamento* =  Objeto contendo as informações do corpo da requisição de cancelamento;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de cancelamento;
+ *@"NFe/Eventos/"* = diretório onde serão salvos os arquivos obtidos no download do evento de cancelamento;
+ *true* = exibeNaTela = parametro boolean que indica se será exibido na tela, ou não, o PDF obtido no download do evento de cancelamento;

### Carta de Correção para NFe

Para emitirmos uma carta de correção de uma NFe, devemos gerar o objeto do corpo da requisição, utilizando a classe *CartaCorrecao.Body*, e utilzar o método *CartaCorrecao.sendPostRequest*, da seguinte forma:
        
        using ns_nfe_core.src.eventos;
        
        static async Task corrigirNFe()
        {
            var requisicaoCorrecao = new CartaCorrecao.Body
            {
                chNFe = "43210914139046000109550000000257891100116493",
                dhEvento = DateTime.Now.ToString("s") + "-03:00",
                nSeqEvento = "1",
                tpAmb = "2",
                xCorrecao = "CORRECAO REALIZADO PARA FINS DE TESTE DE INTEGRACAO"
            };

            var retorno = await CartaCorrecao.sendPostRequest(requisicaoCorrecao, "XP", @"NFe/Eventos/",true);
        }
        
Os parametros informados no método são:

+ *requisicaoCorrecao* =  Objeto contendo as informações do corpo da requisição da carta de correção;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de carta de correção;
+ *@"NFe/Eventos/"* = diretório onde serão salvos os arquivos obtidos no download do evento de carta de correção;
+ *true* = exibeNaTela = parametro boolean que indica se será exibido na tela, ou não, o PDF obtido no download do evento de carta de correção;

### Inutilização de numeração da NFe

Para emitirmos uma inutilização de numeração da NFe, devemos gerar o objeto do corpo da requisição, utilizando a classe *Inutilizacao.Body*, e utilzar o método *Inutilizacao.sendPostRequest*, da seguinte forma:

        using ns_nfe_core.src.nfe.eventos;
        
        static async Task inutilizarNFe()
        {
            var requisicaoInutilizar = new Inutilizacao.Body
            {
                ano = "21",
                tpAmb = "2",
                CNPJ = "14139046000109",
                cUF = 43,
                nNFIni = "150",
                nNFFin = "155",
                serie = "0",
                xJust = "NUMERACAO INUTILIZADA PARA TESTES DE INTEGRACAO"
            };

            var retorno = await Inutilizacao.sendPostRequest(requisicaoInutilizar, "XP", @"NFe/Eventos/", true);
        }
        
Os parametros informados no método são:

+ *requisicaoInutilizar* =  Objeto contendo as informações do corpo da requisição de inutilização;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de inutilização;
+ *@"NFe/Eventos/"* = diretório onde serão salvos os arquivos obtidos no download do evento de inutilização;
+ *true* = exibeNaTela = parametro boolean que indica se será exibido na tela, ou não, o PDF obtido no download do evento de inutilização;

## Utilitários

Ainda com esta biblioteca, é possivel acessar método utilitários da API de NFe. Veja exemplos:

### Consulta de cadastro de contribuinte

        using ns_nfe_core.src.nfe.utilitarios;

        static async Task consultarCadastro()
        {
            var requisicaoConsultaCadastro = new ConsultarCadastro.Body
            {
                CNPJCont = "14139046000109",
                CNPJ = "",
                UF = "RS"
            };

            var retorno = await ConsultarCadastro.sendPostRequest(requisicaoConsultaCadastro);
        }

### Consultar situação de NFe
        
        using ns_nfe_core.src.nfe.utilitarios;
        
        static async Task consultarNFe()
        {
            var requisicaoConsultarNFe = new ConsultarSituacao.Body
            {
                chNFe = "43210914139046000109550000000257891100116493",
                tpAmb = "2",
                licencaCNPJ = "14139046000109",
                versao = "4.00"
            };

            var retorno = await ConsultarSituacao.sendPostRequest(requisicaoConsultarNFe);
        }
        
### Consultar Status de Web Service

        using ns_nfe_core.src.nfe.utilitarios;
    
        static async Task consultarWS()
        {
            var requisicaoConsultarWS = new ConsultarWebService.Body
            {
                CNPJCont = "14139046000109",
                tpAmb = "2",
                UF = 43,
                versao =  "4.00"

            };

            var retorno = await ConsultarWebService.sendPostRequest(requisicaoConsultarWS);
        }

### Agendamento de Envio de E-Mail de NFe
        
        using ns_nfe_core.src.nfe.utilitarios;
        
        static async Task enviarEmail()
        {
            string[] destinatarios = new string[1] { "teste@email.com.br" };

            var requisicaoEnviarEmail = new EnvioEmail.Body
            {
                chNFe = "43210914139046000109550000000257891100116493",
                anexarEvento = true,
                anexarPDF = true,
                tpAmb = "2",
                email = destinatarios
            };

            var retorno = await EnvioEmail.sendPostRequest(requisicaoEnviarEmail);
        }
        
### Gerar PDF a partir de um XML de NFe Autorizada
        
        using ns_nfe_core.src.nfe.utilitarios;
            
        static async Task gerarPDF()
        {   
            //para gerar a partir de um arquivo .xml
            //string xml = System.IO.File.ReadAllText(@"./arquivoGerarPDF.xml");

            var requisicaoGerarPDF = new GerarPDF.Body
            {
                xml = "<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"><NFe xmlns="http://www.portalfiscal.inf.br/nfe"><infNFe versao="4.00"...,
            };

            var retorno = await GerarPDF.sendPostRequest(requisicaoGerarPDF);
        }
### Listagem de nsNRec's vinculados à uma NFe

        using ns_nfe_core.src.nfe.utilitarios;
        
        static async Task listarNSNRec()
        {
            var requisicaoListarNSNRec = new ListarNSNRec.Body
            {
                chNFe = "43210914139046000109550000000257891100116493"
            };

            var retorno = await ListarNSNRec.sendPostRequest(requisicaoListarNSNRec);
        }

### Gerar prévia de DANFE 

        using ns_nfe_core.src.nfe.utilitarios;

        static async Task previa()
        {   
            // utilizando método de exemplo para gerar o objeto da NFE
            var retorno = await Previa.sendPostRequest(layoutNFe.gerarNFeXML(),true);
            Console.WriteLine();
        }

### Informações Adicionais

Para saber mais sobre o projeto NFe API da NS Tecnologia, consulte a [documentação](https://docsnstecnologia.wpcomstaging.com/docs/ns-nfe/)

