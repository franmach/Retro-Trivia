/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package controller;

import java.util.Map;
import model.ApiManager;
import model.ConfiguracionPartida;
import model.Jugador;
import model.Partida;
import model.Pregunta;
import model.Respuesta;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author menge
 */
@RestController
@RequestMapping("/api")
public class PartidaController {

    private Partida partida; // Por ahora mantenemos la partida en memoria
    private final ApiManager apiManager;

    public PartidaController(ApiManager apiManager) {
        this.apiManager = apiManager;
    }

    // Iniciar Partida (Single Player)
    @PostMapping("/iniciarPartida")
    public ResponseEntity<Partida> iniciarPartida(@RequestBody ConfiguracionPartida configuracion) {
        // Crear jugador temporal hasta que haya autenticación
        Jugador jugador = new Jugador("Jugador1", "correo@ejemplo.com", "1234");
        
        int puntajeInicial = 0;

        // Crear nueva partida con la configuración dada
        partida = new Partida(jugador, configuracion.getDificultad(), configuracion.getTiempoPorPregunta(), puntajeInicial);

        return ResponseEntity.ok(partida);
    }

    // Generar una nueva pregunta para la partida
    @GetMapping("/generarPregunta")
    public ResponseEntity<Pregunta> generarPregunta(@RequestParam String categoria) {
        if (partida == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        // Llamar al API Manager para generar una nueva pregunta de la categoría seleccionada
        String dificultad = partida.getConfigPartida().getDificultad();
        Pregunta nuevaPregunta = apiManager.generarPregunta(categoria, dificultad);
        partida.registrarPregunta(nuevaPregunta); // Registrar la pregunta en la partida
        return ResponseEntity.ok(nuevaPregunta);
    }

    // Registrar la respuesta del jugador
    @PostMapping("/registrarRespuesta")
    public ResponseEntity<String> registrarRespuesta(@RequestBody Respuesta respuesta) {
        if (partida == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No hay partida activa");
        }

        // Registrar la respuesta en la partida
        partida.registrarRespuesta(respuesta);

        // Verificar si la respuesta fue correcta
        boolean respuestaCorrecta = respuesta.getPreguntaAsociada().getRespuestaCorrecta().equalsIgnoreCase(respuesta.getOpcionElegida());
        int puntajeObtenido = respuestaCorrecta ? calcularPuntaje(respuesta) : 0;

        // Actualizar puntaje en la partida solo si es correcta
        if (respuestaCorrecta) {
            partida.setPuntaje(partida.getPuntaje() + puntajeObtenido);
        }

        // Construir la respuesta
        String mensaje = respuestaCorrecta ? "Respuesta correcta" : "Respuesta incorrecta";
        mensaje += ". Puntaje obtenido: " + puntajeObtenido;

        return ResponseEntity.ok(mensaje);
    }
    
     // Obtener pista para una pregunta específica
    @PostMapping("/pista")
    public ResponseEntity<Map<String, String>> obtenerPista(@RequestBody Map<String, String> request) {
        if (partida == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "No hay partida activa"));
        }

        String pregunta = request.get("pregunta");
        if (pregunta == null || pregunta.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La pregunta es requerida"));
        }

        try {
            String pista = apiManager.generarPista(pregunta);
            return ResponseEntity.ok(Map.of("pista", pista));
        } catch (Exception e) {
            System.err.println("Error al obtener la pista: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "No se pudo generar una pista"));
        }
    }

    // Método auxiliar para calcular el puntaje basado en el tiempo transcurrido y la dificultad
    private int calcularPuntaje(Respuesta respuesta) {
        int puntajeMaximo = 200;
        int penalizacionPorSegundo = 3;

        int tiempoTranscurrido = respuesta.getTiempoTranscurrido();
        int puntajeObtenido = Math.max(0, puntajeMaximo - (tiempoTranscurrido * penalizacionPorSegundo));

        // Aplicar el factor según la dificultad de la partida
        String dificultad = partida.getConfigPartida().getDificultad();
        double factorDificultad = 1.0;

        switch (dificultad.toLowerCase()) {
            case "fácil":
                factorDificultad = 1.0;
                break;
            case "intermedio":
                factorDificultad = 1.25;
                break;
            case "difícil":
                factorDificultad = 1.50;
                break;
            default:
                System.out.println("Dificultad desconocida. Usando factor por defecto (1.0).");
        }

        puntajeObtenido = (int) Math.round(puntajeObtenido * factorDificultad);

        return puntajeObtenido;
    }
    
    
}
