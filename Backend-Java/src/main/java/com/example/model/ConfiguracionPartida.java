/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ConfiguracionPartida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dificultad;
    private int tiempoPorPregunta;
    
    public ConfiguracionPartida (String dificultad, int tiempo) {
        this.dificultad = dificultad;
        this.tiempoPorPregunta = tiempo;
    }

    // Getters y Setters
    public String getDificultad() { return dificultad; }
    public void setDificultad(String dificultad) { this.dificultad = dificultad; }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    
    
    public int getTiempoPorPregunta() { return tiempoPorPregunta; }
    public void setTiempoPorPregunta(int tiempoPorPregunta) { this.tiempoPorPregunta = tiempoPorPregunta; }
}
