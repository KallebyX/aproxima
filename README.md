<h1 align="center">🤝 Aproxima</h1>

<p align="center">
  <strong>Plataforma digital para saúde inclusiva, conectando gestantes e profissionais com acessibilidade e empatia.</strong>
</p>

<p align="center">
  <a href="https://aproxima-six.vercel.app" target="_blank"><strong>🔗 Acessar o Site</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-blue" alt="status">
  <img src="https://img.shields.io/github/license/KallebyX/aproxima" alt="licença">
  <img src="https://img.shields.io/github/languages/top/KallebyX/aproxima" alt="linguagem">
</p>

---

## ✨ Visão Geral

**Aproxima** é uma plataforma digital inclusiva desenvolvida para apoiar gestantes com deficiência visual e os profissionais de saúde que as acompanham.  
A ferramenta oferece uma versão acessível da Caderneta da Gestante, adaptada para leitura por tecnologias assistivas, promovendo autonomia e equidade no acompanhamento pré-natal.

---

## 🌐 Acesse a Plataforma

🔗 [aproxima-six.vercel.app](https://aproxima-six.vercel.app)

---

## 🚀 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) – Framework React para aplicações web modernas.
- [TypeScript](https://www.typescriptlang.org/) – Superset do JavaScript que adiciona tipagem estática.
- [Tailwind CSS](https://tailwindcss.com/) – Framework de utilitários para estilização rápida e responsiva.
- [Vercel](https://vercel.com/) – Plataforma de hospedagem e deploy contínuo.

---

## 📁 Estrutura do Projeto

```
aproxima/
├── public/                # Arquivos públicos (imagens, favicon)
├── src/
│   ├── app/               # Páginas da aplicação
│   └── components/        # Componentes reutilizáveis
├── .eslintrc.json         # Configuração do ESLint
├── .gitignore             # Arquivos e pastas ignorados pelo Git
├── next.config.ts         # Configuração do Next.js
├── package.json           # Dependências e scripts do projeto
├── tailwind.config.ts     # Configuração do Tailwind CSS
├── tsconfig.json          # Configuração do TypeScript
└── README.md              # Documentação do projeto
```

---

## 📦 Instalação e Execução Local

### Pré-requisitos

- Node.js v18+ (ou superior)
- npm ou yarn

### Passo a passo

1. **Clone o repositório:**

```bash
git clone https://github.com/KallebyX/aproxima.git
cd aproxima
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

4. **Acesse no navegador:**

```
http://localhost:3000/
```

---

## 🧪 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a versão de produção da aplicação.
- `npm run start`: Inicia a aplicação em modo de produção.
- `npm run lint`: Executa o ESLint para análise de código.

---

## 🚀 Deploy

### Deploy Local com Docker

```bash
# Build e execução
docker-compose -f docker-compose.simple.yml up -d --build

# Ou usando o script
./deploy.sh
```

### Deploy no Servidor UFN

Consulte os arquivos de documentação específicos:

- [`DEPLOY_UFN.md`](./DEPLOY_UFN.md) - Guia completo para deploy no servidor
- [`DEPLOY.md`](./DEPLOY.md) - Instruções gerais de deploy

**URLs de produção:**

- **Site**: <https://aproxima.ufn.edu.br> (após configuração)
- **Portainer**: <https://app.ufn.edu.br>
- **Proxy Manager**: <https://proxy.app.ufn.edu.br>

---

## 📝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do projeto.
2. Crie uma nova branch com a sua feature:

```bash
git checkout -b minha-feature
```

3. Faça commit das suas alterações:

```bash
git commit -m 'feat: adiciona nova feature'
```

4. Faça push para a branch:

```bash
git push origin minha-feature
```

5. Abra um Pull Request.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.  
Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👨‍💻 Desenvolvido por

**Kalleby Evangelho Mota**  
Estudante de Engenharia Biomédica | Desenvolvedor de Tecnologias Assistivas  
E-mail: [kalleby.mota@ufn.edu.br](mailto:kalleby.mota@ufn.edu.br)  
GitHub: [@KallebyX](https://github.com/KallebyX)

---

## 💡 Agradecimentos

Projeto desenvolvido com apoio da Universidade Franciscana (UFN), visando promover a inclusão e acessibilidade na saúde materno-infantil.

---

<p align="center">
  <strong>Conectando tecnologia e empatia para uma saúde mais inclusiva.</strong>
</p>
