/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author menge
 */
public class Partida {
    private Jugador jugador; // Jugador que participa en la partida
    private List<Respuesta> respuestas; // Respuestas del jugador
    private List<Pregunta> preguntas;
    private String estado; // Estado de la partida: "EN_PROGRESO", "FINALIZADA"
    private int puntaje; // Puntaje acumulado
    private int rachaActual; // Nueva propiedad: racha actual de respuestas correctas
    private int rachaMaxima; // Nueva propiedad: racha máxima alcanzada
    private ConfiguracionPartida configPartida;
    

    // Constructor inicial que asigna el jugador y la configuración del juego
    public Partida(Jugador jugador, String dificultad, int tiempoPorPregunta, int puntaje, int rachaActual, int rachaMaxima) {
        this.jugador = jugador;
        this.respuestas = new ArrayList<>();
        this.preguntas = new ArrayList<>();
        this.estado = "EN_PROGRESO";
        this.puntaje = puntaje;
        this.rachaActual = 0;
        this.rachaMaxima = 0;
        this.configPartida = new ConfiguracionPartida(dificultad , tiempoPorPregunta);
    }
    //Formula para calculo de puntaje
    //puntaje=max(0,puntaje_maximo−(tiempo_transcurrido×penalizacion_por_segundo))

    // Método para registrar una nueva respuesta
    public void registrarRespuesta(Respuesta respuesta) {
    respuestas.add(respuesta);
    // Puntaje máximo por pregunta
    int puntajeMaximo = 100;
    // Penalización por cada segundo que tarda en responder
    int penalizacionPorSegundo = 5;

    // Verificar si la respuesta es correcta
    if (respuesta.getPreguntaAsociada().getRespuestaCorrecta().equalsIgnoreCase(respuesta.getOpcionElegida())) {
        // Calcular el puntaje según el tiempo transcurrido
        int tiempoTranscurrido = respuesta.getTiempoTranscurrido();
        int puntajeObtenido = Math.max(0, puntajeMaximo - (tiempoTranscurrido * penalizacionPorSegundo));
        
        // Actualizar el puntaje total del jugador
        puntaje += puntajeObtenido;
        
        // Incrementar racha actual y actualizar racha máxima si es necesario
            rachaActual++;
            if (rachaActual > rachaMaxima) {
                rachaMaxima = rachaActual;
            }
        } else {
            // Resetear la racha si la respuesta es incorrecta
            rachaActual = 0;
        }
    
    }
    
    // Método para registrar una nueva pregunta en la partida
    public void registrarPregunta(Pregunta pregunta) {
        if (pregunta != null) {
            preguntas.add(pregunta);
            System.out.println("Pregunta registrada correctamente: " + pregunta.getEnunciado());
        } else {
            System.err.println("La pregunta no puede ser nula.");
        }
    }

    public void finalizarPartida() {
        this.estado = "FINALIZADA";
        // Multiplicar el puntaje por la racha máxima alcanzada
        puntaje *= rachaMaxima > 0 ? rachaMaxima : 1;
        // Aquí podrías almacenar el resultado de la partida y actualizar el histórico del jugador
    }

    // Getters y Setters
    public Jugador getJugador() { return jugador; }
    public List<Respuesta> getRespuestas() { return respuestas; }
    public String getEstado() { return estado; }
    public int getPuntaje() { return puntaje; }
    public int getRachaActual() { return rachaActual; }
    public int getRachaMaxima() { return rachaMaxima; }
    public void setPuntaje(int puntaje) { this.puntaje = puntaje; }

    public ConfiguracionPartida getConfigPartida() {
        return this.configPartida;
    }
}
