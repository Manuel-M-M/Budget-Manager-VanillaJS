// VARIABLES Y SELECTORES:
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");


// EVENTOS:
// Llamo a la función
eventListeners();

// Registro los eventlisteners y cuando el documento esté listo voy a ejecutar
// una función que diga preguntar presupuesto.
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
    
    formulario.addEventListener("submit", agregarGasto);
}



// CLASES:
class Presupuesto {
    constructor (presupuesto) {
        this.presupuesto = Number(presupuesto); // Number para parsear entradas de string
        this.restante = Number(presupuesto); // Praupuesto no se modifica pero restante
                                            // lo hará conforme introduzca gastos.
        this.gastos = [] // array vacío que se irá llenando con los gastos.
    }
    
    // este método de la clase va a tomar un objeto gasto
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]; // Con el spread operator tomo una copia
                                             // del array y le paso un nuevo gasto al final.
        this.calcularRestante(); // llamo al método una vez agrego un nuevo gasto para calcular
                                 // restante de nuevo.
    }

    // método para ir restando los gastos al presupuesto y calcular restante. Va a ir
    // iterando sobre el array de gastos para calcular cuanto he gastado.
    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) { // Toma id para saber cual quiero eliminar
        this.gastos = this.gastos.filter(gasto => gasto.id != id); // Itero en cada gasto para tomar el id de gasto
                                                            // y traigo todos menos el que quiero borrar.
        this.calcularRestante(); // llamo al método una vez elimino un gasto para calcular
                                 // restante de nuevo.
    }
}

// clase para controlar la interfaz de usuario. No requiere constructor porque van
// a ser métodos que imprimen html basados en la clase Presupuesto.
class UI {
    insertarPresupuesto(cantidad) { // Le paso todo el objeto presupuesto. Cantidad es un obj.
        // Extraer valores
        const {presupuesto, restante} = cantidad;

        // Agregar valores al HTML
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){ // Toma el mensaje y el tipo de mensaje.
        // crear el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        // comprobar el tipo de mensaje para agregar una clase difernte: de error o de correcto.
        if (tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        // crear mensaje de error
        divMensaje.textContent = mensaje;

        // insertar el mensaje en el HTML con insertBefore que toma que vamos
        // a insertar y en que parte lo colocamos.
        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        // Quitar mensaje del HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000); // Lo quito tras tres segundos. 
    }

   mostrarGastos(gastos) {

        this.limpiarHTML(); // Elimina el HTML previo.
        
        // Iterar sobre los gastos que es un array de objetos gasto.
        gastos.forEach( gasto => {
            const { cantidad, nombre, id } = gasto; // Destructuring para simplificar.

            // Crear un li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id;

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span> `;

            // Botón para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "Borrar &times;"; // con textContent no toma la entidad html &times
            btnBorrar.onclick = () => {
                eliminarGasto(id); // le paso el id de gasto que había generado
            }
            nuevoGasto.appendChild(btnBorrar); // a nuevoGasto le agrego btnBorrar

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto); // en gastoListado colocamos todos
                                                 // los gastos.
        })
    }

    limpiarHTML() {
        while(gastoListado.firstChild) { // Mientras gastoListado tenga algo...
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj; // Destructuring para extaer.

        const restanteDiv = document.querySelector(".restante");
        // Comprobar que queda menos del 25% de presupuesto
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        // Comprobar que queda menos del 50 % de presupuesto
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning");
        } else {
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success");
        }

        // Si el total de gastos deja restante en 0 o menor
        if (restante <= 0) {
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");

            // Para impedir que se sigan agregando gastos desabilito el btn
            formulario.querySelector("button[type='submit']").disabled = true;
        }
    }
}1

// INSTANCIAR:
// Para instanciar presupuesto y pasarlo en el constructor creamos una variable independiente que iniciamos sin
// valor y una vez que tengamos un presupuesto introducido por el user en 
// la función preguntarPresupuesto le asignamos ese valor.
let presupuesto;
// Instanciar UI de forma global para que se pueda acceder desde cualquier función.
const ui = new UI();


// FUNCIONES:
// Preguntar presupuesto
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");

   // console.log(Number(presupuestoUsuario)); //Number para convertir un número string
                                             // en number
    
    if (presupuestoUsuario ===  "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload(); // Si doy a aceptar con el input vacío o a cancelar o no introduzco un número ya
    }                              // sea en string o en number o introduzco número negativo o 0 pregunta de nuevo

    // Presupuesto válido para la variable presupuesto
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto); // Le paso todo el obj presupuesto a la class UI
}

// Añadir gastos
function agregarGasto(e) { // Le paso el evento (un submit).
    e.preventDefault(); // Previene la acción por defecto del submit.

    // Leer los datos del formulario
    const nombre = document.querySelector("#gasto").value; // Value del input #gasto. 
    const cantidad = Number(document.querySelector("#cantidad").value); // Value del input #cantidad. Number
                                                                        // para convertir el value en number.
    // Validar con else if porque se van a mandar mensajes diferentes
    if (nombre === "" || cantidad === "") {
        // Para usarla le paso dos mensajes: el mensaje y el tipo de mensaje.
        ui.imprimirAlerta("Ambos campos son obligatorios", "error"); // Le paso la validación a la class UI. Por esto instancié
                             // UI de manera global, para servir a varias funciones.
        return; // Para que no se ejecute en las siguientes líneas de código.
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no válida", "error");
        return; // Para que no se ejecute en las siguientes líneas de código.
    }

    // Generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}; // Object literall. Es lo contrario a destructuring, une nombre
                                      // y cantidad a gasto. Date now genera el id y se pone con dos 
                                      // puntos por que es diferente a id mientras nombre y cantidad
                                      // vendrian a ser dos puntos nombre y cantidad y no hay que ponerlos.

    // añade un nuevo gasto al objeto presupuesto.
    presupuesto.nuevoGasto(gasto); // le pasamos el obj recien creado de gasto.

    // alerta al agregar gasto correctamente
    ui.imprimirAlerta("Gasto agregado correctamente"); // como no es de tipo error
                                                    // va a caer al else que es alert
                                                    // succes.

    // Imprimir los gastos y luego el restante
    const { gastos, restante } = presupuesto; // Extraer gastos y restante de presupuesto con destructuring.
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // Reiniciar formulario
    formulario.reset();
  
}

// eliminar el div del objeto gasto de HTML cuando pulsamos btn borrar.
function eliminarGasto(id) {
    // elimina del objeto de la clase presupuesto
    presupuesto.eliminarGasto(id);

    // Elimina gastos del HTML
    const { gastos, restante } = presupuesto; // Extraer gastos de presupuesto con destructuring
    ui.mostrarGastos(gastos); // Esta función toma el array de gastos.
    ui.actualizarRestante(restante); // Esta toma el restante.
    ui.comprobarPresupuesto(presupuesto); // Esta toma todo el objeto presupuesto.
}