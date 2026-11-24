# Guia: posts e vídeos em Motion Canvas

Passo a passo para criar e exportar posts, carrosséis e vídeos (com narração e música) deste projeto.

## 1. Instalar (uma vez)

Precisa de:
- [Node.js](https://nodejs.org/) 18 ou mais novo
- [Python](https://www.python.org/) 3.10 ou mais novo, só para narração e música

```powershell
npm install
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

O `npm install` já baixa o FFmpeg usado para exportar MP4 e mixar áudio.

## 2. Abrir o editor

```powershell
npm start
```

Abra `http://localhost:9000/` e escolha o projeto:

| Projeto | O que é | Formato | Exporta |
|---|---|---|---|
| `src/project` | Vídeo vertical de 20 s (Reels/Stories) | 1080×1920 | MP4 |
| `src/carrossel` | Carrossel de 5 slides | 1080×1350 | PNG (1 por slide) |
| `src/post` | Post único (um por curso) | 1080×1350 | PNG |
| `src/post-video` | Post animado com narração e música | 1080×1350 | MP4 com áudio |

No editor, a prévia atualiza sozinha quando você salva um arquivo. Para exportar, clique em **RENDER** (painel *Video Settings*). Os arquivos vão para `output/`.

> **O que pode apagar:** só a pasta `output/`, que o RENDER gera de novo. Não apague `src/scenes/` (o código das animações), `src/images/` (as fotos), `src/audio/` (narração e música) nem `kits/` (os planos de postagem): sem elas o projeto não funciona.

## 3. Regras de conteúdo

- **Sempre ter uma pessoa em destaque** (foto) em todo post e vídeo.
- Fotos só de bancos com uso comercial liberado (Pexels, Unsplash gratuito, Pixabay) ou fotos reais da Fatec com autorização. Veja [BANCOS-DE-IMAGEM.md](BANCOS-DE-IMAGEM.md).
- Nunca apresentar modelo de banco de imagem como aluno da Fatec.
- Escrever **Taquaritinga** (com Q). Link: **vestibular.fatec.sp.gov.br**.

## 4. Onde mexer

| Quero mudar… | Arquivo |
|---|---|
| Cores, fonte, logo, fotos de pessoas | `src/theme.tsx` |
| Textos e áreas de cada curso no post único | `src/poster.tsx` (blocos `SISTEMAS_INTERNET` e `GESTAO_PRODUCAO`, no fim) |
| Slides do carrossel | `src/scenes/carrossel.tsx` |
| Vídeo vertical de 20 s | `src/scenes/matriculas.tsx` |
| Animação do vídeo narrado | `src/scenes/video-sistemas-internet.tsx` |
| Fotos | `src/images/` (com banco e ID no nome do arquivo) |

### Trocar ou adicionar uma foto

1. Salve a foto em `src/images/`, por exemplo `pexels-3184465.jpg`.
2. Em `src/theme.tsx`, importe e exporte:
   ```ts
   import minhaFoto from './images/pexels-3184465.jpg';
   export const FOTO_NOVA = minhaFoto;
   ```
3. Use no curso (`src/poster.tsx`), ajustando posição e tamanho:
   ```ts
   photo: {src: FOTO_NOVA, x: 120, y: -300, width: 1340},
   ```
   `x` e `y` são o centro da foto (o centro da tela é 0,0) e `width` é a largura. A foto precisa cobrir a largura toda do post para não sobrar faixa vazia nas laterais.

### Criar o post de um curso novo

1. Em `src/poster.tsx`, copie o bloco `GESTAO_PRODUCAO` e troque textos, áreas (`icon` + `label`), faixa laranja, checklist e foto. Ícones disponíveis: veja `ICONS` no mesmo arquivo.
2. Crie a cena `src/scenes/post-<curso>.tsx` copiando `post-gestao-producao.tsx` e trocando o conteúdo importado.
3. Adicione a cena em `src/post.ts` (com `?scene` no import) e clique em **RENDER** em `src/post`.

## 5. Narração e música (vídeo narrado)

O áudio é montado em três passos, todos pelo `.venv`.

**a) Roteiro e narração.** Edite o roteiro em `src/audio/roteiro-sistemas-internet.json`. Cada trecho (`segments`) corresponde a uma parte do post que aparece na tela. Também dá para trocar a voz (`pt-BR-FranciscaNeural` ou `pt-BR-AntonioNeural`) e a velocidade (`rate`). Depois gere o áudio:

```powershell
.\.venv\Scripts\python.exe tools\narracao.py src\audio\roteiro-sistemas-internet.json
```

Isso gera o `.wav` da voz e o `.tempos.json` com o início de cada trecho. A animação usa esses tempos para sincronizar sozinha. Precisa de internet, porque as vozes neurais vêm da Microsoft.

**b) Música de fundo original**, sem direitos autorais de terceiros. Os argumentos são a duração em segundos e o BPM. A duração é o `total` do `.tempos.json` mais 1,25 s:

```powershell
.\.venv\Scripts\python.exe tools\musica.py 43.7 src\audio\musica-tech.wav 112
```

**c) Mixagem.** A música abaixa sozinha quando a voz fala. O último número é o volume da música:

```powershell
.\.venv\Scripts\python.exe tools\mixar.py src\audio\roteiro-sistemas-internet.wav src\audio\musica-tech.wav src\audio\roteiro-sistemas-internet.mix.wav 0.42
```

Depois clique em **RENDER** em `src/post-video`.

> Não use músicas do Pixabay ou de outros sites sem conferir o **Content ID**: elas podem gerar reivindicação de direitos ou deixar o vídeo sem som no Instagram e no YouTube.

## 6. Conferir antes de publicar

- **Datas do vestibular:** confira o [calendário oficial](https://vestibular.fatec.sp.gov.br/calendario/). A chamada final dos posts e vídeos vem de `CTA` em `src/theme.tsx`:
  - inscrições abertas → `export const CTA = INSCRICOES_ABERTAS;`
  - fora do período (padrão) → `export const CTA = PROXIMO_VESTIBULAR;`

  Depois de trocar, renderize tudo de novo. No vídeo narrado, ajuste também o último trecho do roteiro e refaça o áudio.
- Datas da prova e da matrícula ficam em `src/exame.tsx` e `src/matricula.tsx`. Atualize a cada edição.
- Abra o MP4 e **escute o áudio** (pronúncia, volume da música).
- Confira a grafia de **Taquaritinga** e o link.
- Veja se nenhuma foto tem marca ou logo de outra empresa em destaque.

## 7. Kit de publicação (postar pelo celular)

A conta é pessoal, então não dá para postar ou agendar por API. O fluxo é: o projeto monta um **kit** e você posta pelo app.

1. Escreva o plano em `kits/<nome>.json`, com data, hora, tipo, arquivos e legenda de cada post. Use `kits/2026-12-prova.json` como modelo.
2. Gere o kit:
   ```powershell
   .\.venv\Scripts\python.exe tools\kit.py kits\2026-12-prova.json
   ```
3. Em `output/publicar/<nome>/` ficam:
   - os arquivos numerados na ordem de postagem (carrossel numa subpasta, `slide-1`…);
   - `LEGENDAS.txt`, com a legenda de cada post pronta para copiar;
   - `agenda.ics`, que você importa no Google Agenda ou no calendário do celular para ganhar **um lembrete 15 min antes** de cada post.
4. Passe a pasta para o celular (Google Drive, OneDrive, WhatsApp para você mesmo…) e poste na hora do lembrete.

## 8. Usando com o Claude Code

O arquivo [`CLAUDE.md`](../CLAUDE.md) na raiz já explica o projeto para o Claude. Para o Claude saber Motion Canvas também em outros projetos, instale a skill:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills\motion-canvas"
Copy-Item docs\claude-skill\motion-canvas\SKILL.md "$env:USERPROFILE\.claude\skills\motion-canvas\SKILL.md"
```

Depois abra uma sessão nova do Claude Code e peça, por exemplo: *"cria um post do curso X com a foto Y"*.
