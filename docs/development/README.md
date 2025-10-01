# 🛠️ Guia de Desenvolvimento Enterprise

## 📋 Sumário

- [🏁 Setup do Ambiente](#-setup-do-ambiente)
- [🏗️ Arquitetura do Código](#-arquitetura-do-código)
- [🎨 Padrões de Código](#-padrões-de-código)
- [🧪 Testes](#-testes)
- [♿ Acessibilidade](#-acessibilidade)
- [🚀 Workflow de Desenvolvimento](#-workflow-de-desenvolvimento)

## 🏁 Setup do Ambiente

### Pré-requisitos Técnicos

| Ferramenta | Versão Mínima | Versão Recomendada | Instalação |
|------------|---------------|-------------------|------------|
| **Node.js** | 18.17.0 | 20.10.0+ | [nodejs.org](https://nodejs.org) |
| **npm** | 9.6.7 | 10.0.0+ | Incluído com Node.js |
| **Git** | 2.34.0 | 2.40.0+ | [git-scm.com](https://git-scm.com) |
| **VS Code** | 1.70.0 | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

### Extensões VS Code Obrigatórias

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Setup Inicial

1. **Clone do Repositório**

```bash
git clone https://github.com/KallebyX/aproxima.git
cd aproxima
```

2. **Configuração do Git**

```bash
# Configure hooks de pre-commit
npm run prepare

# Configure seu usuário
git config user.name "Seu Nome"
git config user.email "seu.email@exemplo.com"
```

3. **Instalação de Dependências**

```bash
# Instala todas as dependências
npm install

# Verifica se tudo está funcionando
npm run dev
```

4. **Configuração do Ambiente**

```bash
# Cria arquivo de ambiente
cp .env.example .env.local

# Edite .env.local com suas configurações
```

## 🏗️ Arquitetura do Código

### Estrutura de Diretórios

```
src/
├── 📂 components/          # Componentes React reutilizáveis
│   ├── 📂 accessibility/   # Componentes de acessibilidade
│   │   ├── AccessibilityToggle.tsx
│   │   ├── AdvancedAccessibility.tsx
│   │   └── ScreenReaderOnly.tsx
│   ├── 📂 forms/          # Componentes de formulário
│   │   ├── FormValidator.tsx
│   │   └── AccessibleForm.tsx
│   └── 📂 ui/             # Componentes básicos de UI
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Navigation.tsx
├── 📂 hooks/              # Custom React Hooks
│   ├── useAccessibility.tsx
│   ├── useWCAGCompliance.tsx
│   └── useHTMLRobustness.tsx
├── 📂 pages/              # Páginas Next.js
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   └── api/               # API Routes
├── 📂 styles/             # Estilos e temas
│   └── globals.css
├── 📂 types/              # Definições TypeScript
│   └── global.d.ts
└── 📂 utils/              # Utilitários e helpers
    ├── seo.ts
    └── accessibility.ts
```

### Padrões de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Componentes** | PascalCase | `AccessibilityToggle.tsx` |
| **Hooks** | camelCase com 'use' | `useAccessibility.tsx` |
| **Utilitários** | camelCase | `seoHelper.ts` |
| **Constantes** | UPPER_SNAKE_CASE | `API_ENDPOINTS` |
| **Interfaces** | PascalCase com 'I' | `IUserData` |

## 🎨 Padrões de Código

### TypeScript

```typescript
// ✅ BOM - Interface bem definida
interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

// ✅ BOM - Componente tipado
interface Props {
  settings: AccessibilitySettings;
  onUpdate: (settings: AccessibilitySettings) => void;
  className?: string;
}

const AccessibilityPanel: React.FC<Props> = ({ 
  settings, 
  onUpdate, 
  className = '' 
}) => {
  // Implementação...
};
```

### React Hooks

```typescript
// ✅ BOM - Hook customizado
export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false
  });

  const updateSetting = useCallback((
    key: keyof AccessibilitySettings, 
    value: boolean
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return { settings, updateSetting };
};
```

### Acessibilidade em Componentes

```typescript
// ✅ BOM - Componente acessível
const AccessibleButton: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false,
  ariaLabel,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        focus:outline-none focus:ring-4 focus:ring-blue-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
      `}
      {...props}
    >
      {children}
    </button>
  );
};
```

## 🧪 Testes

### Estrutura de Testes

```
tests/
├── 📂 accessibility/       # Testes de acessibilidade
│   ├── wcag.test.ts
│   └── screen-reader.test.ts
├── 📂 components/          # Testes de componentes
│   ├── AccessibilityToggle.test.tsx
│   └── Navigation.test.tsx
├── 📂 integration/         # Testes de integração
│   └── user-flow.test.ts
└── 📂 utils/              # Testes de utilitários
    └── seo.test.ts
```

### Comando de Testes

```bash
# Todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Testes de acessibilidade
npm run test:accessibility

# Cobertura de código
npm run test:coverage
```

### Exemplo de Teste de Acessibilidade

```typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AccessibilityToggle from '../AccessibilityToggle';

expect.extend(toHaveNoViolations);

describe('AccessibilityToggle', () => {
  it('should be accessible', async () => {
    const { container } = render(<AccessibilityToggle />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(<AccessibilityToggle />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('aria-expanded');
  });
});
```

## ♿ Acessibilidade

### Checklist WCAG 2.1 AAA

#### Perceptível
- [ ] **1.1.1** - Todas as imagens têm texto alternativo
- [ ] **1.2.1** - Áudio e vídeo têm alternativas
- [ ] **1.3.1** - Informações preservam significado sem estilo
- [ ] **1.4.3** - Contraste mínimo de 7:1 (AAA)
- [ ] **1.4.6** - Contraste aprimorado para texto
- [ ] **1.4.8** - Redimensionamento até 200% sem scroll horizontal

#### Operável
- [ ] **2.1.1** - Funcionalidade disponível por teclado
- [ ] **2.1.2** - Sem armadilhas de teclado
- [ ] **2.2.1** - Tempo ajustável para interações
- [ ] **2.3.1** - Sem conteúdo que cause convulsões
- [ ] **2.4.3** - Ordem de foco lógica
- [ ] **2.4.7** - Indicador de foco visível

#### Compreensível
- [ ] **3.1.1** - Idioma da página identificado
- [ ] **3.2.1** - Sem mudanças de contexto automáticas
- [ ] **3.3.1** - Identificação de erros
- [ ] **3.3.2** - Instruções e labels claras

#### Robusto
- [ ] **4.1.1** - HTML válido
- [ ] **4.1.2** - ARIA implementado corretamente

### Ferramentas de Validação

```bash
# Testes automatizados com axe-core
npm run test:accessibility

# Auditoria com Lighthouse
npm run audit:lighthouse

# Validação HTML
npm run validate:html

# Teste com screen readers (manual)
# - NVDA (Windows)
# - JAWS (Windows)  
# - VoiceOver (macOS)
```

## 🚀 Workflow de Desenvolvimento

### Git Flow

1. **Feature Branch**

```bash
# Cria e muda para nova branch
git checkout -b feature/nova-funcionalidade

# Desenvolve a feature...

# Commit seguindo Conventional Commits
git commit -m "feat: adiciona novo componente de acessibilidade"
```

2. **Pre-commit Hooks**

```bash
# Automaticamente executado antes do commit:
npm run lint        # ESLint
npm run type-check  # TypeScript
npm run test:unit   # Testes unitários
npm run test:a11y   # Testes de acessibilidade
```

3. **Pull Request**

- Título descritivo
- Descrição detalhada das mudanças
- Screenshots para mudanças visuais
- Checklist de acessibilidade preenchido

### Code Review Guidelines

#### Para Reviewer

- [ ] **Funcionalidade**: A feature funciona conforme especificado?
- [ ] **Acessibilidade**: Segue diretrizes WCAG 2.1 AAA?
- [ ] **Performance**: Não degrada a performance?
- [ ] **Testes**: Cobertura adequada e testes passando?
- [ ] **Código**: Legível, bem estruturado e documentado?

#### Para Developer

- [ ] **Auto-review**: Revisei meu próprio código?
- [ ] **Testes**: Todas as mudanças estão testadas?
- [ ] **Acessibilidade**: Testei com screen reader?
- [ ] **Mobile**: Funciona em dispositivos móveis?
- [ ] **Documentação**: Atualizei a documentação necessária?

### Deployment

```bash
# Deploy para staging
git push origin feature/branch
# → Automaticamente deploya no ambiente de staging

# Deploy para production
git push origin main
# → Automaticamente deploya na produção após CI/CD
```

## 🔧 Troubleshooting

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| **Build fails** | `rm -rf .next && npm run build` |
| **Types error** | `npm run type-check` |
| **Tests failing** | `npm run test -- --updateSnapshot` |
| **Accessibility errors** | Consulte [guia de acessibilidade](../accessibility/README.md) |

### Performance

```bash
# Analisa bundle size
npm run analyze

# Auditoria completa
npm run audit

# Testa performance
npm run lighthouse
```

---

## 📞 Suporte para Desenvolvedores

- **Dúvidas técnicas**: [GitHub Discussions](https://github.com/KallebyX/aproxima/discussions)
- **Bugs**: [GitHub Issues](https://github.com/KallebyX/aproxima/issues)
- **Email direto**: [kalleby.mota@ufn.edu.br](mailto:kalleby.mota@ufn.edu.br)

*Última atualização: Outubro 2024*