/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author menge
 */
public class Respuesta {
    private Pregunta preguntaAsociada;
    private String opcionElegida;
    private int tiempoTranscurrido;
    private Jugador jugador;

    // Constructor
    public Respuesta(Pregunta preguntaAsociada, String opcionElegida, int tiempoTranscurrido, Jugador jugador) {
        this.preguntaAsociada = preguntaAsociada;
        this.opcionElegida = opcionElegida;
        this.tiempoTranscurrido = tiempoTranscurrido;
        this.jugador = jugador;
    }

    // Getters y Setters
    public Pregunta getPreguntaAsociada() {
        return preguntaAsociada;
    }

    public void setPreguntaAsociada(Pregunta preguntaAsociada) {
        this.preguntaAsociada = preguntaAsociada;
    }

    public String getOpcionElegida() {
        return opcionElegida;
    }

    public void setOpcionElegida(String opcionElegida) {
        this.opcionElegida = opcionElegida;
    }

    public int getTiempoTranscurrido() {
        return tiempoTranscurrido;
    }

    public void setTiempoTranscurrido(int tiempoTranscurrido) {
        this.tiempoTranscurrido = tiempoTranscurrido;
    }

    public Jugador getJugador() {
        return jugador;
    }

    public void setJugador(Jugador jugador) {
        this.jugador = jugador;
    }
}
