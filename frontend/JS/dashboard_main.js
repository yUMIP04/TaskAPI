const nueva_tarea = document.getElementById("nueva_tarea");
const btn_agregar = document.getElementById("agregar_tarea")
const div_Tareas = document.getElementById("list-tareas");
const ul = document.getElementById("contenedor-li");

/*🌟Funcion para pintar tareas */
function Pintar_Tareas(texto, id_Tarea = null) {
    try {
        if (texto) {
            const tarea = document.createElement("li");
            const btn_eliminar = document.createElement("button");
            
            btn_eliminar.textContent = "Eliminar";
            tarea.textContent = texto + " "; 
            
            tarea.className = "flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm";
            tarea.appendChild(btn_eliminar);
            ul.appendChild(tarea);
            div_Tareas.appendChild(ul);

            /*BOTON ELIMINAR */
            btn_eliminar.addEventListener("click", async () => {
                if (id_Tarea) {
                   
                    console.log("Eliminando de la BD la tarea ID:", id_Tarea);
                    const respuesta = await EliminarTarea(id_Tarea);
                    
                    if (respuesta && respuesta.mensaje === "Se eliminó la tarea con éxito") {
                        tarea.remove();
                    }
                } else {
                    
                    tarea.remove();
                }
            });

        } else {
            alert("El campo está vacío");
        }
    } catch (e) {
        console.error(`Hubo un error al pintar: ${e}`);
    }
}

/* 🌟 Cargar tareas del servidor al iniciar */
document.addEventListener("DOMContentLoaded", async () => {
    const id_usuario_logueado = localStorage.getItem("usuarioId");

    if (id_usuario_logueado) {
        const resultado = await PintarTareas();

        if (resultado && resultado.tareas) {
            
            div_Tareas.innerHTML = "";
            ul.innerHTML = ""; 

           
            resultado.tareas.forEach(tarea => {
                Pintar_Tareas(tarea.texto, tarea.id); 
            });
        }
    } else {
        alert("No has iniciado sesión, regresando al login...");
        window.location.href = "../index.html";
    }
});

/*Boton para agregar */
btn_agregar.addEventListener("click", async () => {


    const valor_txt = nueva_tarea.value;
   

    if(valor_txt.trim() !== ""){
        const respuesta = await AgregarTareas(valor_txt);

        if(respuesta && respuesta.mensaje === "Se creo la tarea exitosamente"){
            Pintar_Tareas(valor_txt, respuesta.id_tarea);
             nueva_tarea.value = "";
        }
    } else{
        alert("El campo esta vacio");
    }
   
});

/*🌟FUNCIONES DE LAS APIS */

async function EliminarTarea(id_Tarea) {

    const token = localStorage.getItem("token");

    try{

        const ApiTarea = await fetch(`http://localhost:3000/tareas/${id_Tarea}`,{
        
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const datos = await ApiTarea.json();
        return datos;
    }catch(e){
        console.error(`Hubo un error al eliminar la tarea: ${e}`);
    }
}

/*pintar tareas */
async function PintarTareas(usuario_id) {
    
    try{

        const token = localStorage.getItem("token");

        const ApiTareas = await fetch(`http://localhost:3000/obtener-tareas`, {
            method:'GET',

            headers:{
                'Authorization': `Bearer ${token}`
            }

        });

        const datos = await ApiTareas.json();
        return datos;
    }catch(e){
        console.error(`Hubo un erro al obtener las tareas`);
    }
}

/*agregar tareas */

async function AgregarTareas(texto ) {
    
    try{

        const token = localStorage.getItem("token");

        const APITareas = await fetch('http://localhost:3000/tareas',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },

            body:JSON.stringify({
                texto:texto})
        });

        const datos = await APITareas.json();

        return datos;
    }catch(e){
        console.error(`Hubo un error al agregar la tarea: ${e}`);
    }
}