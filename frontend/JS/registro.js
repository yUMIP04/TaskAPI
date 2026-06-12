

const correo = document.getElementById("email-input");
const password = document.getElementById("password-input");
const confirm_password = document.getElementById("password-confirm-input");
const Formulario = document.getElementById("Registrar-form");

function Registrar_Usuario(correo, password, confirm_password, formulario){

    try{
        formulario.addEventListener('submit', async (e) =>{

            e.preventDefault();

            let valor_correo = correo.value;
            let valor_password = password.value;
            let Valorconfirm_password = confirm_password.value;

            if(valor_correo.trim() !== "" && valor_password.trim() === Valorconfirm_password.trim() && valor_password.length >= 8){
                
                const APIRegistrar = await APIRegistro(valor_correo, valor_password);

                alert("Se ha registrado exitosamente tu usuario");

                window.location.href= '../index.html';
            } else{
                alert("Por favor llenar bien los campos, las contraseñas no coinciden, minimo 8 caracteres.");
            }
        })

    }catch(e){
        console.error(`Hubo un error al registrar el usuario: ${e}`);
    }
}

Registrar_Usuario(correo, password, confirm_password, Formulario);

/*API Registro */
async function APIRegistro(correo, password) {
    
    try{
         const APIregistro = await fetch(`http://localhost:3000/registro`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },  

            body: JSON.stringify({
                correo: correo,
                password:password
            })
         })

         const datos = await APIregistro.json();

         return datos;

    }catch(e){
        console.error(`Hubo un error con el servidor al registrar usuario: ${e}`);
    }
}