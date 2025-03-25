$.validator.addMethod("nomeValido", function (value, element) {
    return this.optional(element) || /^[A-Za-z\s]+$/.test(value);
}, "Por favor, insira um nome valido (apenas letras e espaços).");

$.validator.addMethod("nomeComposto", function (value, element) {
    return this.optional(element) || value.includes(" ");
}, "Por favor, insira o nome completo.");

$.validator.addMethod("nomeTamanho", function (value, element) {
    return this.optional(element) || (value.length >= 3 && value.length <= 50);
}, "O nome deve conter entre 3 e 50 caracteres.");

$.validator.addMethod("semCaracteresEspeciais", function (value, element) {
    return this.optional(element) || !/[!@#$%^&*(),.?":{}|<>]/.test(value);
}, " O nome não pode conter caracteres especiais.");

$.validator.methods.cpfValido = function (value, element) {
    value = value.replace(/[^\d]+/g, '');
    if (value == '') return false;

    if (
        value.length != 11 ||
        value == "00000000000" ||
        value == "11111111111" ||
        value == "22222222222" ||
        value == "33333333333" ||
        value == "44444444444" ||
        value == "55555555555" ||
        value == "66666666666" ||
        value == "77777777777" ||
        value == "88888888888" ||
        value == "99999999999"
    )
        return false;
    let add = 0;
    for (i = 0; i < 9; i++) add += parseInt(value.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(value.charAt(9))) return false;
    add = 0;
    for (i = 0; i < 10; i++) add += parseInt(value.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(value.charAt(10))) return false;
    return true;

};
/**
 * Remove a formatação de um CPF (pontos e traço).
 *
 * @param {string} cpf O CPF formatado.
 * @returns {string} O CPF sem formatação.
 */
function removerFormatacaoCPF(cpf) {
    if (typeof cpf !== 'string') {
        return "Erro: CPF deve ser uma string.";
    }

    // Remove todos os caracteres não numéricos do CPF
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
$.validator.addMethod("rgValido", function (value, element) {

}
)
$.validator.addMethod("estadoValido", function (value, element) {
    if (value === "") {
        return false; // Valor vazio
    }

    var estadosValidos = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]; // Lista de estados válidos

    return estadosValidos.indexOf(value) !== -1; // Verifica se o valor está na lista
}, "Por favor, selecione um estado válido.");

$.validator.addMethod("validarDataNascimento", function (value, element, params) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false; // Formato de data inválido
    }

    const partes = value.split("-");
    const anoNascimento = parseInt(partes[0], 10);
    const mesNascimento = parseInt(partes[1], 10) - 1; // Mês começa em 0
    const diaNascimento = parseInt(partes[2], 10);

    const dataNascimento = new Date(anoNascimento, mesNascimento, diaNascimento);
    const hoje = new Date();

    if (
        dataNascimento.getFullYear() !== anoNascimento ||
        dataNascimento.getMonth() !== mesNascimento ||
        dataNascimento.getDate() !== diaNascimento
    ) {
        return "Data de nascimento inválida."; // Data inexistente
    }

    let idade = hoje.getFullYear() - anoNascimento;
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();

    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        idade--; // Ainda não fez aniversário este ano
    }

    if (idade < 4) {
        return "A idade mínima é de 4 anos.";
    }

    if (idade > 75) {
        return "A idade máxima é de 75 anos.";
    }

    return true;
}, $.validator.format("Por favor, insira uma data de nascimento válida."));
/**
 * Remove a formatação de um RG (pontos, traços e outros caracteres não numéricos).
 *
 * @param {string} rg O RG formatado.
 * @returns {string} O RG sem formatação.
 */
function removerFormatacaoRG(rg) {
    if (typeof rg !== 'string') {
        return "Erro: RG deve ser uma string.";
    }

    // Remove todos os caracteres não numéricos do RG
    const rgLimpo = rg.replace(/[^\d]/g, '');

    return rgLimpo;
}

// Exemplos de uso
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

$(document).ready(function () {
    $.validator.addMethod("rgValido", function (value, element) {
        value = value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
        return this.optional(element) || (value.length >= 7 && value.length <= 10);
    }, "Por favor, insira um RG válido (7 a 10 dígitos).");

    $("#cpf").mask("000.000.000-00");
    $("#rg").mask("00.000.000-0");
    $("#telefone").mask("(00) 00000-0000");


    $(".meuFormulario").validate({
        submitHandler: function (form) {
            console.log("Formulário enviado!");
            // Removendo a formatação do CPF, se necessário
            if ($.validator.methods.removerFormatacaoCPF && form.cpf) {
                $.validator.methods.removerFormatacaoCPF(form.cpf);
            }
            form.submit();
        },
        rules: {
            nome: {
                required: true,
                nomeValido: true,
                nomeComposto: true,
                nomeTamanho: true,
                semCaracteresEspeciais: true
            },
            email: {
                required: true,
                email: true
            },
            dataNascimento: {
                required: true,
                validarDataNascimento: {
                    idadeMinima: 4,
                    idadeMaxima: 75
                }
            },
            idade: {
                required: true,
                digits: true,
                min: 0,
                max: 75
            },
            senha: {
                required: true,
                minlength: 8,
                maxlength: 16
            },
            telefone: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 11
            },
            cpf: {
                required: true,
                cpfValido: true,
                minlength: 11,
                maxlength: 14
            },
            rg: {
                required: true,
                digits: true,
                minlength: 7,
                maxlength: 10,
                rgValido: true
            },
            rgEstado: {
                required: true,
                estadoValido: true
            },
            convenio: {
                required: true
            },
            genero: {
                required: true
            }
        },
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
        errorPlacement: function (error, element) {
            error.appendTo("#" + element.attr("id") + "Erro");
        }
    });
});