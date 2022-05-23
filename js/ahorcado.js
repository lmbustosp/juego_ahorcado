var botonInicio = document.querySelector("#iniciar_juego");
var botonAgregarPalabra = document.querySelector("#agregar_palabra");
var botonSalir = document.querySelector("#salir");
var botonGuardar = document.querySelector("#guardar");
var pizarra = document.querySelector("#pizarra_ahorcado");
var pincel = pizarra.getContext("2d");
var inputAgregarPalabra = document.querySelector("#input_agregar_palabra");
var textoInformativo = document.querySelector("#info")
var palabraSecreta = "";
var palabrasSecretas = ["HOLA","ALURA","ORACLE","PUERTA","RATON"];
var errores = 0;
var letrasErradas = [];
var letrasAcertadas = [];
var juegoHabilitado = true; //true habilita el juego
var pizarraCentroX = pizarra.width/2;
var anchoLetra = 25;
var espacioLetra = 5;
var inicioLineaLetra=[];

limpiarPantalla;

botonSalir.classList.add("invisible");
botonGuardar.classList.add("invisible");
botonInicio.addEventListener("click",empezarJuego);
botonAgregarPalabra.addEventListener("click",mostrarInputNuevaPalabra);
botonSalir.addEventListener("click",salir);
botonGuardar.addEventListener("click",agregarPalabraSecreta);
textoInformativo.classList.add("invisible");

function salir(){
    limpiarPantalla();
    inputAgregarPalabra.classList.add("invisible");
    pizarra.classList.add("invisible");
    botonGuardar.classList.add("invisible");
    botonInicio.classList.remove("invisible");
    botonInicio.innerHTML = "Iniciar Juego"
    botonSalir.classList.add("invisible");
    botonAgregarPalabra.classList.remove("invisible");
    textoInformativo.classList.add("invisible");
    window.removeEventListener("keypress", tecla_pulsada);
    inputAgregarPalabra.value = "";
}

function empezarJuego(){
    limpiarPantalla();
    pizarra.classList.remove("invisible");
    inputAgregarPalabra.classList.add("invisible");
    botonSalir.classList.remove("invisible");
    botonAgregarPalabra.classList.add("invisible");
    botonGuardar.classList.add("invisible");
    botonInicio.classList.remove("invisible");
    botonInicio.innerHTML = "Reiniciar Juego"
    window.addEventListener("keypress", tecla_pulsada) //comienza a escuchar las teclas presionadas
    elegirPalabra();
}

function elegirPalabra(){ //funcion que escoje aleatoreamente una palabra para adivinar.
    palabraSecreta = palabrasSecretas[Math.round(Math.random()*(palabrasSecretas.length-1))];
    juegoHabilitado = true;
    dibujarGuiones(palabraSecreta);
}

function dibujarGuiones(){ //dibuja los guines vacios
    limpiarPantalla();
    if (juegoHabilitado){
        pincel.beginPath();
        pincel.lineWidth=2;
        pincel.strokeStyle="red";
        pincel.moveTo(0,405);
        for(posicion = 0; posicion <= palabraSecreta.length; posicion++){
            inicioLineaLetra[posicion] = (anchoLetra*posicion);
            pincel.lineTo(inicioLineaLetra[posicion],405);
            pincel.stroke();
            pincel.moveTo(inicioLineaLetra[posicion]+espacioLetra,405);
        }
    }else if(!palabraSecreta == ""){
        juegoHabilitado = true;
        dibujarGuiones();
    }
}

function mostrarInputNuevaPalabra(){
    inputAgregarPalabra.classList.remove("invisible");
    inputAgregarPalabra.focus();
    pizarra.classList.add("invisible");
    botonAgregarPalabra.classList.add("invisible");
    botonInicio.classList.add("invisible");
    botonSalir.classList.remove("invisible");
    botonGuardar.classList.remove("invisible");
    textoInformativo.classList.remove("invisible");
}

function agregarPalabraSecreta(){ //funcion para agregar palabras para adivinar al juego.
    limpiarPantalla();
    palabraNueva = inputAgregarPalabra.value;
    if (palabraNueva == ""){
        alert("No ingresó ninguna palabra. Vuelva a intentar.")
        inputAgregarPalabra.focus();
        return;
        juegoHabilitado = false;
    }else if(palabraNueva.length > 8){
        alert("El máximo permitido son 8 letras.");
        inputAgregarPalabra.value = "";
        inputAgregarPalabra.focus();
        juegoHabilitado=false;
        return;
    }else{
        for(posicion = 0; posicion < palabraNueva.length; posicion++){
            if (palabraNueva[posicion].charCodeAt() < 65 || palabraNueva[posicion].charCodeAt() > 90){       
                alert("La palabra contiene caracteres no válidos. Vuelva a intentar.");
                inputAgregarPalabra.value = "";
                inputAgregarPalabra.focus();
                juegoHabilitado = false;
                return;
            }else{
                juegoHabilitado = true;
            } 
        }
    }
    if (juegoHabilitado){ //desde acá se verifica si la palabra ingresada ya existe.
        var repetida = false;
        for(var posicion = 0; posicion < palabrasSecretas.length; posicion++){
            if (palabraNueva == palabrasSecretas[posicion]){
                alert("La palabra '" + palabraNueva + "' ya fue elegida");
                repetida = true;
                break;
            }
        }
            if (repetida==false){
                palabrasSecretas.push(palabraNueva);
            }
    }    
    inputAgregarPalabra.value="";
    empezarJuego();
}
      
function tecla_pulsada(event){
    var tecla = String.fromCharCode(event.keyCode); //identifica la tecla presionada
    var expresion = new RegExp(tecla,"i"); //creo una RegularExpression con la tecla pulsada,sin distincion de MAY/min
    if(juegoHabilitado){
        juegoFinalizado = false;
        if((tecla.charCodeAt() == 13) || (tecla.charCodeAt() == 32)){ //deshabilito la tecla enter para evitar toque accidental
            event.preventDefault();
            return;
        }
        if(tecla.charCodeAt() < 65 || tecla.charCodeAt() > 90){
            alert("No está permitida tecla presionada. (" + tecla + ")");
            return;
        }
        if(expresion.test(palabraSecreta)){ //busca la tecla presionada dentro de la palabra. Y verifica si ya fue presionada anteriormente.
            var repetida = false;
            for(var posicion = 0; posicion < letrasAcertadas.length; posicion++){
                if (tecla == letrasAcertadas[posicion]){
                    alert("La letra " + tecla + " ya fue elegida");
                    repetida = true;
                    break;
                }
            }
            if (repetida == false){ //si la letra no está repetida, la escribe en el canvas.
                for(posicion = 0; posicion < palabraSecreta.length; posicion++){
                    if (tecla == palabraSecreta[posicion]){
                        letrasAcertadas.push(tecla);
                        pincel.font="22px Arial";
                        pincel.fillStyle="green";
                        pincel.fillText(tecla, (inicioLineaLetra[posicion]+(espacioLetra*1.5)), 400);
                        if(letrasAcertadas.length == palabraSecreta.length){ //si ya adivino todas, muestro el cartel "GANASTE!"
                            pincel.font="26px Arial";
                            pincel.fillStyle="blue";
                            pincel.textAlign = "center";
                            pincel.fillText("GANASTE !", pizarraCentroX, 26);
                            juegoHabilitado = false;
                            juegoFinalizado = true;
                            return; 
                        }
                    }
                }
            }       
        }else{
            if (errores < 11 ){ // Cheque el maximo de errores permitidos (11) y va dibujando el ahorcado.
                var repetida = false;
                for(var posicion = 0; posicion < letrasErradas.length; posicion++){
                    if (tecla == letrasErradas[posicion]){
                        alert("La letra " + tecla + " ya fue elegida");
                        repetida = true;
                        break;
                    }
                }
                if (repetida == false){
                    letrasErradas.push(tecla);
                    errores++;
                    pincel.font="18px Arial";
                    pincel.fillStyle="black";
                    pincel.fillText(tecla, 23*errores, 440);
                }    
                if (errores == 1){
                    dibujarLineasAhorcado(250,350,100,350);                    
                }
                if (errores == 2){
                    dibujarLineasAhorcado(100,350,100,75);
                }
                if (errores == 3){
                    dibujarLineasAhorcado(100,75,200,75);
                }
                if (errores == 4){
                    dibujarLineasAhorcado(200,75,200,125);
                }
                if (errores == 5){
                    dibujarCirculosAhorcado(222,147,200,147,22);
                }
                if (errores == 6){
                    dibujarLineasAhorcado(200,169,200,280);
                }
                if (errores == 7){
                    dibujarLineasAhorcado(200,280,225,320);
                }
                if (errores == 8){
                    dibujarLineasAhorcado(200,280,175,320);                    
                }
                if (errores == 9){
                    dibujarLineasAhorcado(200,180,225,220);
                }
                if (errores == 10){
                    dibujarLineasAhorcado(200,180,175,220);
                }
                if (errores == 11){
                    dibujarCara();
                    pincel.font="1,5em Arial";
                    pincel.textAlign="center";
                    pincel.textBaseline="middle";
                    pincel.fillStyle="blue";
                    pincel.fillText("Perdiste. La palabra era: ", pizarraCentroX, 30);
                    mostrarPalabraSecreta();
                    juegoHabilitado = false; //deshabita el juego
                    juegoFinalizado = true;
                    return;
                }
                }
            }    
    }else{
        if(juegoFinalizado){
            alert("Juego finalizado. Inicie un nuevo juego.");
        }
        return;
    }
}

function mostrarPalabraSecreta(){
        pincel.font="1,5em Arial";
        pincel.fillStyle="green";
        pincel.fillText(palabraSecreta, pizarraCentroX, 50);
}

function dibujarLineasAhorcado(puntoInicialX,puntoInicialY,x,y){
    pincel.beginPath();
    pincel.strokeStyle = "black";
    pincel.moveTo(puntoInicialX,puntoInicialY); 
    pincel.lineTo(x,y);
    pincel.stroke();  
}

function dibujarCirculosAhorcado(puntoInicialX,puntoInicialY,x,y,radio){
    pincel.beginPath();
    pincel.strokeStyle = "black";
    pincel.moveTo(puntoInicialX,puntoInicialY); 
    pincel.arc(x,y,radio,0,2*Math.PI);
    pincel.stroke(); 
}

function dibujarCara(){
    dibujarLineasAhorcado(175,173,225,173); //SOGA
    dibujarLineasAhorcado(185,135,195,145); //LINEA 1 OJO IZQUIERDO
    dibujarLineasAhorcado(195,135,185,145); //LINEA 2 OJO IZQUIERDO
    dibujarLineasAhorcado(215,135,205,145); //LINEA 1 OJO DERECHO
    dibujarLineasAhorcado(205,135,215,145); //LINEA 2 OJO DERECHO
    dibujarCirculosAhorcado(204,155,200,155,4); //BOCA
}

function limpiarPantalla(){
    pincel.fillStyle = "#D8DFE8";
    pincel.fillRect(0,0,400,460);
    letrasAcertadas.length = 0;
    letrasErradas.length = 0;
    inicioLineaLetra.length = 0;
    palabraSecreta
    errores = 0;
}