/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package controller;

import model.ApiManager;
import model.Pregunta;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class PreguntaController {

    private final ApiManager apiManager;

    public PreguntaController(ApiManager apiManager) {
        this.apiManager = apiManager;
    }

    @GetMapping("/pregunta")
    public ResponseEntity<Pregunta> obtenerPregunta(@RequestParam String categoria) {
        Pregunta pregunta = apiManager.generarPregunta(categoria);
        if (pregunta != null) {
            return ResponseEntity.ok(pregunta);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
