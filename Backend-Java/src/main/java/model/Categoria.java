/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.util.ArrayList;
import java.util.List;


public class Categoria {
    private String nombreCategoria; 
    private List<Pregunta> preguntasAsociadas;  
    
    public Categoria(String nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
        this.preguntasAsociadas = new ArrayList<>(); // Inicializa la lista de preguntas
    }
}
