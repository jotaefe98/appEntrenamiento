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
const borrar = document.getElementById("borrar");
const guardar = document.getElementById("guardar");
const actualizar = document.getElementById("actualizar");
const cambioUsuario = document.getElementById("cambioUsuario");

//Declaracion de variables
let dni;
let nombre;
let existeDni;
let posicion;

//Comprobacion del dni
inputDni.addEventListener('keyup', (evento) => {
    //Cada vez que pulsa enter realiza las comprobaciones
    if(evento.key == "Enter"){
        let contador = 0;
        existeDni=false;
        //Recorre todos los usuarios del json para comprobar si coincide con algun dni
        usuarios.forEach(function(object){
            if(object.dni==inputDni.value){
                dni=object.dni;
                nombre=object.nombre;
                existeDni=true;
                posicion=contador;
            }
            contador++;
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

//Accion al pulsar borrar
//Borrar Fecha, Entreno, Descripcion
borrar.addEventListener('click',()=>{
    borrarCampos(false);
});

//Borra TODOS los inputs y bloquea
cambioUsuario.addEventListener('click',()=>{
    inputDni.value="";
    borrarCampos(true);
    cambiarEstado(true);
});

//Guarda los values en el JSON(FALTA POR MEJORAR)
guardar.addEventListener('click',()=>{
    usuarios[posicion].dni = inputDni.value
	usuarios[posicion].nombre = inputNombre.value
	usuarios[posicion].dia = inputFecha.value
    usuarios[posicion].tipo_entrene = inputEntrenamiento.value
    usuarios[posicion].descripcion = inputDescripcion.value
	fs.writeFileSync('./Usuarios.json', JSON.stringify(usuarios));
});

//Activa o desactiva los inputs
function cambiarEstado(estado){
    inputFecha.disabled = estado;
    inputEntrenamiento.disabled = estado;
    inputDescripcion.disabled = estado;
    borrar.disabled = estado;
    guardar.disabled = estado;
    actualizar.disabled = estado;
    cambioUsuario.disabled = estado;
}

//Borra todos los campos menos DNI
//Si se pasa un false como parametro Nombre Img y Header no se borran
function borrarCampos(condicion){
    if(condicion){
        img.src = "";
        inputNombre.value="";
        header.innerText="USUARIO";
    }
    inputFecha.value = "";
    inputEntrenamiento.value = "";
    inputDescripcion.value = "";
}