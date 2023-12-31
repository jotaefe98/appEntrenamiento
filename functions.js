//Lee y carga el archivo .json y lo transforma en un array
const fs = require('fs');
let fichero = fs.readFileSync('Usuarios.json')
let usuarios = new Array();
usuarios = JSON.parse(fichero);

//Ventana de dialogo
const { dialog } = require('@electron/remote');

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
let controlActualizar = false;

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
            dialog.showErrorBox("Atención", "DNI Incorrecto")

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
    if (sePuedeGuardar()) guardarUsuario()
});

//Actualizar, la primera vez que se ejecuta controlActualizar es false
actualizar.addEventListener('click',()=>{
    if(!controlActualizar){
        inputDni.disabled=true;
        cambiarEstadoBotones(true,false)
        actualizar.classList.remove("btn-primary")
        actualizar.classList.add("btn-positive")
        controlActualizar=true;
    }else{
        if (sePuedeGuardar()) {
            guardarUsuario()
            actualizar.classList.remove("btn-positive")
            actualizar.classList.add("btn-primary")
            inputDni.disabled=false;
            cambiarEstadoBotones(false,false)
            controlActualizar=false;
        }         
    }
});

//Comprueba si se puede guardar y devuelve un boolean
function sePuedeGuardar(){
    let sePuede;
        if(inputDni.value!==usuarios[posicion].dni){
            dialog.showErrorBox("Atención", "Dni diferente al original ("+usuarios[posicion].dni+")")
            sePuede=false
            console.log(usuarios[posicion].dni)
        }
        else if(inputFecha.value==="" || inputEntrenamiento.value==="" || inputDescripcion.value===""){
            sePuede=false
            dialog.showErrorBox("Atención", "Falta por rellenar algun campo")
        }else{
            sePuede=true
        }
        return sePuede
}

//Guarda los usuarios en el JSON
function guardarUsuario(){
    usuarios[posicion].dni = inputDni.value
	usuarios[posicion].nombre = inputNombre.value
	usuarios[posicion].dia = inputFecha.value
    usuarios[posicion].tipo_entrene = inputEntrenamiento.value
    usuarios[posicion].descripcion = inputDescripcion.value
	fs.writeFileSync('./Usuarios.json', JSON.stringify(usuarios));
    dialog.showMessageBox({
        type: 'info',
        title: 'Guardado Exitoso',
        message: `El archivo se ha guardado exitosamente.`,
        buttons: ['Aceptar']
      })
}

//Activa o desactiva los inputs (true = desactivado)
function cambiarEstado(estado){

    inputFecha.disabled = estado;
    inputEntrenamiento.disabled = estado;
    inputDescripcion.disabled = estado;
    actualizar.disabled = estado;
    cambiarEstadoBotones(estado,true)
}

//Cambia los botones de estado segun estado(true = desactivado), y si los apaga todos
function cambiarEstadoBotones(estado,apagarTodos){

    let clase1 = estado ? "btn-default" : "btn-primary";
    let clase2 = estado ? "btn-primary" : "btn-default";
    if(apagarTodos){
        actualizar.classList.remove("btn",clase2)
        actualizar.classList.add("btn",clase1)
    }
        borrar.classList.remove("btn",clase2)
        guardar.classList.remove("btn",clase2)
        cambioUsuario.classList.remove("btn",clase2)

        borrar.classList.add("btn",clase1)
        guardar.classList.add("btn",clase1)
        cambioUsuario.classList.add("btn",clase1)

        borrar.disabled = estado;
        guardar.disabled = estado;
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