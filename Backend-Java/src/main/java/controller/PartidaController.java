/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package controller;

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

        // Crear nueva partida con la configuración dada
        partida = new Partida(jugador, configuracion.getDificultad(), configuracion.getTiempoPorPregunta());

        return ResponseEntity.ok(partida);
    }

    // Generar una nueva pregunta para la partida
    @GetMapping("/generarPregunta")
    public ResponseEntity<Pregunta> generarPregunta(@RequestParam String categoria) {
        if (partida == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        // Llamar al API Manager para generar una nueva pregunta de la categoría seleccionada
        Pregunta nuevaPregunta = apiManager.generarPregunta(categoria);
        partida.setCategoriaActual(categoria);
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

    // Método auxiliar para calcular el puntaje basado en el tiempo transcurrido
    private int calcularPuntaje(Respuesta respuesta) {
        int puntajeMaximo = 100;
        int penalizacionPorSegundo = 5;

        int tiempoTranscurrido = respuesta.getTiempoTranscurrido();
        int puntajeObtenido = Math.max(0, puntajeMaximo - (tiempoTranscurrido * penalizacionPorSegundo));

        return puntajeObtenido;
    }
}
