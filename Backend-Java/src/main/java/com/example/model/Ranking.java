/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.model;

import java.util.List;
import jakarta.persistence.*;
/**
 *
 * @author menge
 */
@Entity
public class Ranking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToMany
    private List<Jugador> listaDeJugadores;
    
    @OneToMany
    private List<Resultado> puntajesHistoricos;
    
    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Jugador> getListaDeJugadores() {
        return listaDeJugadores;
    }

    public void setListaDeJugadores(List<Jugador> listaDeJugadores) {
        this.listaDeJugadores = listaDeJugadores;
    }

    public List<Resultado> getPuntajesHistoricos() {
        return puntajesHistoricos;
    }

    public void setPuntajesHistoricos(List<Resultado> puntajesHistoricos) {
        this.puntajesHistoricos = puntajesHistoricos;
    }
}
