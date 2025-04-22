import React, { useState } from 'react';
import styled from 'styled-components';

const UploaderContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const UploadArea = styled.label`
  display: block;
  width: 100%;
  padding: 2rem;
  border: 2px dashed #4a90e2;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f0f7ff;
  }
  
  &.dragover {
    background-color: #f0f7ff;
    border-color: #2a70c2;
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const FileName = styled.div`
  margin-top: 1rem;
  font-weight: bold;
  color: #4a90e2;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
`;

const LoadingIndicator = styled.div`
  margin-top: 1rem;
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #4a90e2;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const PDFUploader = ({ onPDFProcessed }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };
  
  const processFile = async (selectedFile) => {
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Por favor, selecione um arquivo PDF válido.');
      setFile(null);
      return;
    }
    
    setError('');
    setFile(selectedFile);
    setIsLoading(true);
    
    // Upload para o backend
    const formData = new FormData();
    formData.append('pdf', selectedFile);
    
    try {
      // Importar o serviço de API
      const { uploadPDF } = await import('../services/api');
      
      // Fazer upload do PDF para o backend
      const response = await uploadPDF(selectedFile);
      
      // Processar a resposta
      if (response.success && response.words) {
        setIsLoading(false);
        onPDFProcessed(response.words);
      } else {
        throw new Error('Falha ao processar o PDF');
      }
    } catch (error) {
      // Fallback para simulação em caso de erro
      console.error("Erro ao processar o arquivo:", error);
      setError("Ocorreu um erro ao processar o arquivo. Por favor, tente novamente.");
      
      // Simulação de resposta para desenvolvimento
      setTimeout(() => {
        const sampleText = "Este é um texto de exemplo para simular o processamento de um PDF. A leitura dinâmica permite que você leia mais rápido, focando em uma palavra por vez. Você pode ajustar a velocidade conforme sua preferência, até 500 palavras por minuto. Esta técnica ajuda a melhorar a concentração e reduzir a dispersão durante a leitura. Experimente diferentes velocidades para encontrar o ritmo ideal para o seu conforto e compreensão. Com prática regular, você pode aumentar gradualmente sua velocidade de leitura mantendo boa compreensão do texto.";
        const wordArray = sampleText.split(/\s+/);
        
        setIsLoading(false);
        onPDFProcessed(wordArray);
      }, 1500);
      setIsLoading(false);
    }
  };
  
  return (
    <UploaderContainer>
      <UploadArea 
        className={isDragOver ? 'dragover' : ''}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <p>Processando arquivo...</p>
        ) : (
          <p>Clique ou arraste um arquivo PDF aqui</p>
        )}
        <UploadInput 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          disabled={isLoading}
        />
      </UploadArea>
      
      {file && !isLoading && (
        <FileName>Arquivo selecionado: {file.name}</FileName>
      )}
      
      {isLoading && (
        <LoadingIndicator>
          <div className="spinner"></div>
          <p>Processando o PDF, por favor aguarde...</p>
        </LoadingIndicator>
      )}
      
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
    </UploaderContainer>
  );
};

export default PDFUploader;
