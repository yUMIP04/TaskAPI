const formulario = document.getElementById("formulario-Login");
const CorreoFormulario = document.getElementById("correo");
const PassFormulario = document.getElementById("password");
const notificacion = document.getElementById("notification");

formulario.addEventListener("submit", async (event) =>{

    event.preventDefault();

    console.log("Formulario capturado con exito");

    let valorCorreo = CorreoFormulario.value;
    let valorPass = PassFormulario.value;

    try{
        
    const respuestaServidor = await FormularioLogin(valorCorreo, valorPass);

    /*🌟 validacion de contraseña */
    if(respuestaServidor.mensaje == "La contraseña coincide" && respuestaServidor.correo == valorCorreo){
        localStorage.clear();

        localStorage.setItem("token", respuestaServidor.token);

        localStorage.setItem("usuarioId", respuestaServidor.correo);
        
    notificacion.textContent= "Sesion exitosa";
    notificacion.style.color = "green";

    console.log("Respuesta del Servidor: ", respuestaServidor)
    window.location.href = "dashboard.html"

    
    } else{
        notificacion.textContent= "Sesion negada";
    notificacion.style.color = "red";
    }
    
    }catch(e){
        console.error(`No se pudo conectar al Servidor: ${e}`);
    }
})

/*FETCH PARA LOGIN */

async function FormularioLogin(correo, contraseña) {
    
    const APILogin = await fetch('http://localhost:3000/login',{
        method: 'POST',

        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            correo:correo, 
            password:contraseña})
    })

    const Datos = await APILogin.json();
    return Datos;
}