/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;
import java.util.List;
import java.util.ArrayList;

/**
 *
 * @author menge
 */
public class Multijugador {
    private List<Jugador> listaJugadores; // Lista de jugadores en la partida multijugador
    private String estadoSincronizacion;  // Estado de sincronización
    private int conexionesActivas;        // Número de conexiones activas

    public Multijugador() {
        listaJugadores = new ArrayList<>();
        estadoSincronizacion = "Sincronizado"; // Estado inicial
        conexionesActivas = 0;
    }
    
}
