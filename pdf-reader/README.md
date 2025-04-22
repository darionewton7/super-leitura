# Leitor Dinâmico de PDF

![GitHub Workflow Status (Dev)](https://img.shields.io/github/workflow/status/username/pdf-reader/CI/CD%20Pipeline%20-%20Development?label=dev%20build)
![GitHub Workflow Status (Main)](https://img.shields.io/github/workflow/status/username/pdf-reader/CI/CD%20Pipeline%20-%20Production?label=production%20build)

Uma aplicação web moderna para leitura dinâmica de PDFs, permitindo ler uma palavra por vez com velocidade ajustável.

## Funcionalidades

- Upload de arquivos PDF
- Leitura dinâmica (uma palavra por vez)
- Controle de velocidade (100-500 palavras por minuto)
- Interface responsiva e minimalista
- Estatísticas de leitura em tempo real

## Tecnologias Utilizadas

### Frontend
- React
- Styled Components
- PDF.js

### Backend
- Node.js
- Express
- pdf-parse

### CI/CD
- GitHub Actions
- Vercel (frontend)
- Render (backend)

## Estrutura do Projeto

```
pdf-reader/
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── services/   # Serviços de API
│   │   ├── App.jsx     # Componente principal
│   │   └── main.jsx    # Ponto de entrada
│   └── public/         # Arquivos estáticos
├── backend/            # API Express
│   ├── src/
│   │   └── index.js    # Servidor e rotas
│   └── tests/          # Testes automatizados
└── .github/workflows/  # Configurações de CI/CD
    ├── dev.yml         # Workflow de desenvolvimento
    └── main.yml        # Workflow de produção
```

## Como Executar Localmente

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Implantação

O projeto está configurado para implantação automática:

- Frontend: Vercel (https://pdf-reader-frontend.vercel.app)
- Backend: Render (https://pdf-reader-api.onrender.com)

## Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

MIT
