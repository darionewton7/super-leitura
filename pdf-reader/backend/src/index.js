require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');
const pdfParse = require('pdf-parse');

// Configuração do aplicativo Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Filtro para aceitar apenas arquivos PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos PDF são permitidos'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});

// Rota para upload e processamento de PDF
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const filePath = req.file.path;
    
    // Ler o arquivo PDF
    const dataBuffer = fs.readFileSync(filePath);
    
    // Processar o PDF e extrair o texto
    const data = await pdfParse(dataBuffer);
    
    // Dividir o texto em palavras
    const text = data.text;
    const words = text.split(/\s+/).filter(word => word.trim() !== '');
    
    // Remover o arquivo após processamento
    fs.unlinkSync(filePath);
    
    // Retornar as palavras extraídas
    return res.status(200).json({ 
      success: true, 
      words,
      totalWords: words.length,
      title: req.file.originalname
    });
    
  } catch (error) {
    console.error('Erro ao processar o PDF:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar o arquivo PDF',
      details: error.message
    });
  }
});

// Rota de teste para verificar se o servidor está funcionando
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor funcionando corretamente' });
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; // Para testes
