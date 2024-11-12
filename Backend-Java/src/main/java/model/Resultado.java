/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;
import java.time.LocalDateTime;

/**
 *
 * @author menge
 */
public class Resultado {
    private LocalDateTime fecha;
    private int puntaje;
    private String resultado; // Ejemplo: "Ganado", "Perdido", "Empate"

    // Constructor
    public Resultado(LocalDateTime fecha, int puntaje, String resultado) {
        this.fecha = fecha;
        this.puntaje = puntaje;
        this.resultado = resultado;
    }
}
