/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Map;

/**
 *
 * @author menge
 */
@Entity
public class SistemaAutenticacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany
    private List<Jugador> usuariosRegistrados; // Lista de usuarios registrados

    @ElementCollection
    @CollectionTable(name = "tokens_sesion", joinColumns = @JoinColumn(name = "sistema_autenticacion_id"))
    @MapKeyJoinColumn(name = "jugador_id")
    @Column(name = "token")
    private Map<Jugador, String> tokensDeSesion; // Tokens de sesión asociados a cada usuario

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Jugador> getUsuariosRegistrados() {
        return usuariosRegistrados;
    }

    public void setUsuariosRegistrados(List<Jugador> usuariosRegistrados) {
        this.usuariosRegistrados = usuariosRegistrados;
    }

    public Map<Jugador, String> getTokensDeSesion() {
        return tokensDeSesion;
    }

    public void setTokensDeSesion(Map<Jugador, String> tokensDeSesion) {
        this.tokensDeSesion = tokensDeSesion;
    }
}
