const request = require('supertest');
const app = require('../src/index');
const fs = require('fs');
const path = require('path');

// Mock para pdf-parse
jest.mock('pdf-parse', () => {
  return jest.fn().mockResolvedValue({
    text: 'Este é um texto de exemplo para teste do processamento de PDF.'
  });
});

describe('API de processamento de PDF', () => {
  
  test('Deve retornar status 200 na rota de saúde', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
  
  test('Deve retornar erro 400 quando nenhum arquivo é enviado', async () => {
    const response = await request(app).post('/api/upload');
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });
  
  test('Deve processar um arquivo PDF e retornar palavras', async () => {
    // Mock do fs.readFileSync e fs.unlinkSync
    const originalReadFileSync = fs.readFileSync;
    const originalUnlinkSync = fs.unlinkSync;
    
    fs.readFileSync = jest.fn().mockReturnValue(Buffer.from('mock pdf content'));
    fs.unlinkSync = jest.fn();
    
    // Criar um arquivo de teste temporário
    const mockFile = {
      buffer: Buffer.from('mock pdf content'),
      originalname: 'test.pdf',
      mimetype: 'application/pdf'
    };
    
    try {
      const response = await request(app)
        .post('/api/upload')
        .attach('pdf', mockFile.buffer, { filename: mockFile.originalname, contentType: mockFile.mimetype });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.words)).toBe(true);
      expect(response.body.words.length).toBeGreaterThan(0);
      expect(response.body.title).toBe('test.pdf');
    } finally {
      // Restaurar as funções originais
      fs.readFileSync = originalReadFileSync;
      fs.unlinkSync = originalUnlinkSync;
    }
  });
});
