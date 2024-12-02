/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.model;
import jakarta.persistence.*;

/**
 *
 * @author menge
 */
@Entity
public class Respuesta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Pregunta preguntaAsociada;
    
    @Column(nullable = false)
    private String opcionElegida;
    
    @Column(nullable = false)
    private int tiempoTranscurrido;
    
    @ManyToOne
    private Jugador jugador;

    // Constructor
    public Respuesta(Pregunta preguntaAsociada, String opcionElegida, int tiempoTranscurrido, Jugador jugador) {
        this.preguntaAsociada = preguntaAsociada;
        this.opcionElegida = opcionElegida;
        this.tiempoTranscurrido = tiempoTranscurrido;
        this.jugador = jugador;
    }

    // Getters y Setters
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
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
