package com.example.service;

import com.example.model.Partida;
import com.example.repository.PartidaRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PartidaService {

    @Autowired
    private PartidaRepository partidaRepository;

    public Partida guardarPartida(Partida partida) {
        return partidaRepository.save(partida);
    }
    
    public Optional<Partida> buscarPartidaPorId(Long id) {
        return partidaRepository.findById(id);
    }
    
    public Partida actualizarPartida(Long id, Partida nuevaPartida) {
        Optional<Partida> partidaExistenteOptional = partidaRepository.findById(id);

        if (partidaExistenteOptional.isPresent()) {
            Partida partidaExistente = partidaExistenteOptional.get();

            // Actualizamos los campos de la partida existente con los de la nueva partida
            partidaExistente.setJugador(nuevaPartida.getJugador());
            partidaExistente.setRespuestas(nuevaPartida.getRespuestas());
            partidaExistente.setPreguntas(nuevaPartida.getPreguntas());
            partidaExistente.setEstado(nuevaPartida.getEstado());
            partidaExistente.setPuntaje(nuevaPartida.getPuntaje());
            partidaExistente.setConfigPartida(nuevaPartida.getConfigPartida());

            // Guardamos la entidad actualizada en la base de datos
            return partidaRepository.save(partidaExistente);
        } else {
            throw new RuntimeException("No se encontró la partida con ID: " + id);
        }
    }
}
