# 📦 SmartQuality 4.0 — Inspetor de Qualidade Unilever

**Desenvolvido por:** Nelson Junior
**Empresa:** Unilever
**Versão:** 3.0
**Atualizado em:** Maio 2026

---

## 🆕 O que há de novo na Versão 3.0?

### 1. ❌ Modo Claro/Escuro removido
- O sistema agora tem **tema único** azul profissional.
- Código mais limpo, sem `localStorage` de tema, sem `data-theme`.
- Visual mais bonito com gradiente azul na navbar e nos botões.

### 2. ❓ Botão de Dúvidas adicionado na Navbar
- Botão redondo **(?)** no canto da navbar.
- Abre um **modal** com o passo a passo completo das verificações:
  - Verificação de Tara
  - Verificação de Peso (com badges Verde/Amarelo)
  - Verificação de Validade com **tabela de formatos por linha**
- Botão **"Entendi!"** para fechar.

### 3. 📅 Verificação de Validade — Formato por Grupo de Linha
- Campo **"Dia de Produção"** adicionado (antes usava o dia de hoje automático).
- O código gerado agora segue o **formato correto de cada grupo de linha**:

| Linhas | Formato gerado |
|---|---|
| S01, S03, S05, S08, S11, S12, S14 | `L VHE 21 1900 J` / `V 05/29` |
| S10 | `V 05/29 LVEE211900 J` |
| D11, D12 | `V 05/28 L VHE 21 1900 J` |
| A01, A02, A03, A04, A06, A07, A08 | `F: 05/26 V: 05/28` / `L: VPE 21 1900 J` |

### 4. 🐛 Bug do botão "Copiar" corrigido
- O botão mostrava o código JavaScript no texto em vez de funcionar.
- Causa: `onclick` inline com aspas aninhadas quebrava o HTML.
- Correção: substituído por `addEventListener('click', ...)` no JavaScript.
- Agora mostra **"✓ Copiado!"** em verde por 2 segundos e volta ao normal.

### 5. 🖼️ Bug das Imagens corrigido
- A tag `<source>` usava `media="(max-inline-size: 768px)"` — **não funciona** no atributo `media=""` do HTML.
- Corrigido para `media="(max-width: 768px)"` e `media="(min-width: 769px)"`.
- Adicionado `type="image/png"` em cada `<source>`.
- Adicionado `onerror` na `<img>` para carregar imagem reserva se a principal falhar.
- CSS da hero-image corrigido: `width: 100%`, `height: auto`, `object-fit: contain`, `margin: 0 auto`.

---

## 📁 Estrutura do Projeto

```
projeto/
├── index.html          # Página principal
├── CSS/
│   └── style.css       # Estilos — tema único azul profissional
├── JS/
│   └── script.js       # Lógica completa (tara, peso, validade, copiar)
└── Img/
    ├── Logo SQ.png
    ├── png-unilever-white-logo.png
    ├── Imagem-Inspetor-desktop.png
    ├── Imagem-Inspetor-mobile.png
    └── Indústria 4.0 Qualidade e Inovação.png
```

> ⚠️ O arquivo `theme.js` foi **removido** — não é mais necessário.

---

## 🚀 Como Usar

1. Copie todos os arquivos para o seu projeto.
2. Coloque suas imagens na pasta `Img/`.
3. Abra o `index.html` no navegador.
4. Use a navbar para navegar entre Tara, Peso e Validade.
5. Clique no botão **(?)** para ver as instruções de uso.

---

## 🔍 Detalhes Técnicos

### Função `getDiasNoMes(ano, mes)`

```javascript
function getDiasNoMes(ano, mes) {
    // Dia 0 do próximo mês = último dia do mês atual
    return new Date(ano, mes, 0).getDate();
}
```

### Geração do código de validade por linha

```javascript
function getFormatoLinha(linha) {
    const grupoS = ['S01','S03','S05','S08','S11','S12','S14'];
    const grupoD = ['D11','D12'];
    const grupoA = ['A01','A02','A03','A04','A06','A07','A08'];

    if (grupoS.includes(linha)) return 'S';
    if (linha === 'S10')        return 'S10';
    if (grupoD.includes(linha)) return 'D';
    if (grupoA.includes(linha)) return 'A';
}
```

### Botão Copiar — sem onclick inline

```javascript
// ERRADO — causava bug visual
onclick="navigator.clipboard.writeText(...).then(()=>this.innerHTML='Copiado!')"

// CORRETO — usando addEventListener
btnCopiar.addEventListener('click', function () {
    navigator.clipboard.writeText(codigo).then(() => {
        btnCopiar.innerHTML = '<i class="fas fa-check me-1"></i>Copiado!';
        btnCopiar.classList.replace('btn-outline-primary', 'btn-success');
        setTimeout(() => {
            btnCopiar.innerHTML = '<i class="fas fa-copy me-1"></i>Copiar';
            btnCopiar.classList.replace('btn-success', 'btn-outline-primary');
        }, 2000);
    });
});
```

### Imagem responsiva — tag `<picture>` correta

```html
<!-- ERRADO — max-inline-size não funciona no atributo media="" do HTML -->
<source media="(max-inline-size: 768px)" srcset="./Img/mobile.png">

<!-- CORRETO -->
<source media="(max-width: 768px)"  srcset="./Img/Imagem-Inspetor-mobile.png"  type="image/png">
<source media="(min-width: 769px)"  srcset="./Img/Imagem-Inspetor-desktop.png" type="image/png">
<img src="./Img/Imagem-Inspetor-desktop.png"
     onerror="this.onerror=null; this.src='./Img/Indústria 4.0 Qualidade e Inovação.png';"
     class="img-fluid hero-image" alt="Inspetor de Qualidade">
```

---

## ✅ Funcionalidades

| Funcionalidade | Status |
|---|---|
| Verificação de Tara (5 ou 10 amostras) | ✅ Funcionando |
| Verificação de Peso (tolerância 1%) | ✅ Funcionando |
| Verificação de Validade por grupo de linha | ✅ Atualizado v3.0 |
| Botão Copiar código de validade | ✅ Bug corrigido v3.0 |
| Botão de Dúvidas (?) com modal | ✅ Novo v3.0 |
| Imagem hero responsiva (mobile/desktop) | ✅ Bug corrigido v3.0 |
| Design responsivo (celular, tablet, PC) | ✅ Funcionando |
| Acessibilidade VLibras | ✅ Funcionando |
| Animações suaves | ✅ Funcionando |
| Impressão otimizada | ✅ Funcionando |

---

## 🧪 Testes Recomendados

### Imagem
- Abra no celular → deve aparecer a imagem mobile.
- Abra no PC → deve aparecer a imagem desktop.
- Renomeie uma imagem temporariamente → deve aparecer a imagem reserva.

### Validade — Linha S01
- Linha: S01 | Dia: 21 | Mês: Maio | Ano: 2026 | Hora: 19:00 | Validade: 24 meses
- Resultado esperado: `L VCE 21 1900 J` / `V 05/28`

### Validade — Linha S10
- Linha: S10 | Dia: 21 | Mês: Maio | Ano: 2026 | Hora: 19:00 | Validade: 24 meses
- Resultado esperado: `V 05/28 LVEE211900 J`

### Validade — Linha D11
- Linha: D11 | Dia: 21 | Mês: Maio | Ano: 2026 | Hora: 19:00 | Validade: 24 meses
- Resultado esperado: `V 05/28 L VKE 21 1900 J`

### Validade — Linha A01
- Linha: A01 | Dia: 26 | Mês: Maio | Ano: 2026 | Hora: 19:00 | Validade: 24 meses
- Resultado esperado: `F: 05/26 V: 05/28` / `L: VPM 26 1900 J`

### Botão Copiar
- Calcule uma validade qualquer → clique em **Copiar**.
- O botão deve ficar verde com "✓ Copiado!" por 2 segundos.

---

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari).
- JavaScript habilitado.
- Conexão com internet (Bootstrap e Font Awesome via CDN).

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor.

---

**Desenvolvedor Full Stack com ❤️ para Unilever — SmartQuality 4.0**