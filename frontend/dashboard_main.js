const nueva_tarea = document.getElementById("nueva_tarea");
const btn_agregar = document.getElementById("agregar_tarea")
const div_Tareas = document.getElementById("list-tareas");
const ul = document.getElementById("contenedor-li");

/*🌟Funcion para pintar tareas */
function Pintar_Tareas(txt){
     try{
        const valor_tarea = txt.value;
        const btn_eliminar = document.createElement("button");

        div_Tareas.innerHTML = "";

       if(valor_tarea){
        const tarea = document.createElement("li");
        
        btn_eliminar.textContent = "Eliminar";
        tarea.textContent = valor_tarea;
        tarea.append(btn_eliminar);
        ul.appendChild(tarea);
        div_Tareas.appendChild(ul);

        /*BOTON ELIMINAR */

        btn_eliminar.addEventListener("click", async () => {
           await EliminarTarea(tarea.id);
        })
        
        txt.value = "";
       } else{
        alert("El campo esta vacio");
       }
    }catch(e){
        console.error(`Hubo un error: ${e}`);
    }
}

/*Boton para agregar tareas */
btn_agregar.addEventListener("click", () =>{

    Pintar_Tareas(nueva_tarea);
});


/*FUNCIONES DE LAS APIS */

async function EliminarTarea(id_Tarea) {
    try{

        const ApiTarea = await fetch(`http://localhost:3000/tareas/${id_Tarea}`,{

            method: 'DELETE',
        });

        const datos = await ApiTarea.json();
    }catch(e){
        console.error(`Hubo un error al eliminar la tarea: ${e}`);
    }
}

async function PintarTareas(usuario_id) {
    
    try{
        const ApiTareas = await fetch(`http://localhost:3000/tareas/${usuario_id}`, {
            method:'GET',
        });

        const datos = await ApiTareas.json();
        return datos;
    }catch(e){
        console.error(`Hubo un erro al obtener las tareas`);
    }
}