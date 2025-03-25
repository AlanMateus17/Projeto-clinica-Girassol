// A funçao $.validator.addMethod() e usada na biblioteca jquery Validation
// para criar novas regras de validaçao personalizadas para formularios

// Vamos criar uma regra chamada "nomeValido" para verificar se o campo contem apenas letras e espaços
$.validator.addMethod("nomeValido", function (value, element) {
    // 'this.optional(element)' verifica se o campo e opcional e esta vazio
    // Se for opcional e vazio, a validaçao passa.
    return this.optional(element) ||
        // A expressao regular /^[A-Za-z\s]=$/ verifica se a string 'value'
        // contem apenas letras maiusculas (A-Z), minusculas (a-z) e espaços (\s).
        // O metodo .test(value) retorna 'true' se a string corresponde a regra, e 'false' caso contrario.
        /^[A-Za-z\s]+$/.test(value);

    // Esta e a mensagem que sera exibida se a validaçao falhar.   
}, "Por favor, insira um nome valido (apenas letras e espaços).");

// Agora, vamos criar uma regra chamada "nomeComposto" para garantir que o nome tenha pelo menos um espaço,
// indicando que e um nome composto (nome e sobrenome, por exemplo).
$.validator.addMethod("nomeComposto", function (value, element) {
    return this.optional(element) ||
        // O metodo .includes(" ") verifica se a string 'value' contem um espaço.
        value.includes(" ");
},
    // Mensagem de erro se a validaçao falhar.
    "Por favor, insira o nome completo.");

// Vamos criar uma regra chamada "nomeTamanho" para verificar se o nome tem um comprimento especifico.
$.validator.addMethod("nomeTamanho", function (value, element) {
    return this.optional(element) ||
        // Verificamos se o comprimento da string 'value' esta entre 3 e 50 caacteres (inclusive).
        (value.length >= 3 && value.length <= 50);
},
    // Mensagem de erro se o tamanho nao estiver dentro do espaerado.
    "O nome deve conter entre 3 e 50 caracteres.");
// Criamos agora uma regra chamada "semCaracteresEspeciais" para impredir o uso de caracteres especiais no nome.
$.validator.addMethod("semCaracteresEspeciais", function (value, element) {
    return this.optional(element) ||
        // A expressao regular /[!@#$%^&*(),.?"{}/<>]/.test(value) verifica se a string 'value'
        // contem algum dos caracteres especiais listados dentro dos colchetes.
        // O operador '!' nega o resultado, ou seja, retornamos 'true' se NAO houver caracteres especais.
        !/[!@#$%^&*(),.?":{}|<>]/.test(value);

},
    // Mensagem de erro caso a validaçao falhe.
    " O nome não pode conter caracteres especiais.");
// Aqui, estamos sobrescrevendo ou criando uma nova regra de validaçao para CPF.
// Note que em vez de usar $.validator.addMethod, estamos acessando diretamente $.validator.methods.
$.validator.methods.cpfValido = function (value, element) {
    // Removemos todos os caracteres que nao sao digitos da string 'value'.
    // Isso e importante para limpar a entrada do usuario de pontos e tracos.
    value = value.replace(/[^\d]+/g, '');
    // Se o valor apos a limpeza for uma string vazia, o CPF e invalido.
    if (value == '') return false;

    // Segunda verificaçao: um CPF validao tem 11 digitos e nao pode ser uma sequencia de numeros de digitos repetidos.
    if (
        value.length != 11 || // Verifica se o comprimento e diferente de 11
        value == "00000000000" ||//Verifica se todos os digitos sao 0
        value == "11111111111" ||//Verifica se todos os digitos sao 1
        value == "22222222222" ||//Verifica se todos os digitos sao 2
        value == "33333333333" ||//Verifica se todos os digitos sao 3
        value == "44444444444" ||//Verifica se todos os digitos sao 4
        value == "55555555555" ||//Verifica se todos os digitos sao 5
        value == "66666666666" ||//Verifica se todos os digitos sao 6
        value == "77777777777" ||//Verifica se todos os digitos sao 7
        value == "88888888888" ||//Verifica se todos os digitos sao 8
        value == "99999999999"   //Verifica se todos os digitos sao 9
    )
        return false; // Se alguma dessas condiçoes for verdadeira, o CPF e invalido.
    // Calculo do primeiro digito verificador:
    let add = 0; // Inicializa a variavel para a soma dos produtos.
    for (i = 0; i < 9; i++) // Loop pelos primeiros 9 digitos do CPF.
        // Multiplica cada digito pela sua posiçao de peso ( de 10 a 2) e adiciona a soma.
        add += parseInt(value.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11); // Calcula o resto da divisao por 11 e subtrai de 11.
    // Se o resultado for 10 ou 11, o primeiro digito verificador e 0.
    if (rev == 10 || rev == 11) rev = 0;
    // Compara o digito calculado com o decimo digito do CPF.
    if (rev != parseInt(value.charAt(9)))
        return false; // Se nao forem iguais, o CPF e invalido.

    // Calculo do segundo digito verificador:
    add = 0; // Reinicaliza a variavel para a soma dos produtos.
    for (i = 0; i < 10; i++) // Loop pelos primeiros 10 digitos do CPF (incluindo o primeiro verificador).
        // Multiplica cada digito pela sua posiçao de peso (de 11 a 2) e adiciona a soama.
        add += parseInt(value.charAt(i)) * (11 - i);
    rev = 11 - (add % 11); // Calcula o resto da divisao por 11 e subtrai de 11.
    // Se o resultado for 10 ou 11, o segundo digito verificador e 0.
    if (rev == 10 || rev == 11) rev = 0;
    // Compara o digito calculado com o decimo primeiro digito do CPF.
    if (rev != parseInt(value.charAt(10)))
        return false; // Se nao forem iguais, o CPF e invalido.
    // Se passou por todas as verificaçoes, o CPF e considerado valido.
    return true;

};
/**
 * Remove a formatação de um CPF (pontos e traço).
 *
 * @param {string} cpf O CPF formatado.
 * @returns {string} O CPF sem formatação.
 */
function removerFormatacaoCPF(cpf) {
    // Verifica se o input e uma string. Se nao for, retorna uma mensagem de erro.
    if (typeof cpf !== 'string') {
        return "Erro: CPF deve ser uma string.";
    }

    // Remove todos os caracteres nao numericos do CPF utilizando uma expressao regular.
    // Aexpressao [^\d] busca por quealquer caractere que nao seja um digito.
    // O 'g' significa que a substituiçao deve ser global (em toda a string).
    const cpfLimpo = cpf.replace(/[^\d]/g, '');

    return cpfLimpo;
}

// Exemplos de uso
const cpfFormatado1 = "123.456.789-00";
const cpfLimpo1 = removerFormatacaoCPF(cpfFormatado1);
console.log(cpfLimpo1); // Saída: 12345678900

const cpfFormatado2 = "456.789.123-11";
const cpfLimpo2 = removerFormatacaoCPF(cpfFormatado2);
console.log(cpfLimpo2); // Saída: 45678912311

const cpfFormatado3 = "789.123.456-22";
const cpfLimpo3 = removerFormatacaoCPF(cpfFormatado3);
console.log(cpfLimpo3); // Saída: 78912345622

// Exemplo com um valor inválido
const cpfInvalido = 12345678900;
const cpfLimpoInvalido = removerFormatacaoCPF(cpfInvalido);
console.log(cpfLimpoInvalido); // Saída: "Erro: CPF deve ser uma string."
// Metodo de validaçao para verificar se o o valor selecionado e um estado valido (UF).
$.validator.addMethod("estadoValido", function (value, element) {
    // Verifica se o valor do campo e vazio. Se for, a validaçao falha.
    if (value === "") {
        return false; // Valor vazio
    }
    // Array com as siglas de todos os estados brasileiros validos.
    var estadosValidos = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]; // Lista de estados válidos
    // Verifica se o valor do campo esta presente no array de estados validos.
    // O metodo indexOf retorna a posiçao do elemento no array (ou -1 se nao encontrado).
    // Se o valor nao for encontrado (indexOf retorna -1), a condiçao e verdadeira e retorna false (validaçao falha).

    return estadosValidos.indexOf(value) !== -1; // Verifica se o valor está na lista
},
    // Mensagem de erro que sera exibida se a validaçao falhar.
    "Por favor, selecione um estado válido.");
// Metodo de validaçao para verificar se a data de nascimento e valida e se a idade esta entre 4 e 120 anos.
$.validator.addMethod("validarDataNascimento", function (value, element, params) {
    // Verifica se o formato da data e AAAA-MM-DD usando uma expressao regular.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false; // Formato de data inválido
    }
    // Divide a string da data em ano, mes e dia, usando o '-' como separador.
    const partes = value.split("-");
    // Converte as partes para numeros inteiros. O mes e subtraido por 1 porque em JavaScript os meses começam em 0 (Janeiro e 0, Feveiro e 1, etc.).
    const anoNascimento = parseInt(partes[0], 10);
    const mesNascimento = parseInt(partes[1], 10) - 1; // Mês começa em 0
    const diaNascimento = parseInt(partes[2], 10);
    // Cria um objeto Date com os valores de ano, mes e dia.
    const dataNascimento = new Date(anoNascimento, mesNascimento, diaNascimento);
    // Cria um obejeto Date com a data atual.
    const hoje = new Date();

    // Verifica se a data criada e realemente a data informada. Isso ajuda a evitar datas invalidas como 31 de fevereiro.
    if (
        dataNascimento.getFullYear() !== anoNascimento ||
        dataNascimento.getMonth() !== mesNascimento ||
        dataNascimento.getDate() !== diaNascimento
    ) {
        return "Data de nascimento inválida."; // Data inexistente
    }
    // Calcula a idade subtraindo o ano de nascimento do ano atual.
    let idade = hoje.getFullYear() - anoNascimento;
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    // Ajusta a idade se o aniversario deste ano ainda nao ocorreu.
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        idade--; // Ainda não fez aniversário este ano
    }
    // Verifica se a idade esta dentro do intervalo permitido (4 a 120 anos).
    if (idade < 4) {
        return "A idade mínima é de 4 anos.";
    }

    if (idade > 120) {
        return "A idade máxima é de 120 anos.";
    }
    // Se todas as verificaçoes passarem, a data de nascimento e valida e a idade esta dentro do intervalo permitido.
    return true;
    // Mensagem de erro padrao, que pode ser formatada com parametros (nao utilizado aqui).
}, $.validator.format("Por favor, insira uma data de nascimento válida."));
/**
 * Remove a formatação de um RG (pontos, traços e outros caracteres não numéricos).
 *
 * @param {string} rg O RG formatado.
 * @returns {string} O RG sem formatação.
 */
function removerFormatacaoRG(rg) {
    // Verifica se o input e uma string. Se nao for, retorna  uma mensagem de erro.
    if (typeof rg !== 'string') {
        return "Erro: RG deve ser uma string.";
    }
    // Remove todos os caracteres nao numericos do RG utilizando uma expressao regular.
    // A expressao [^\d] busca por qualquer caractere que NAO seja um digito.
    // O 'g' significa que a substituiçao deve ser global (em toda a string).
    const rgLimpo = rg.replace(/[^\d]/g, '');

    return rgLimpo;
}

// Exemplos de uso da funçao removerFormatacaoRG (para demonstraçao).
const rgFormatado1 = "12.345.678-9";
const rgLimpo1 = removerFormatacaoRG(rgFormatado1);
console.log(rgLimpo1); // Saída: 123456789

const rgFormatado2 = "98.765.432-1";
const rgLimpo2 = removerFormatacaoRG(rgFormatado2);
console.log(rgLimpo2); // Saída: 987654321

const rgFormatado3 = "11.222.333-4";
const rgLimpo3 = removerFormatacaoRG(rgFormatado3);
console.log(rgLimpo3); // Saída: 112223334

// Exemplo com um valor inválido
const rgInvalido = 123456789;
const rgLimpoInvalido = removerFormatacaoRG(rgInvalido);
console.log(rgLimpoInvalido); // Saída: "Erro: RG deve ser uma string.

// Este bloco de codigo e executado quando o documento HTML esta completamente carregado.
// Isso garante que todos os elementos do formulario ja foram carregados e estao disponiveis para manipulaçao.
$(document).ready(function () {
    // Adiciona um metodo de validaçao para verificar se o RG tem entre 7 e 10 digitos (apos remover a formataçao).
    $.validator.addMethod("rgValido", function (value, element) {
        // Remove todos os caracteres nao numericos do valor do RG.
        value = value.replace(/[^\d]/g, '');
        // Retorna true se o campo for opcional e vazio, OU se o comprimento do RG limpo estiver entre 7 e 10 digitos.
        return this.optional(element) || (value.length >= 7 && value.length <= 10);
    },
        // Mensagem de erro que sera exibida se a validaçao falhar.
        "Por favor, insira um RG válido (7 a 10 dígitos).");
    // Aplica mascaras aos campos de CPF, RG e telefone para facilitar a entrada do usuario.
    // A biblioteca 'jquery.maskedisput.js' (ou similar) e necessaria para que isso funcione.
    $("#cpf").mask("000.000.000-00");
    $("#rg").mask("00.000.000-0");
    $("#telefone").mask("(00) 00000-0000");

    // Inicializa a validaçao do formulario com a classe "meuFormulario" usando a biblioteca jQuery Validation.
    $(".meuFormulario").validate({
        // Funçao a ser executada quando o formulario e enviado e a validaçao e bem-sucedida.
        submitHandler: function (form) {
            console.log("Formulário enviado!");
            // Removendo a formataçao do CPF antes de enviar o formulario, caso a funçao exista e o campo CPF esteja presente.
            if ($.validator.methods.removerFormatacaoCPF && form.cpf) {
                $.validator.methods.removerFormatacaoCPF(form.cpf);
            }
            form.submit(); // Envia o formulario.
        },
        // 'rules' define as regras de validaçao para cada campo do formulario.
        rules: {
            // Regras para o campo 'nome'
            nome: {
                required: true, // Torna o campo obrigatorio.
                nomeValido: true, // Aplica a regra de validaçao personalizada 'nomeValido' (apenas letras e espaços).
                nomeComposto: true, // Aplica a regra de validaçao personalizada 'nomeComposto' (deve conter um espaço).
                nomeTamanho: true, // Aplica a regra de valicaçao personalizada 'nomeTamanho' (tamanho entre 3 e 50 caracteres).
                semCaracteresEspeciais: true // Aplica a regra de validaçao personalizada 'semCaracteresEspeciais'.
            },
            // Regras para o campo 'email'
            email: {
                required: true, // Torna o campo obrigatorio.
                email: true // Aplica a regra de validaçao padrao para formato de e-mail.
            },
            // Regras para o campo 'dataNascimento'
            dataNascimento: {
                required: true, // Torna o campo obrigatorio.
                validarDataNascimento: { // Aplica a regra de validaçao personalizada 'validarDataNascimento'.
                    idadeMinima: 4, // Define um parametro para a regra personalizada (idade minima).
                    idadeMaxima: 120 // Define outro parametro para a regra personalizada (idade maxima).
                }
            },
            // Regras para o campo 'idade'
            idade: {
                required: true, // Torna o campo obrigatorio.
                digits: true, // Aplica a regra de validaçao padrao para verificar se um numero inteiro.
                min: 0, // Define o valor minimo permitido.
                max: 120 // Define o valor maximo permitido.
            },
            // Regras para o campo 'senha'
            senha: {
                required: true, // Torna o campo obrigatorio.
                minlength: 8, // Define o comprimento minimo da senha.
                maxlength: 16 // Define o comprimento maximo da senha.
            },
            // Regras para o campo 'telefone'
            telefone: {
                required: true, // Torna o campo obrigatorio.
                digits: true, // Aplica a regra de validaçao padrao para verificar se sao digitos.
                minlength: 10, // Define o comprimento minimo do telefone.
                maxlength: 11 // Define o comprimento maximo do telefone.
            },
            // Regras para o campo 'cpf'
            cpf: {
                required: true, // Torna o campo obrigatorio.
                cpfValido: true, // Aplica a regra de validaçao personalizada 'cpfValido'.
                minlength: 11, // Define o comprimento minimo do CPF.
                maxlength: 14 // Define o comprimento maximo do CPF (considerando a mascara).
            },
            // Regras para o campo 'rg'
            rg: {
                required: true, // Torna o campo obrigatorio.
                digits: true, // Aplica a regra de validaçao padrao para verificar se sao digitos.
                minlength: 7, // Define o comprimento minimo do RG.
                maxlength: 10, // Define o comprimento maximo do RG.
                rgValido: true // Aplica a regra de validaçao personalizada 'rgValido'.
            },
            // Regras para o campo 'rgEstado' (seleçao do estado do RG).
            rgEstado: {
                required: true, // Torna o campo obrigatorio.
                estadoValido: true // Aplica a regra de validaçao personalizada 'estadoValido'.
            },
            // Regras para o campo 'convenio'
            convenio: {
                required: true // Torna o campo obrigatorio.
            },
            // Regras para o campo 'genero' (seleçao de genero).
            genero: {
                required: true // Torna o campo obrigatorio.
            }
        },
        // 'messages' define as mensagens de erro personalizadas para cada regra de validacao.
        messages: {
            nome: {
                required: "Por favor, insira o nome completo.",
                nome: "Por favor, insira um nome válido (apenas letras e espaços)."
            },
            email: {
                required: "Por favor, insira um endereço de e-mail.",
                email: "Por favor, insira um endereço de e-mail válido."
            },
            dataNascimento: {
                required: "Por favor, insira a data de nascimento.",
                validarDataNascimento: "Por favor, insira uma data de nascimento válida.",
                idadeMinima: "A idade mínima é de 4 anos.",
                idadeMaxima: "A idade máxima é de 75 anos."
            },
            idade: {
                required: "Por favor, insira a idade.",
                digits: "Por favor, insira um número válido.",
                min: "A idade deve ser maior ou igual a 0.",
                max: "A idade deve ser menor ou igual a 75."
            },
            senha: {
                required: "Por favor, insira a senha.",
                minlength: "A senha deve ter no mínimo 8 caracteres."
            },
            telefone: {
                required: "Por favor, insira o telefone.",
                digits: "Por favor, insira um número válido.",
                minlength: "O telefone deve ter no mínimo 10 dígitos.",
                maxlength: "O telefone deve ter no máximo 11 dígitos."
            },
            cpf: {
                required: "Por favor, insira o CPF.",
                cpfValido: "Por favor, insira um CPF válido."
            },
            rg: {
                required: "Por favor, insira o RG.",
                digits: "Por favor, insira um número válido."
            },
            rgEstado: {
                required: "Por favor, selecione o estado emissor do RG.",
                estadoValido: "Por favor, selecione um estado válido."
            },
            convenio: {
                required: "Por favor, selecione o convênio."
            },
            genero: {
                required: "Por favor, selecione o gênero."
            }
        },
        // 'errorPlacement' define onde as mensagens de erro srao exibidas no HTML.
        errorPlacement: function (error, element) {
            // Adiciona a mensagem de erro dentro de um elemento com o ID sendo o ID do campo + "Erro".
            error.appendTo("#" + element.attr("id") + "Erro");
        }
    });
});