import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ReaderContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 2rem;
`;

const WordDisplay = styled.div`
  font-size: 2.5rem;
  text-align: center;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  font-weight: ${props => props.highlight ? 'bold' : 'normal'};
  color: ${props => props.highlight ? '#4a90e2' : '#333'};
  transition: all 0.2s ease;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #357abd;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SpeedControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const SpeedDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #4a90e2;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const DynamicReader = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200); // palavras por minuto
  const [currentWord, setCurrentWord] = useState(words[0] || '');
  const [highlight, setHighlight] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  
  // Atualizar palavra atual quando words mudar
  useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[0]);
      setCurrentWordIndex(0);
      setIsPlaying(false);
      setElapsedTime(0);
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    }
  }, [words]);
  
  // Controles de reprodução
  const startReading = () => {
    if (words.length === 0) return;
    
    setIsPlaying(true);
    const interval = (60 / speed) * 1000; // Converter palavras por minuto para milissegundos
    
    // Iniciar timer para contagem de tempo
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    intervalRef.current = setInterval(() => {
      setHighlight(true);
      setTimeout(() => setHighlight(false), interval / 3);
      
      setCurrentWordIndex(prevIndex => {
        if (prevIndex >= words.length - 1) {
          clearInterval(intervalRef.current);
          clearInterval(timerRef.current);
          setIsPlaying(false);
          return prevIndex;
        }
        const nextIndex = prevIndex + 1;
        setCurrentWord(words[nextIndex]);
        return nextIndex;
      });
    }, interval);
  };
  
  const pauseReading = () => {
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsPlaying(false);
  };
  
  const resetReading = () => {
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentWordIndex(0);
    setCurrentWord(words[0]);
    setElapsedTime(0);
    timerRef.current = null;
  };
  
  // Controles de velocidade
  const increaseSpeed = () => {
    if (speed < 500) {
      setSpeed(prevSpeed => {
        const newSpeed = prevSpeed + 25;
        if (isPlaying) {
          pauseReading();
          setTimeout(startReading, 50);
        }
        return newSpeed;
      });
    }
  };
  
  const decreaseSpeed = () => {
    if (speed > 100) {
      setSpeed(prevSpeed => {
        const newSpeed = prevSpeed - 25;
        if (isPlaying) {
          pauseReading();
          setTimeout(startReading, 50);
        }
        return newSpeed;
      });
    }
  };
  
  // Calcular progresso
  const progress = words.length > 0 ? (currentWordIndex / (words.length - 1)) * 100 : 0;
  
  // Formatar tempo decorrido
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // Calcular palavras lidas
  const wordsRead = currentWordIndex + 1;
  
  // Calcular palavras restantes
  const wordsRemaining = words.length - wordsRead;
  
  // Calcular tempo estimado restante
  const estimatedTimeRemaining = Math.round((wordsRemaining / speed) * 60);
  
  // Limpar intervalos quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  return (
    <ReaderContainer>
      <WordDisplay highlight={highlight}>
        {currentWord}
      </WordDisplay>
      
      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>
      
      <ControlsContainer>
        <SpeedControls>
          <Button onClick={decreaseSpeed} disabled={speed <= 100}>-</Button>
          <SpeedDisplay>{speed} palavras/min</SpeedDisplay>
          <Button onClick={increaseSpeed} disabled={speed >= 500}>+</Button>
        </SpeedControls>
        
        <ButtonGroup>
          <Button onClick={startReading} disabled={isPlaying || words.length === 0}>
            Iniciar
          </Button>
          <Button onClick={pauseReading} disabled={!isPlaying}>
            Pausar
          </Button>
          <Button onClick={resetReading} disabled={currentWordIndex === 0 && !isPlaying}>
            Reiniciar
          </Button>
        </ButtonGroup>
        
        <StatsContainer>
          <div>Tempo: {formatTime(elapsedTime)}</div>
          <div>Progresso: {wordsRead}/{words.length} palavras</div>
          <div>Tempo restante: ~{formatTime(estimatedTimeRemaining)}</div>
        </StatsContainer>
      </ControlsContainer>
    </ReaderContainer>
  );
};

export default DynamicReader;
