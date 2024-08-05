// Prompt inicial para iniciar la calculadora
const iniciarCalculadora = () => {
    const respuesta = prompt('Para iniciar calculadora escriba "inicio"').toLowerCase();
    if (respuesta !== 'inicio') {
        alert('No se ingresó "inicio". La calculadora se cerrará.');
        window.close();
    }
};

// Llamar a la función para iniciar la calculadora
iniciarCalculadora();

// Variables para los elementos del DOM. Se interactúa con el HTML.
const pantalla = document.getElementById('pantalla');
const botones = document.querySelectorAll('.boton');
const botonesOperacion = document.querySelectorAll('.botonoperacion');
const botonesFuncion = document.querySelectorAll('.botonfuncion');

// Estado de la calculadora
let memoria = 0;
let operacionActual = '';
let valorActual = '';
let valorPrevio = '';

// Función general con console log
function logOperacion(operacion) {
    console.log(`Operación realizada: ${operacion}`);
}

// Clase para números y operaciones matemáticas
class Calculadora {
    constructor() {
        this.resultado = 0;
    }

    sumar(a, b) {
        return a + b;
    }

    restar(a, b) {
        return a - b;
    }

    multiplicar(a, b) {
        return a * b;
    }

    dividir(a, b) {
        if (b === 0) {
            alert("No se puede dividir por cero");
            return null;
        }
        return a / b;
    }
}

// Instancia de la clase Calculadora
const calc = new Calculadora();

// Se determinan el funcionamiento de los botones de la calculadora.
botones.forEach((boton) => {
    boton.addEventListener('click', () => manejarEntrada(boton.textContent));
});

// Se linkea la calculadora para que funcione con el teclado de la pc.
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Enter', 'Backspace', 'Delete', '+', '-', '*', '/', '%'];
    // Boleano de teclado validkeys. Determina que cada tecla de la computadora, interactua con la computadora.
    if (validKeys.includes(key)) {
        event.preventDefault();

        switch (key) {
            case 'Enter':
                manejarEntrada('=');
                break;
            case 'Backspace':
                manejarEntrada('⌫');
                break;
            case 'Delete':
                manejarEntrada('AC');
                break;
            case '+':
                manejarEntrada('+');
                break;
            case '-':
                manejarEntrada('-');
                break;
            case '*':
                manejarEntrada('×');
                break;
            case '/':
                manejarEntrada('÷');
                break;
            default:
                manejarEntrada(key);
                break;
        }
    }
});

// Función para manejar las entradas de la calculadora
function manejarEntrada(valor) {
    if (!isNaN(valor) || valor === '.') {
        // Límite del lector LCD. Se limita hasta 15, para evitar que la calculadora "se ensanche"
        if (valorActual.length < 15) {     
            if (valorActual === '0' && valor !== '.') {
                valorActual = valor;
            } else {
                valorActual += valor;
            }
            pantalla.textContent = formatearNumero(valorActual);
        }
        // Boleano AC
    } else if (valor === 'AC') {
        valorActual = '';
        valorPrevio = '';
        operacionActual = '';
        pantalla.textContent = '0';
        // Boleano Backspace
    } else if (valor === '⌫') {
        valorActual = valorActual.slice(0, -1);
        pantalla.textContent = formatearNumero(valorActual) || '0';
        // Boleano igual
    } else if (valor === '=') {
        if (operacionActual && valorActual && valorPrevio) {
            valorActual = realizarOperacion().toString();
            pantalla.textContent = formatearNumero(valorActual);
            operacionActual = '';
            valorPrevio = '';
            logOperacion(valorActual);
        }
            // Boleano memoria positiva
    } else if (valor === 'M+') {
        memoria += parseFloat(valorActual.replace(/,/g, ''));
        logOperacion('Memoria Positiva: ' + memoria);
        // Boleano memoria negativa
    } else if (valor === 'M-') {
        memoria -= parseFloat(valorActual.replace(/,/g, ''));
        logOperacion('Memoria Negativa: ' + memoria);
        // Boleano guardar memoria
    } else if (valor === 'M') {
        pantalla.textContent = formatearNumero(memoria.toString());
        // Boleano porcentaje
    } else if (valor === '%') {
        valorActual = (parseFloat(valorActual.replace(/,/g, '')) / 100).toString();
        pantalla.textContent = formatearNumero(valorActual);
        // Se "apaga" la calculadora.
    } else if (valor === 'OFF') {
        // Se cierra la ventana del navegador
        window.close();

    } else {
        operacionActual = valor;
        valorPrevio = valorActual;
        valorActual = '';
    }
}

// Realizar la operación basada en el operador actual
function realizarOperacion() {
    let resultado;
    const a = parseFloat(valorPrevio.replace(/,/g, ''));
    const b = parseFloat(valorActual.replace(/,/g, ''));

    switch (operacionActual) {
        case '+':
            resultado = calc.sumar(a, b);
            break;
        case '-':
            resultado = calc.restar(a, b);
            break;
        case '×':
            resultado = calc.multiplicar(a, b);
            break;
        case '÷':
            resultado = calc.dividir(a, b);
            break;
        default:
            return valorActual;
    }
    return resultado.toString().slice(0, 17);
}

// Función que determina el formato de miles y comas para los decimales
function formatearNumero(numero) {
    const [parteEntera, parteDecimal] = numero.split('.');
    const parteEnteraFormateada = parseInt(parteEntera, 10).toLocaleString('es-ES');
    return parteDecimal ? `${parteEnteraFormateada},${parteDecimal}` : parteEnteraFormateada;
}

// Aplicar la clase correcta a los botones de operaciones y funciones. Aqui se determina forEach para que cada vez se apriete estos botones, genere los eventos.

function aplicarClaseOperacion() {
    const operaciones = ['%', '+', '-', '×', '÷', 'M+', 'M-', 'M'];
    botones.forEach(boton => {
        if (operaciones.includes(boton.textContent)) {
            boton.classList.add('botonoperacion');
        }
    });
    const funciones = ['AC', '⌫', '='];
    botones.forEach(boton => {
        if (funciones.includes(boton.textContent)) {
            boton.classList.add('botonfuncion');
        }
    });
}

// Llamar a la función para aplicar las clases
aplicarClaseOperacion();
