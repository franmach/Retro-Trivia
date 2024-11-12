/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author menge
 */
public class Estadisticas {
    private int totalPartidasJugadas;
    private int partidasGanadas;
    private int partidasPerdidas;
    private int puntajeMaximo;
    
    // Constructor
    public Estadisticas() {
        this.totalPartidasJugadas = 0;
        this.partidasGanadas = 0;
        this.partidasPerdidas = 0;
        this.puntajeMaximo = 0;
    }
    
    // Getters y Setters
    public int getTotalPartidasJugadas() {
        return totalPartidasJugadas;
    }

    public void setTotalPartidasJugadas(int totalPartidasJugadas) {
        this.totalPartidasJugadas = totalPartidasJugadas;
    }

    public int getPartidasGanadas() {
        return partidasGanadas;
    }

    public void setPartidasGanadas(int partidasGanadas) {
        this.partidasGanadas = partidasGanadas;
    }

    public int getPartidasPerdidas() {
        return partidasPerdidas;
    }

    public void setPartidasPerdidas(int partidasPerdidas) {
        this.partidasPerdidas = partidasPerdidas;
    }

    public int getPuntajeMaximo() {
        return puntajeMaximo;
    }

    public void setPuntajeMaximo(int puntajeMaximo) {
        this.puntajeMaximo = puntajeMaximo;
    }
}
