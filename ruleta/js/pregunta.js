document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Obtener la categoría seleccionada del localStorage
        const categoriaSeleccionada = localStorage.getItem('categoriaSeleccionada');

        // Verificar si la categoría fue seleccionada y existe en el localStorage
        if (!categoriaSeleccionada) {
            console.error("Error: No se encontró ninguna categoría seleccionada en el localStorage.");
            document.getElementById('categoria').textContent = "Error: No se seleccionó ninguna categoría.";
            return; // Salir si no hay categoría
        }

        document.getElementById('categoria').textContent = `Categoría: ${categoriaSeleccionada}`;

        // Solicitar la pregunta al backend
        const response = await fetch(`https://localhost:8080/api/pregunta?categoria=${encodeURIComponent(categoriaSeleccionada)}`);

        //const response = await fetch(`https://localhost:8080/api/pregunta?categoria=${encodeURIComponent(categoriaSeleccionada)}`, { mode: 'no-cors' });

        // Verificar si la respuesta es correcta (status 200)
        if (!response.ok) {
            throw new Error(`Error en la solicitud al backend: ${response.statusText}`);
        }

        const data = await response.json();
        //verificar datos desde el backend
        console.log("Datos recibidos del backend:", data); // Imprime la respuesta completa

        // Obtener el enunciado hasta el primer signo de cierre de pregunta
        const enunciadoCompleto = data.enunciado || "No se pudo obtener la pregunta.";
        const preguntaSoloTexto = enunciadoCompleto.split('?')[0] + '?';

        // Mostrar solo la pregunta sin las opciones en el enunciado
        document.getElementById('preguntaTexto').textContent = preguntaSoloTexto;    

        // Mostrar las opciones de respuesta
        data.opcionesDeRespuesta.forEach((opcion, index) => {
            const opcionElement = document.getElementById(`opcion${index + 1}`);
            if (opcionElement) {
                opcionElement.textContent = opcion;
            }
        });

    } catch (error) {
        console.error('Error al obtener la pregunta:', error);
        document.getElementById('preguntaTexto').textContent = "Hubo un error al cargar la pregunta.";
    }
});