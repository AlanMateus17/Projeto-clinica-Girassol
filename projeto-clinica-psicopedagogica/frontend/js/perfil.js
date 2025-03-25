function validarRG(rg, estado) {
    // Inicializa um objeto para armazenar os resultados das validações.
    const validacoes = {
        formato_basico: false, // Flag para indicar se o formato básico do RG é válido.
        comprimento: false,     // Flag para indicar se o comprimento do RG é válido.
        digito_verificador: null, // Armazena o resultado da validação do dígito verificador (true, false ou null se não aplicável).
        estado_formato_compativel: true // Flag para indicar se o formato do RG é compatível com o estado fornecido (inicialmente assume-se que sim).
    };

    // 1. Validação do Formato Básico (permite números, pontos e hífen)
    // Define uma expressão regular para verificar se o RG segue um formato comum.
    // O formato permite 1 ou 2 dígitos, seguidos por ponto, 3 dígitos, ponto, 3 dígitos, hífen, e 1 dígito ou X, Y ou W.
    const formatoRGRegex = /^(\d{1,2})\.?(\d{3})\.?(\d{3})-?(\d{1}|[X|Y|W])$/;
    // Tenta encontrar uma correspondência da expressão regular na string do RG.
    const matchFormato = rg.match(formatoRGRegex);
    // Remove pontos e hífen da string do RG para facilitar outras validações.
    let rgSemFormatacao = rg.replace(/\./g, '').replace(/-/g, '');

    // Se a expressão regular encontrou uma correspondência, significa que o formato básico é válido.
    if (matchFormato) {
        validacoes.formato_basico = true;
        // Extrai os grupos da correspondência e os junta para obter o RG sem formatação.
        rgSemFormatacao = matchFormato.slice(1).join('');
    }

    // 2. Validação do Comprimento (varia por estado, aqui uma verificação geral)
    // Define o comprimento mínimo e máximo esperado para um RG.
    const comprimentoMinimo = 7;
    const comprimentoMaximo = 14; // Considerando possíveis formatos com letras.
    // Verifica se o comprimento do RG sem formatação está dentro do intervalo permitido.
    if (rgSemFormatacao.length >= comprimentoMinimo && rgSemFormatacao.length <= comprimentoMaximo) {
        validacoes.comprimento = true;
    }

    // 3. Validação do Dígito Verificador (dependente do estado)
    // Verifica se o estado foi fornecido para prosseguir com a validação do dígito verificador.
    if (estado) {
        estado = estado.toUpperCase(); // Converte a sigla do estado para maiúsculo para comparação.
        // Chama a função para validar o dígito verificador, passando o RG sem formatação e o estado.
        validacoes.digito_verificador = validarDigitoVerificadorEstado(rgSemFormatacao, estado);

        // 4. Validação da Compatibilidade do Formato com o Estado (exemplo para alguns estados)
        // Verifica se o estado é SP ou RJ.
        if (['SP', 'RJ'].includes(estado)) {
            // Define uma expressão regular para o formato esperado de RG para SP e RJ (9 dígitos).
            const formatoSPRJRegex = /^\d{9}$/;
            // Verifica se o RG sem formatação corresponde ao formato esperado.
            if (!formatoSPRJRegex.test(rgSemFormatacao)) {
                validacoes.estado_formato_compativel = false;
            }
        } else if (estado === 'MG') {
            // Define uma expressão regular para o formato esperado de RG para MG (9 dígitos - formato comum, pode variar).
            const formatoMGRegex = /^\d{9}$/;
            // Verifica se o RG sem formatação corresponde ao formato esperado.
            if (!formatoMGRegex.test(rgSemFormatacao)) {
                validacoes.estado_formato_compativel = false;
            }
        }
        // Adicione mais regras de formato por estado conforme necessário.
    }

    // Resultado final da validação
    // Verifica se todas as validações (que não são nulas) foram bem-sucedidas.
    const valido = Object.values(validacoes).every(value => value !== null ? value : true);

    // Retorna um objeto contendo o resultado geral da validação e os detalhes de cada validação.
    return { valido, detalhes: validacoes };
}

function validarDigitoVerificadorEstado(rgSemFormatacao, estado) {
    estado = estado.toUpperCase(); // Converte a sigla do estado para maiúsculo para comparação.

    // Utiliza uma estrutura switch para aplicar a lógica de validação do dígito verificador específica para cada estado.
    switch (estado) {
        case 'SP':
            // Exemplo simplificado para SP (pode não ser totalmente correto).
            if (rgSemFormatacao.length === 9) {
                // Extrai os 8 primeiros dígitos do RG e os converte para números.
                const numeros = rgSemFormatacao.slice(0, 8).split('').map(Number);
                // Define os pesos para o cálculo do dígito verificador de SP.
                const pesos = [2, 3, 4, 5, 6, 7, 8, 9];
                // Calcula a soma ponderada dos dígitos.
                const soma = numeros.reduce((acc, num, index) => acc + num * pesos[index], 0);
                // Calcula o resto da divisão da soma por 11.
                const resto = soma % 11;
                // Calcula o dígito verificador esperado.
                const dvCalculado = resto < 2 ? 0 : 11 - resto;
                // Compara o dígito verificador calculado com o dígito verificador fornecido no RG.
                return String(dvCalculado) === rgSemFormatacao.slice(8);
            }
            return false;
        case 'RJ':
            // Exemplo simplificado para RJ (pode não ser totalmente correto).
            if (rgSemFormatacao.length === 9) {
                // Extrai os 8 primeiros dígitos do RG e os converte para números.
                const numeros = rgSemFormatacao.slice(0, 8).split('').map(Number);
                // Define os pesos para o cálculo do dígito verificador do RJ.
                const pesos = [7, 6, 5, 4, 3, 2, 9, 8];
                // Calcula a soma ponderada dos dígitos.
                const soma = numeros.reduce((acc, num, index) => acc + num * pesos[index], 0);
                // Calcula o resto da divisão da soma por 11.
                const resto = soma % 11;
                // Calcula o dígito verificador esperado.
                const dvCalculado = resto < 2 ? 0 : 11 - resto;
                // Compara o dígito verificador calculado com o dígito verificador fornecido no RG.
                return String(dvCalculado) === rgSemFormatacao.slice(8);
            }
            return false;
        case 'MG':
            // Exemplo simplificado para MG (pode não ser totalmente correto).
            if (rgSemFormatacao.length === 9) {
                // Extrai os 8 primeiros dígitos do RG e os converte para números.
                const numeros = rgSemFormatacao.slice(0, 8).split('').map(Number);
                // Define os pesos para o cálculo do dígito verificador de MG.
                const pesos = [2, 3, 4, 5, 6, 7, 8, 9];
                // Calcula a soma ponderada dos dígitos.
                const soma = numeros.reduce((acc, num, index) => acc + num * pesos[index], 0);
                // Calcula o resto da divisão da soma por 11.
                const resto = soma % 11;
                // Calcula o dígito verificador esperado.
                const dvCalculado = resto < 2 ? 0 : 11 - resto;
                // Compara o dígito verificador calculado com o dígito verificador fornecido no RG.
                return String(dvCalculado) === rgSemFormatacao.slice(8);
            }
            return false;
        default:
            return null; // Retorna null se o estado não for reconhecido, indicando que a validação do DV não foi possível.
    }
}

// Exemplos de uso
const rgSPValido = "123456789";
const rgSPInvalidoDV = "123456780";
const rgRJ = "987654321";
const rgMG = "111222333";
const rgComFormatacao = "12.345.678-9";

let resultadoSPValido = validarRG(rgSPValido, 'SP');
console.log(`RG ${rgSPValido}, Estado SP: Válido=${resultadoSPValido.valido}, Detalhes=${JSON.stringify(resultadoSPValido.detalhes)}`);

let resultadoSPInvalido = validarRG(rgSPInvalidoDV, 'SP');
console.log(`RG ${rgSPInvalidoDV}, Estado SP: Válido=${resultadoSPInvalido.valido}, Detalhes=${JSON.stringify(resultadoSPInvalido.detalhes)}`);

let resultadoRJ = validarRG(rgRJ, 'RJ');
console.log(`RG ${rgRJ}, Estado RJ: Válido=${resultadoRJ.valido}, Detalhes=${JSON.stringify(resultadoRJ.detalhes)}`);

let resultadoMG = validarRG(rgMG, 'MG');
console.log(`RG ${rgMG}, Estado MG: Válido=${resultadoMG.valido}, Detalhes=${JSON.stringify(resultadoMG.detalhes)}`);

let resultadoSemEstado = validarRG(rgComFormatacao);
console.log(`RG ${rgComFormatacao}, Sem Estado: Válido=${resultadoSemEstado.valido}, Detalhes=${JSON.stringify(resultadoSemEstado.detalhes)}`); 5
r