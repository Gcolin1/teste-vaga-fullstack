const fs = require('fs');
const parse = require('csv-parser')

function lerCsv(caminhoArquivo)  { 
    const array = []

     fs.createReadStream(caminhoArquivo)
    .pipe(
        parse()
    ).on('data', (data) => {
        ValidarCpfCnpj(data.nrCpfCnpj /*"53396602811"*/)
        ValidarParcelas(data.vlTotal, data.qtPrestacoes, data.vlPresta)
        array.push(data)
    }
    ).on('end', () => {
        FormatarValores(array)
        console.log(array)
    })
}


lerCsv("data.csv")

function conversorReal(valor){
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(valor)
}

function FormatarValores(array){
    const valoresParaFormatar = ['vlTotal', 'vlPresta', 'vlMulta', 'vlMora', 'vlOutAcr', 'vlIof', 'vlDescon', 'vlAtual'] 

      return array.forEach(objeto => {
        valoresParaFormatar.forEach(valor => {
            if(objeto[valor]){
                const num = parseFloat(objeto[valor])
                if(!isNaN(num)){
                    objeto[valor] = conversorReal(num)
                }
            }
        })
    });
}

//validando do cpf
function ValidarCpfCnpj(doc){
    if(doc.length == 11){
       const cpf = doc.split("").map((e) => parseInt(e))

        if(!ValidarPrimeiroDigitoCpf(cpf) && !ValidarSegundoDigitoCpf(cpf)){
            return false
        }else{
            console.log(doc , 'cpf valido')
            return true
        }
    }else if(doc.length == 14){
        const cnpj = doc.split("").map((e) => parseInt(e))

        if(!ValidarPrimeiroDigitoCnpj(cnpj) && !ValidarSegundoDigitoCnpj(cnpj)){
            return false
        }else{
            console.log(doc , 'cnpj valido')
            return true
        }
    }else{
        //console.log('documento inválido')
        return false
    }
} 

//validação primeiro digito do cpf
function ValidarPrimeiroDigitoCpf(cpf){
    let sum = 0

    for(let i = 0; i < 9; i++){
        //console.log(cpf[i])
        sum += cpf[i] * (10 - i)
    }
    const resto = (sum * 10) % 11

    if(resto == 10){
        let resto = 0
    }
    
    if(resto < 10){
        if(cpf[9] == resto){
            return true
        }else{
            return false
        }
    }
    
}

//validação segundo digito do cpf
function ValidarSegundoDigitoCpf(cpf){
    let sum = 0

    for(let i = 0; i < 10; i++){
        //console.log(cpf[i])
        sum += cpf[i] * (11 - i)
        //console.log(cpf[i])
    }
    const resto = (sum * 10) % 11

    //console.log(cpf[10])

    if(resto == 10){
       let resto = 0
    }
    
    if(resto < 10){
        if(cpf[10] == resto){
            return true
        }else{
            return false
        }
    }
}


//validação primeiro digito do cnpj
function ValidarPrimeiroDigitoCnpj(cnpj){
    let sum = 0
    let digito = 0
    let contador = 6

    for(let i = 0; i < 12; i++){
        sum += cnpj[i] * (contador -= 1)
        if(contador <= 2){
            contador = 10
        }
    }
    const resto = sum % 11

    if(resto < 2){
        digito = 0
    }else{
        digito = 11 - resto
    }

    if(cnpj[12] == digito){
        console.log(digito + ' digito real')
        return true
    }else{
        console.log(digito + ' digito falso')
        return false
    }
}

//validação primeiro digito do cnpj
function ValidarSegundoDigitoCnpj(cnpj){
    let sum = 0
    let digito = 0
    let contador = 7

    for(let i = 0; i < 13; i++){
        sum += cnpj[i] * (contador -= 1)
        if(contador <= 2){
            contador = 10
        }
    }
    const resto = sum % 11

    if(resto < 2){
        digito = 0
    }else{
        digito = 11 - resto
    }

    if(cnpj[13] == digito){
        console.log(digito + ' digito real')
        return true
    }else{
        console.log(digito + ' digito falso')
        return false
    }
    
}

//valida prestações 
function ValidarParcelas(vlTotal, qtPrestacoes, vlPresta){
    let numVlTotal = parseFloat(vlTotal)
    let numQtPrestacoes = parseFloat(qtPrestacoes)
    let numVlPresta = parseFloat(vlPresta)

    if(vlTotal){
        let divisao = numVlTotal / numQtPrestacoes

        if(divisao == numVlPresta){
            //console.log('calculo consistente')
            return true
        }else{
            //console.log('calculo inconsistente')
            return false
        }
    }
}