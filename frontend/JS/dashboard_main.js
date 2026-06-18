const nueva_tarea = document.getElementById("nueva_tarea");
const btn_agregar = document.getElementById("agregar_tarea")
const div_Tareas = document.getElementById("list-tareas");
const ul = document.getElementById("contenedor-li");
const input_fecha = document.getElementById("fecha_limite");


/*🌟Funcion para pintar tareas */
function Pintar_Tareas(texto, id_Tarea = null, fecha_limite = null) { 
    try {
        if (texto) {
            const tarea = document.createElement("li");
            const btn_eliminar = document.createElement("button");
            const check_tareaTerminada = document.createElement("input");
            const check_tareaPrioridad = document.createElement("input");
            check_tareaPrioridad.type = 'checkbox';
            check_tareaTerminada.type = 'checkbox';
            btn_eliminar.textContent = "Eliminar";
            
          

          
            const bloqueContenido = document.createElement("div");
            bloqueContenido.className = "flex-1 flex flex-col ml-3 gap-0.5"; 

           
            const contenedorTexto = document.createElement("span");
            contenedorTexto.textContent = texto;
            contenedorTexto.className = "text-slate-700 font-medium text-sm transition-all";

           
            const contenedorFechas = document.createElement("div");
            contenedorFechas.className = "text-[11px] text-slate-400 flex flex-wrap gap-x-2";
            
            
            const hoy = new Date().toLocaleDateString();
            contenedorFechas.textContent = `📅 Creada: ${hoy}`;

           
            if (fecha_limite) {
              
                const fechaLimpia = fecha_limite.split('T')[0];
                contenedorFechas.textContent += ` ⚠️ Vence: ${fechaLimpia}`;
            }

            
            bloqueContenido.appendChild(contenedorTexto);
            bloqueContenido.appendChild(contenedorFechas);
            
          
            tarea.className = "flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm";
            
           
            tarea.prepend(check_tareaPrioridad);
            tarea.prepend(check_tareaTerminada);
            tarea.appendChild(bloqueContenido); 
            tarea.appendChild(btn_eliminar);
            
            ul.appendChild(tarea);
            div_Tareas.appendChild(ul);

          
            const estadoGuardado = localStorage.getItem(`tarea${id_Tarea}_completada`);
            const prioridadGuardada = localStorage.getItem(`tarea${id_Tarea}_prioridad`);
            if(estadoGuardado === "true"){
                check_tareaTerminada.checked = true;
                tarea.style.textDecoration = "underline";
                tarea.style.color = "green";
            } 

            if ( prioridadGuardada === "true"){
                check_tareaPrioridad.checked = true;
                tarea.style.color = "red";
            }
            if(check_tareaTerminada){
                check_tareaTerminada.addEventListener('change', () =>{
                    if(check_tareaTerminada.checked){
                        tarea.style.textDecoration = "underline";
                        tarea.style.color = "green";
                        localStorage.setItem(`tarea${id_Tarea}_completada`, "true");
                        check_tareaPrioridad.checked = false;
                        localStorage.removeItem(`tarea${id_Tarea}_prioridad`);
                    } else{
                        tarea.style.textDecoration = "none";
                        tarea.style.color = "";
                        localStorage.removeItem(`tarea${id_Tarea}_completada`);
                    }
                })
            }

            if(check_tareaPrioridad){
                check_tareaPrioridad.addEventListener('change', () =>{
                    if(check_tareaPrioridad.checked){
                        tarea.style.color = "red";
                        tarea.style.textDecoration = "none";
                        localStorage.setItem(`tarea${id_Tarea}_prioridad`, "true");
                        check_tareaTerminada.checked = false;
                        localStorage.removeItem(`tarea${id_Tarea}_completada`);
                    } else{
                        tarea.style.color = "";
                        localStorage.removeItem(`tarea${id_Tarea}_prioridad`);
                    }
                })
            }

            /*BOTON ELIMINAR */
            btn_eliminar.addEventListener("click", async () => {
                if (id_Tarea) {
                    console.log("Eliminando de la BD la tarea ID:", id_Tarea);
                    const respuesta = await EliminarTarea(id_Tarea);
                    
                    if (respuesta && respuesta.mensaje === "Se eliminó la tarea con éxito") {
                        localStorage.removeItem(`tarea${id_Tarea}_completada`);
                        localStorage.removeItem(`tarea${id_Tarea}_prioridad`);
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
   const fecha_limite = input_fecha.value;

    if(valor_txt.trim() !== ""){
        const respuesta = await AgregarTareas(valor_txt, fecha_limite);

        if(respuesta && respuesta.mensaje === "Se creo la tarea exitosamente"){
            Pintar_Tareas(valor_txt, respuesta.id_tarea);
             nueva_tarea.value = "";
             input_fecha = "";
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

async function AgregarTareas(texto, fecha_limite ) {
    
    try{

        const token = localStorage.getItem("token");

        const APITareas = await fetch('http://localhost:3000/tareas',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },

            body:JSON.stringify({
                texto:texto,
            fecha_limite: fecha_limite})
        });

        const datos = await APITareas.json();

        return datos;
    }catch(e){
        console.error(`Hubo un error al agregar la tarea: ${e}`);
    }
}

/*Buscar Tarea */

async function BuscarTarea(txt) {

    try{
        const token = localStorage.getItem("token");

        const APITareas = await fetch(`http://localhost:3000/buscar-tareas?nombre=${encodeURIComponent(txt)}`,
            {
                method:'GET',

                headers:{
                     'Authorization': `Bearer ${token}`
                }
            },

        )

        const datos = await APITareas.json();
        return datos;
    }catch(e){

        console.error(`Hubo un error al buscar la tarea: ${e}`);
    }
    
}