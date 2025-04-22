import React, { useState } from 'react';
import styled from 'styled-components';
import PDFUploader from './components/PDFUploader';
import DynamicReader from './components/DynamicReader';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 0.9rem;
`;

function App() {
  const [words, setWords] = useState([]);
  
  const handlePDFProcessed = (processedWords) => {
    setWords(processedWords);
  };
  
  return (
    <AppContainer>
      <Header>
        <Title>Leitor Dinâmico de PDF</Title>
        <Subtitle>Carregue um PDF e leia uma palavra por vez, no seu ritmo</Subtitle>
      </Header>
      
      <PDFUploader onPDFProcessed={handlePDFProcessed} />
      
      {words.length > 0 && (
        <DynamicReader words={words} />
      )}
      
      <Footer>
        <p>Leitor Dinâmico de PDF &copy; 2025</p>
        <p>Uma aplicação moderna para leitura rápida e eficiente</p>
      </Footer>
    </AppContainer>
  );
}

export default App;
