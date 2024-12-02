/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.model;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class ApiManager {

    private final RestTemplate restTemplate;

    private final String apiKey;

    // Endpoint base y clave de API, que puedes definir en application.properties
    @Value("${chatgpt.api.base.url}")
    private String apiBaseUrl;
    
    @PersistenceContext
    private EntityManager entityManager;

    public ApiManager(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;

        // Cargar las variables desde el archivo .env
        Dotenv dotenv = Dotenv.configure().load();
        this.apiKey = dotenv.get("API_KEY");
    }

    // Método para enviar una solicitud POST a un endpoint específico de ChatGPT
    public String sendPostRequest(String endpoint, Object requestPayload) {
        String url = apiBaseUrl + endpoint;

        // Configura los encabezados HTTP, incluyendo la clave de autorización
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        // Crea la entidad de la solicitud con los encabezados y el cuerpo de la solicitud
        HttpEntity<Object> entity = new HttpEntity<>(requestPayload, headers);

        // Envía la solicitud y obtiene la respuesta
        try {
            System.out.println("Enviando solicitud POST a: " + url);
            System.out.println("Payload: " + entity.getBody());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.out.println("Error en la solicitud POST: " + e.getStatusCode());
            System.out.println("Mensaje de error: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al hacer la solicitud POST", e);
        }
    }
    
    // Método para enviar una solicitud GET a un endpoint específico de ChatGPT
    public String sendGetRequest(String endpoint) {
        String url = apiBaseUrl + endpoint;

        // Configura los encabezados HTTP, incluyendo la clave de autorización
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // Envía la solicitud y obtiene la respuesta
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return response.getBody();
    }

    // Método para generar una pregunta con opciones
    @Transactional
    public Pregunta generarPregunta(String categoria, String dificultad) {
        // Verificar si la cuota está agotada antes de realizar la solicitud
        if (isQuotaExceeded()) {
            System.out.println("La cuota de la API está agotada. Usando pregunta predeterminada.");
            return generarPreguntaPredeterminada(categoria);
        }

        // Crear el payload para la API de ChatGPT
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gpt-4o-mini");
        payload.put("max_tokens", 150);

        // Crear el mensaje para el prompt, incluyendo la dificultad seleccionada y un factor aleatorio
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", "Generar una pregunta nueva y única de trivia sobre " + categoria
                + " con dificultad " + dificultad
                + ". Debe incluir 4 opciones de las cuales una debe ser correcta. El formato de opciones debe ser:\n"
                + "(A) Opción 1\n(B) Opción 2\n(C) Opción 3\n(D) Opción 4\n"
                + "La respuesta correcta debe indicarse claramente al final en el formato:\n"
                + "Respuesta correcta: (A), (B), (C), o (D). Para asegurarse de que esta pregunta sea diferente a las anteriores, incluye variaciones únicas en el enunciado.");

        // Agregar un identificador aleatorio para aumentar la variabilidad
        userMessage.put("content", userMessage.get("content") + "\nIdentificador de variabilidad: " + Math.random());

        messages.add(userMessage);
        payload.put("messages", messages); // Agregar mensajes al payload

        // Enviar la solicitud y procesar la respuesta
        try {
            String response = sendPostRequest("/chat/completions", payload);

            // Convertir la respuesta JSON a un objeto Pregunta
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            // Extraer la pregunta y las opciones desde la respuesta de ChatGPT
            String enunciado = root.path("choices").get(0).path("message").path("content").asText();

            // Procesar el enunciado para extraer opciones y respuesta correcta
            List<String> opciones = new ArrayList<>();
            String respuestaCorrecta = "";

            // Separar el enunciado por líneas y buscar las opciones y la respuesta correcta
            String[] lineas = enunciado.split("\n");
            for (String linea : lineas) {
                linea = linea.trim();
                if (linea.matches("^\\([A-D]\\)\\s.*")) { // Detecta líneas con formato "(A) Opción"
                    opciones.add(linea.substring(3).trim());
                }
                if (linea.startsWith("Respuesta correcta:")) { // Detectar la respuesta correcta
                    respuestaCorrecta = linea.replace("Respuesta correcta:", "").trim();
                    respuestaCorrecta = respuestaCorrecta.replaceAll("[()]", ""); // Remover paréntesis de la letra
                }
            }

            // Verificación en caso de que las opciones no se hayan extraído correctamente
            if (opciones.size() < 4 || respuestaCorrecta.isEmpty()) {
                System.out.println("Error al extraer las opciones o la respuesta correcta. Usando valores predeterminados.");
                return generarPreguntaPredeterminada(categoria);
            }

            Pregunta nuevaPregunta = new Pregunta(enunciado, opciones, respuestaCorrecta, categoria, dificultad);
            entityManager.persist(nuevaPregunta); // Guardar la pregunta en la base de datos
            return nuevaPregunta;

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS || e.getResponseBodyAsString().contains("insufficient_quota")) {
                System.out.println("Insufficient quota detectada. Usando pregunta predeterminada.");
                setQuotaExceeded(true);
                return generarPreguntaPredeterminada(categoria);
            } else {
                throw e;
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Método auxiliar para generar una pregunta predeterminada
    private Pregunta generarPreguntaPredeterminada(String categoria) {
        String enunciado = "Pregunta de ejemplo sobre " + categoria + "?";
        List<String> opciones = Arrays.asList("Opción A", "Opción B", "Opción C", "Opción D");
        String respuestaCorrecta = "Opción A"; // Puedes ajustar esta respuesta predeterminada

        return new Pregunta(enunciado, opciones, respuestaCorrecta, categoria, "media");
    }

    // Método para generar una pista basada en una pregunta
    public String generarPista(String pregunta) {
        // Verificar si la cuota está agotada antes de realizar la solicitud
        if (isQuotaExceeded()) {
            System.out.println("La cuota de la API está agotada. No se puede generar una pista.");
            return "La cuota de la API está agotada. Intenta nuevamente más tarde.";
        }

        // Crear el payload para la API de ChatGPT
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gpt-4o-mini");
        payload.put("max_tokens", 50);

        // Crear el mensaje para el prompt
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", "Basado en la pregunta: \"" + pregunta
                + "\", genera una pista breve y útil para ayudar al jugador a responder correctamente.");

        messages.add(userMessage);
        payload.put("messages", messages);

        // Enviar la solicitud y procesar la respuesta
        try {
            String response = sendPostRequest("/chat/completions", payload);

            // Convertir la respuesta JSON a texto
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            String pista = root.path("choices").get(0).path("message").path("content").asText().trim();

            // Verificar si la pista está vacía o tiene un error
            if (pista.isEmpty()) {
                System.out.println("No se pudo generar una pista válida. Usando un mensaje predeterminado.");
                return "No se pudo generar una pista. Intenta nuevamente.";
            }

            return pista;
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS || e.getResponseBodyAsString().contains("insufficient_quota")) {
                System.out.println("Insufficient quota detectada. No se puede generar una pista.");
                setQuotaExceeded(true);
                return "La cuota de la API está agotada. Intenta nuevamente más tarde.";
            } else {
                System.err.println("Error en la solicitud al generar la pista: " + e.getMessage());
                throw e;
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "Ocurrió un error al generar la pista. Intenta nuevamente.";
        }
    }

    // Flag y método para verificar si la cuota está agotada
    private boolean quotaExceeded = false;

    private boolean isQuotaExceeded() {
        return quotaExceeded;
    }

    private void setQuotaExceeded(boolean exceeded) {
        this.quotaExceeded = exceeded;
    }

}
