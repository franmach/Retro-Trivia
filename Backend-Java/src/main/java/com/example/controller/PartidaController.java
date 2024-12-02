/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.controller;

import java.util.Map;
import com.example.model.ApiManager;
import com.example.model.ConfiguracionPartida;
import com.example.model.Jugador;
import com.example.model.Partida;
import com.example.model.Pregunta;
import com.example.model.Respuesta;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;


/* imports para integrar el servicio y persistencia*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.service.PartidaService;
/**
 *
 * @author menge
 */
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class PartidaController {

    @Autowired
    private final PartidaService partidaService;
    private final ApiManager apiManager;

    public PartidaController(ApiManager apiManager, PartidaService partidaService) {
        this.apiManager = apiManager;
        this.partidaService = partidaService;
    }

    // Iniciar Partida (Single Player)
    @PostMapping("/iniciarPartida")
    public ResponseEntity<Partida> iniciarPartida(@RequestBody ConfiguracionPartida configuracion) {
        // Crear jugador temporal hasta que haya autenticación
        Jugador jugador = new Jugador("Jugador1", "correo@ejemplo.com", "1234");
        
        int puntajeInicial = 0;

        // Crear nueva partida con la configuración dada
        Partida nuevaPartida = new Partida(jugador, configuracion.getDificultad(), configuracion.getTiempoPorPregunta(), puntajeInicial);
        
        // Guardar la partida en la base de datos
        partidaService.guardarPartida(nuevaPartida);

        return ResponseEntity.ok(nuevaPartida);
    }

    // Generar una nueva pregunta para la partida
    @GetMapping("/generarPregunta")
    public ResponseEntity<Pregunta> generarPregunta(@RequestParam Long partidaId, @RequestParam String categoria) {
        Partida partida = partidaService.buscarPartidaPorId(partidaId);

        if (partida == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        // Llamar al API Manager para generar una nueva pregunta de la categoría seleccionada
        String dificultad = partida.getConfigPartida().getDificultad();
        Pregunta nuevaPregunta = apiManager.generarPregunta(categoria, dificultad);
        partida.registrarPregunta(nuevaPregunta); // Registrar la pregunta en la partida
        
        // Actualizar la partida con la nueva pregunta registrada
        partidaService.actualizarPartida(partida);
        
        return ResponseEntity.ok(nuevaPregunta);
    }

    // Registrar la respuesta del jugador
    @PostMapping("/registrarRespuesta")
    public ResponseEntity<String> registrarRespuesta(@RequestParam Long partidaId, @RequestBody Respuesta respuesta) {
        Partida partida = partidaService.buscarPartidaPorId(partidaId);
        if (partida == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No hay partida activa");
        }

        // Registrar la respuesta en la partida
        partida.registrarRespuesta(respuesta);

        // Verificar si la respuesta fue correcta
        boolean respuestaCorrecta = respuesta.getPreguntaAsociada().getRespuestaCorrecta().equalsIgnoreCase(respuesta.getOpcionElegida());
        int puntajeObtenido = respuestaCorrecta ? calcularPuntaje(partida, respuesta) : 0;

        // Actualizar puntaje en la partida solo si es correcta
        if (respuestaCorrecta) {
            partida.setPuntaje(partida.getPuntaje() + puntajeObtenido);
        }
        
        // Guardar la actualización de la partida
        partidaService.actualizarPartida(partida);

        // Construir la respuesta
        String mensaje = respuestaCorrecta ? "Respuesta correcta" : "Respuesta incorrecta";
        mensaje += ". Puntaje obtenido: " + puntajeObtenido;

        return ResponseEntity.ok(mensaje);
    }
    
     // Obtener pista para una pregunta específica
    @PostMapping("/pista")
    public ResponseEntity<Map<String, String>> obtenerPista(@RequestParam Long partidaId,@RequestBody Map<String, String> request) {
        Partida partida = partidaService.buscarPartidaPorId(partidaId);
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
    private int calcularPuntaje(Partida partida, Respuesta respuesta) {
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
