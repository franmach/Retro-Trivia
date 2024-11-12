/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;
import java.util.List;
/**
 *
 * @author menge
 */
public class Pregunta {
    private String enunciado;                  
    private List<String> opcionesDeRespuesta;             
    private String respuestaCorrecta;             
    private String categoria;                  
    private String dificultad; 
    
    public Pregunta() {}

    public Pregunta(String enunciado, List<String> opciones, String opcionCorrecta, String categoria, String dificultad) {
        this.enunciado = enunciado;
        this.opcionesDeRespuesta = opciones;
        this.respuestaCorrecta = opcionCorrecta;
        this.categoria = categoria;
        this.dificultad = dificultad;
    }

    // Getters y Setters
    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }

    public List<String> getOpcionesDeRespuesta() { return opcionesDeRespuesta; }
    public void setOpcionesDeRespuesta(List<String> opcionesDeRespuesta) { this.opcionesDeRespuesta = opcionesDeRespuesta; }

    public String getRespuestaCorrecta() { return respuestaCorrecta; }
    public void setRespuestaCorrecta(String respuestaCorrecta) { this.respuestaCorrecta = respuestaCorrecta; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getDificultad() { return dificultad; }
    public void setDificultad(String dificultad) { this.dificultad = dificultad; }
}
