//Imports
import fs from "fs";
import readline from "readline";

//Declaration
const TASKS_FILE = "todo.json";

const rl = readline.createInterface(process.stdin, process.stdout);

//Main Program
function programaPrincipal() {
  rl.question(
    "¿Qué quieres hacer? (agregar/ver/marcar/borrar/salir): ",
    (answer) => {
      switch (answer) {
        case "agregar":
          agregarTarea();
          break;
        case "ver":
          verTareas(cargarTareas());
          programaPrincipal();
          break;
        case "marcar":
          marcarTareaCompleta();
          break;
        case "borrar":
          borrarTarea();
          break;
        case "salir":
          console.log("¡Hasta pronto!");
          process.exit();
        default:
          console.log("Opción no válida. Intenta de nuevo.");
          programaPrincipal();
      }
    }
  );
}

//Functions
//Load
function cargarTareas() {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(TASKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al cargar las tareas:", error.message);
    return [];
  }
}

//Save
function guardarTareas(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error al guardar las tareas:", error.message);
  }
}

//Agregar tarea
function agregarTarea() {
  rl.question("Ingrese la nueva tarea: ", (descripcion) => {
    const tasks = cargarTareas();
    tasks.push({ descripcion, completa: false });
    guardarTareas(tasks);
    console.log("Tarea agregada exitosamente");
    programaPrincipal();
  });
}

//View
function verTareas(tareas) {
  tareas = cargarTareas();
  if (tareas.length === 0) {
    console.log("Tareas no encontradas");
  } else {
    tareas.forEach((tarea, index) => {
      const status = tarea.completa ? "Completado" : "Pendiente";
      console.log(`${index + 1}. ${tarea.descripcion} ${status}`);
    });
  }
}

// Mark a task as complete
function marcarTareaCompleta() {
  const tarea = cargarTareas();
  verTareas(tarea);
  rl.question(
    "Ingrese el número de tarea para marcar como completada: ",
    (respuesta) => {
      const index = parseInt(respuesta) - 1;
      if (index >= 0 && index < tarea.length) {
        tarea[index].completa = true;
        guardarTareas(tarea);
        console.log("Tarea marcada como completada");
      } else {
        console.log("Numero de tarea invalido");
      }
      programaPrincipal();
    }
  );
}

// Delete a task
function borrarTarea() {
  const tarea = cargarTareas();
  verTareas();
  rl.question("Ingrese el número de tarea para eliminarla: ", (respuesta) => {
    const index = parseInt(respuesta) - 1;
    if (index >= 0 && index < tarea.length) {
      tarea.splice(index, 1);
      guardarTareas(tarea);
      console.log("Tarea eliminada exitosamente");
    } else {
      console.log("Numero de tarea invalido");
    }
    programaPrincipal();
  });
}

programaPrincipal();
