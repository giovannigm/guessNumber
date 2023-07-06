alert("adivina un numero del 0 al (numero que ingreses)");
let numeroSeleccionado = parseInt(prompt("Hasta que numero queres que abarque"));

let numeros = [];
for (i = 0; i <= numeroSeleccionado; i++) {
    numeros.push(i);
}
let contador = 1;

// Agarra un numeros random
let numeroAleatorio = numeros[Math.floor(Math.random() * numeros.length)];
console.log(numeroAleatorio);

function iniciarJuego() {

    let numeroIngresado = parseInt(prompt("adivine el numero entre " + "0 y " + numeroSeleccionado));
    if (numeroIngresado == numeroAleatorio) {
        alert("El numero " + numeroIngresado + " es correcto!");
        alert("muuy bien lo has logrado en " + contador + " intentos");
        let volverAjugar = prompt("¿Quieres volver a jugar? S / N");
        if (volverAjugar == "S") {
            alert("okey volvamos a empezar");
            location.reload();
        } else {
            alert("Espero que te hallas divertido, hasta la proxima!");
        }
    } else if (numeroIngresado < numeroAleatorio) {
        alert("El numero es menor que el objetivo");
        contador += 1;
        iniciarJuego();
    } else {
        alert("El numero es mayor que el objetivo");
        contador += 1;
        iniciarJuego();
    }
}

iniciarJuego();
