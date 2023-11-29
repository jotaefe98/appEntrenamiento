//Lee y carga el archivo .json y lo transforma en un array
const fs = require('fs');
let fichero = fs.readFileSync('Usuarios.json')
let usuarios = new Array();
usuarios = JSON.parse(fichero);

//Declaracion de constantes
const inputDni = document.getElementById('dni');
const inputNombre = document.getElementById('nombre');
const inputFecha = document.getElementById('fecha');
const inputEntrenamiento = document.getElementById('entrenamiento');
const inputDescripcion = document.getElementById('descripcion');
const img = document.getElementById("img");
const header = document.getElementById("header");

//Declaracion de variables
let dni;
let nombre;
let existeDni;


//Comprobacion del dni
inputDni.addEventListener('keyup', (evento) => {
    //Cada vez que pulsa enter realiza las comprobaciones
    if(evento.key == "Enter"){
        existeDni=false;
        //Recorre todos los usuarios del json para comprobar si coincide con algun dni
        usuarios.forEach(function(object){
            if(object.dni==inputDni.value){
                dni=object.dni;
                nombre=object.nombre;
                existeDni=true;
            }
        })
        //Primero el formato
        if (existeDni) {
            // El formato del DNI es válido
            img.src = "img/"+inputDni.value+".jpg";
            header.innerText="USUARIO "+dni+" "+nombre;
            inputNombre.value=nombre;
            cambiarEstado(false);
        } else {
            // El formato del DNI no es válido
            cambiarEstado(true);
            borrarCampos(true);
        }
    }
    
});
//Activa o desactiva los inputs
function cambiarEstado(estado){
    inputFecha.disabled = estado;
    inputEntrenamiento.disabled = estado;
    inputDescripcion.disabled = estado;
}

//Borra todos los campos menos DNI
//Si se pasa un false como parametro Nombre tampoco se borra
function borrarCampos(condicion){
    if(condicion)inputNombre.value="";
    inputFecha.value = "";
    inputEntrenamiento.value = "";
    inputDescripcion.value = "";
}