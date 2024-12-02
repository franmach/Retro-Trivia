package com.example.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "partida")
public class Partida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "jugador_id", nullable = false)
    private Jugador jugador;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Respuesta> respuestas = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    private List<Pregunta> preguntas = new ArrayList<>();

    private String estado; // Estado de la partida: "EN_PROGRESO", "FINALIZADA"
    private int puntaje; // Puntaje acumulado

    @Embedded
    private ConfiguracionPartida configPartida;

    public Partida() {}

    // Constructor inicial que asigna el jugador y la configuración del juego
    public Partida(Jugador jugador, String dificultad, int tiempoPorPregunta, int puntaje) {
        this.jugador = jugador;
        this.estado = "EN_PROGRESO";
        this.puntaje = puntaje;
        this.configPartida = new ConfiguracionPartida(dificultad, tiempoPorPregunta);
    }

    // Método para registrar una nueva respuesta
    public void registrarRespuesta(Respuesta respuesta) {
        respuestas.add(respuesta);
        int puntajeMaximo = 100;
        int penalizacionPorSegundo = 5;

        if (respuesta.getPreguntaAsociada().getRespuestaCorrecta().equalsIgnoreCase(respuesta.getOpcionElegida())) {
            int tiempoTranscurrido = respuesta.getTiempoTranscurrido();
            int puntajeObtenido = Math.max(0, puntajeMaximo - (tiempoTranscurrido * penalizacionPorSegundo));
            puntaje += puntajeObtenido;
        }
    }

    // Método para registrar una nueva pregunta en la partida
    public void registrarPregunta(Pregunta pregunta) {
        if (pregunta != null) {
            preguntas.add(pregunta);
        } else {
            System.err.println("La pregunta no puede ser nula.");
        }
    }

    public void finalizarPartida() {
        this.estado = "FINALIZADA";
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public Jugador getJugador() {
        return jugador;
    }

    public void setJugador(Jugador jugador) {
        this.jugador = jugador;
    }

    public List<Respuesta> getRespuestas() {
        return respuestas;
    }

    public List<Pregunta> getPreguntas() {
        return preguntas;
    }

    public String getEstado() {
        return estado;
    }

    public int getPuntaje() {
        return puntaje;
    }

    public void setPuntaje(int puntaje) {
        this.puntaje = puntaje;
    }

    public ConfiguracionPartida getConfigPartida() {
        return configPartida;
    }

    public void setConfigPartida(ConfiguracionPartida configPartida) {
        this.configPartida = configPartida;
    }

    public void setRespuestas(List<Respuesta> respuestas) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    public void setPreguntas(List<Pregunta> preguntas) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    public void setEstado(String estado) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }
}