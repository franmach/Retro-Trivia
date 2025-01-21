# Retro Trivia

Retro Trivia es un juego educativo interactivo de preguntas y respuestas que utiliza inteligencia artificial para generar contenido dinámico y ofrecer una experiencia enriquecedora y personalizada. Este proyecto combina aprendizaje y entretenimiento, con funcionalidades disponibles en modos individual y multijugador.

---

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Características](#características)
4. [Instalación](#instalación)
5. [Uso](#uso)
6. [Capturas de Pantalla](#capturas-de-pantalla)
7. [Contribuciones](#contribuciones)
8. [Contacto](#contacto)

---

## Descripción General
Retro Trivia busca resolver la falta de juegos educativos que integren aprendizaje y diversión mediante el uso de inteligencia artificial para generar preguntas dinámicas y adaptativas. El juego incluye modos configurables de dificultad, categorías variadas como ciencia, arte, geografía y entretenimiento, y opciones para jugar en tiempo real.

Este proyecto fue desarrollado como parte de las materias **Diseño y Desarrollo de Aplicaciones** e **Ingeniería de Software**, utilizando metodologías ágiles y un enfoque modular.

---

## Tecnologías Utilizadas
- **Lenguajes:** Java, HTML, CSS, JavaScript.
- **Frameworks:** Spring Boot, Spring Security.
- **Bases de Datos:** MySQL con Spring Data JPA.
- **APIs:** ChatGPT, Google Cloud Text-to-Speech.
- **Otros:** WebSockets para comunicación en tiempo real.

---

## Características
- **Modo individual:** Preguntas generadas dinámicamente con selección de dificultad (fácil, intermedia, difícil).
- **Integración con ChatGPT:** Preguntas y pistas adaptadas a la categoría seleccionada.
- **Interfaz interactiva:** Creada en HTML, CSS y JavaScript para una navegación fluida.
- **Gestión de puntajes y poderes:** Incluye pistas, eliminación de opciones incorrectas y más.
- **Accesibilidad:** Transformación de texto a voz mediante Google Cloud Text-to-Speech.
- **Base para multijugador:** Sistema inicial para modo multijugador en tiempo real.

---

## Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tuusuario/retro-trivia.git
   ```
2. Configura la base de datos MySQL:
   - Crea una base de datos con el nombre `retro_trivia`.
   - Actualiza el archivo `application.properties` con tus credenciales de base de datos.

3. Instala las dependencias del proyecto y ejecuta el servidor:
   ```bash
   ./mvnw spring-boot:run
   ```

4. Abre el navegador y accede a `http://localhost:8080`.

---

## Uso
- **Modo de juego:** Selecciona una categoría, dificultad y comienza a responder preguntas.
- **Gestión de usuarios:** Regístrate para guardar tu progreso y competir en el ranking.

---

## Capturas de Pantalla
![login](https://github.com/user-attachments/assets/8a5a9d37-ba3b-4371-89b9-11154a2668cb)
![registro](https://github.com/user-attachments/assets/90271df2-dedc-4344-8478-96ccd258afe1)
![start](https://github.com/user-attachments/assets/07317a75-4705-4629-ac52-67bac5051a05)
![seleccionJug](https://github.com/user-attachments/assets/2cd3576e-3d30-4886-a33a-7b989787d090)

![config](https://github.com/user-attachments/assets/3e6c069a-98d7-4e82-8fe6-4aa97658151b)
![ruleta](https://github.com/user-attachments/assets/6e810d99-a130-4074-8eb1-b807f0712f7f)
![preguntaDep](https://github.com/user-attachments/assets/d1e0435f-a4f1-4b9a-a372-9c0bc86944fd)

![correcta](https://github.com/user-attachments/assets/252235ff-d526-4ac4-b56a-28ef245ac7cf)
![incorrecta](https://github.com/user-attachments/assets/feb9bebf-3d64-4c2d-b23d-d475d00a025e)

![pistaHint](https://github.com/user-attachments/assets/091d409c-69f0-4141-95fb-7f6d897b28e1)

---

## Contribuciones
Este proyecto fue desarrollado como parte de un curso académico y no está abierto a contribuciones externas.

---

## Contacto
Para más información, contacta a Francisco Machado en [franmach20@outlook.com](mailto:franmach20@outlook.com).
