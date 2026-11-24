# Guia: posts e vídeos em Motion Canvas

Passo a passo para criar, exportar e publicar os posts e Reels deste projeto.

## 1. Instalar (uma vez)

Precisa de:
- [Node.js](https://nodejs.org/) 18 ou mais novo
- [Python](https://www.python.org/) 3.10 ou mais novo (gerador, narração, música, kit e Metricool)

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
| `src/gerador-posts` | posts do feed criados pelo gerador, um por item do pedido | 1080×1350 | PNG (1 por post) |
| `src/gerador-reels` | Reels criado pelo gerador, com narração e música | 1080×1920 | MP4 com áudio |
| `src/post-dezembro` | post fixo: prova de 13/12 e cursos da Fatec Taquaritinga | 1080×1350 | PNG |

No editor, a prévia atualiza sozinha quando você salva um arquivo. Para exportar, clique em **RENDER** (painel *Video Settings*). Os arquivos vão para `output/`.

> **O que pode apagar:** só a pasta `output/`, que o RENDER gera de novo. Não apague `src/`, `pedidos/` nem `kits/`: são o código e o conteúdo do projeto.

## 3. Regras de conteúdo

- **Sempre ter uma pessoa em destaque** (foto) em todo post e vídeo.
- Fotos só de bancos com uso comercial liberado (Pexels, Unsplash gratuito, Pixabay) ou fotos reais da Fatec com autorização. Veja [BANCOS-DE-IMAGEM.md](BANCOS-DE-IMAGEM.md).
- Nunca apresentar modelo de banco de imagem como aluno da Fatec.
- **Logo oficial** (`src/images/logo-fatec-taquaritinga.png`) sem recolorir nem redesenhar.
- Escrever **Taquaritinga** (com Q). Link: **vestibular.fatec.sp.gov.br**.
- Datas sempre conferidas no [calendário oficial](https://vestibular.fatec.sp.gov.br/calendario/).

## 4. Criar posts e Reels (gerador automático)

O gerador monta cada peça escolhendo sozinho o visual. Você (ou o Claude) só descreve o **conteúdo**.

| O que varia | Opções |
|---|---|
| Estilo de layout | `faixa` (foto em cima), `cheia` (foto de fundo inteira), `dividido` (foto de um lado), `numero` (data/número gigante com foto em círculo), `lista` (itens em cartões), `polaroid` (foto inclinada) |
| Paleta | `azul`, `laranja`, `vermelho`, `claro` |
| Fundo | `grade`, `diagonal`, `circulos`, `liso` |
| Alinhamento | `esquerda`, `centro` |
| Animação (Reels) | `subir`, `pop`, `lado`, `fade` |
| Foto | a que combina com os `temas` do item, revezando |

- **Sem repetição:** o gerador evita o que foi usado nos últimos posts (histórico em `kits/historico.json`).
- **O texto se ajusta sozinho:** tamanho e quebra de linha são calculados para nunca estourar nem encostar em nada.
- **Foto enquadrada sozinha:** cada foto tem um ponto de foco (o rosto) cadastrado, e o corte mantém esse ponto visível em qualquer layout.
- **O mesmo conteúdo serve para feed (4:5) e Reels (9:16).**

### Passo a passo

1. **Escreva o pedido** em `pedidos/<nome>.json`. Modelos: `pedidos/exemplo-posts.json` e `pedidos/exemplo-reels.json`.

   | Campo | Onde | O que é |
   |---|---|---|
   | `nome`, `tipo` | topo | nome do pedido e `"posts"` ou `"reels"` |
   | `selo` | topo ou item | etiqueta no canto superior (padrão: "VESTIBULAR FATEC") |
   | `chamada`, `titulo`, `destaque`, `texto`, `itens` | item | o conteúdo: linha pequena, título, número ou palavra gigante, parágrafo e lista |
   | `rodape` | item | linha final (padrão: o site do vestibular) |
   | `temas` | item | ajuda a escolher a foto (ex.: `["prova"]`) |
   | `legenda`, `data`, `hora` | item (posts) ou topo (Reels) | texto do post e quando publicar |
   | `narracao`, `duracao` | item (Reels) | fala do slide e, sem narração, quantos segundos ele dura |
   | `voz`, `velocidade`, `bpm`, `animacao` | topo (Reels) | voz (`pt-BR-FranciscaNeural` ou `pt-BR-AntonioNeural`), velocidade da fala (ex.: `"+6%"`), ritmo da música e animação |
   | `estilo`, `paleta`, `fundo`, `alinhamento`, `foto` | item | **opcional:** força o visual daquele item |

2. **Gere:**
   ```powershell
   .\.venv\Scripts\python.exe tools\gerar.py pedidos\<nome>.json
   ```
   No Reels, isso também gera a narração, a música e a mixagem.
3. **Renderize:** clique em **RENDER** em `src/gerador-posts` (um PNG por post) ou `src/gerador-reels` (MP4 com áudio).
4. **Monte o kit** (seção 8):
   ```powershell
   .\.venv\Scripts\python.exe tools\kit.py kits\<nome>.json
   ```

> Renderize e monte o kit de um pedido **antes** de gerar o próximo: `output/gerador-posts/` e `output/gerador-reels.mp4` são sobrescritos a cada render.

## 5. Onde mexer

| Quero mudar… | Arquivo |
|---|---|
| Texto, datas, legendas de um post ou Reels | `pedidos/<nome>.json` |
| Cores das paletas, estilos de layout, fundos | `src/gen/estilos.tsx` (`PALETAS` e `montar()`) |
| Animações do Reels | `src/scenes/gerador-reels.tsx` |
| Fotos disponíveis e ponto de foco | `src/gen/fotos.ts` |
| Logo | `src/images/logo-fatec-taquaritinga.png` (não alterar) |
| Post fixo da prova de 13/12 | `src/scenes/post-vestibular-dezembro.tsx` |

## 6. Adicionar uma foto

O gerador só reveza entre as fotos cadastradas. Mais fotos = mais variedade.

1. Baixe a foto de um banco liberado ([BANCOS-DE-IMAGEM.md](BANCOS-DE-IMAGEM.md)) e salve em `src/images/` com o banco e o ID no nome, por exemplo `unsplash-abc123-turma.jpg`.
2. Cadastre a foto em `src/gen/fotos.ts`:
   ```ts
   import turma from '../images/unsplash-abc123-turma.jpg';
   // ...
   export const FOTOS = {
     // ...
     turma: {
       src: turma, w: 1600, h: 1067,         // largura e altura em pixels
       foco: [0.62, 0.40],                    // onde está o rosto (0 a 1, da esquerda e do topo)
       temas: ['estudantes', 'tecnologia'],   // assuntos em que a foto combina
       credito: 'Unsplash abc123',
     },
   };
   ```
3. Peça ao gerador com `temas` que batam com os da foto, ou force com `"foto": "turma"`.

## 7. Narração e música

No Reels, o `tools/gerar.py` cuida de tudo: gera a narração com a voz escolhida, compõe uma **trilha original** no tamanho certo e mixa as duas, abaixando a música quando a voz fala. A narração precisa de internet, porque as vozes neurais vêm da Microsoft.

As ferramentas também funcionam sozinhas, para outros vídeos:

```powershell
.\.venv\Scripts\python.exe tools\narracao.py roteiro.json
```
Gera a voz (`.wav`) e os tempos de cada trecho (`.tempos.json`).

```powershell
.\.venv\Scripts\python.exe tools\musica.py 30 musica.wav 112
```
Gera uma trilha original de 30 s a 112 BPM.

```powershell
.\.venv\Scripts\python.exe tools\mixar.py voz.wav musica.wav final.wav 0.42
```
Mixa voz e música. O último número é o volume da música.

> Não use músicas do Pixabay ou de outros sites sem conferir o **Content ID**: elas podem gerar reivindicação de direitos ou deixar o vídeo sem som no Instagram e no YouTube.

## 8. Conferir antes de publicar

- **Datas do vestibular:** confira o [calendário oficial](https://vestibular.fatec.sp.gov.br/calendario/). Não escreva "Inscrições abertas" fora do período: ajuste `chamada`, `texto` ou `rodape` no pedido.
- Abra os PNGs e o MP4 e **escute o áudio**: pronúncia e volume da música.
- Confira a grafia de **Taquaritinga** e o link.
- Veja se nenhuma foto tem marca ou logo de outra empresa em destaque.

## 9. Kit de publicação e Metricool

1. Gere o kit a partir do plano que o gerador criou em `kits/<nome>.json`:
   ```powershell
   .\.venv\Scripts\python.exe tools\kit.py kits\<nome>.json
   ```
2. Em `output/publicar/<nome>/` ficam:
   - os arquivos numerados na ordem de postagem (carrossel numa subpasta, `slide-1`…);
   - `LEGENDAS.txt`, com a legenda de cada post pronta para copiar;
   - `agenda.ics`, que você importa no Google Agenda ou no calendário do celular para ganhar **um lembrete 15 minutos antes** de cada post.

### Agendar pelo Metricool (publica sozinho)

O Claude agenda pelo conector do **Metricool**, com as mídias na pasta **`ClaudeMetricool`** do seu Google Drive, compartilhada como "Qualquer pessoa com o link". Testado em 24/11/2026: o post foi publicado sozinho no horário marcado. O plano grátis permite **20 posts agendados por mês**, e cada pessoa conecta a própria conta.

Configuração, passo a passo e solução de problemas: **[METRICOOL.md](METRICOOL.md)**.

Sem Metricool, use o kit para postar pelo app. Para a API oficial da Meta (conta profissional + Página), veja [POSTAGEM-AUTOMATICA.md](POSTAGEM-AUTOMATICA.md).

## 10. Usando com o Claude Code

O arquivo [`CLAUDE.md`](../CLAUDE.md) na raiz já explica o projeto para o Claude. Peça, por exemplo: *"faz 3 posts e 1 Reels sobre a prova e agenda no Metricool"*. Prompts prontos para apresentar o projeto: [DEMO.md](DEMO.md).

Para o Claude saber Motion Canvas também em outros projetos, instale a skill:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills\motion-canvas"
Copy-Item docs\claude-skill\motion-canvas\SKILL.md "$env:USERPROFILE\.claude\skills\motion-canvas\SKILL.md"
```
