# FatecVideos

Posts e vídeos de divulgação do vestibular da **Fatec Taquaritinga**, feitos com código em [Motion Canvas](https://motion-canvas.io/) (TypeScript) e publicados no Instagram/Facebook pelo **Metricool**, com o **Claude Code** fazendo o trabalho pesado.

- **Você descreve o conteúdo; o gerador cria a arte.** Ele tem 6 estilos de layout, 4 paletas, 4 fundos e 4 animações, e evita repetir os últimos usados.
- **O texto se ajusta sozinho** e a foto é enquadrada pelo rosto. Nada estoura nem encosta.
- **Reels com narração em pt-BR** (vozes neurais) e **trilha original**, sem problema de direitos autorais.
- **Kit pronto para postar:** arquivos na ordem, legendas e lembretes no calendário.
- **Agendamento pelo Metricool**, com as mídias no Google Drive.

```
pedido (só texto) ──► gerador ──► RENDER ──► kit ──► Google Drive ──► Metricool ──► Instagram / Facebook
  pedidos/*.json    tools/gerar.py  editor   tools/kit.py  tools/metricool.py   (Claude)
```

---

## Tutorial passo a passo

### Passo 1: instalar (uma vez)

Você precisa de:
- **[Node.js](https://nodejs.org/) 18 ou mais novo**: o editor e o render;
- **[Python](https://www.python.org/) 3.10 ou mais novo**: narração, música, kit e Metricool;
- **[Git](https://git-scm.com/)**, para clonar;
- **[Claude Code](https://claude.com/claude-code)**, para pedir peças e agendar.

```powershell
git clone https://github.com/KoyaTH/FatecVideos.git
cd FatecVideos
npm install
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

O `npm install` também baixa o FFmpeg usado para exportar MP4 e mixar o áudio.

### Passo 2: abrir o editor

```powershell
npm start
```

Abra `http://localhost:9000/`. Os projetos principais são:

| Projeto | O que gera | Formato |
|---|---|---|
| `src/gerador-posts` | posts do feed, um PNG por item do pedido | 1080×1350 |
| `src/gerador-reels` | Reels com narração e música | MP4 1080×1920 |
| `src/post-dezembro` | post fixo: prova de 13/12 e cursos | PNG 1080×1350 |

### Passo 3: criar posts e Reels com o Claude

Abra o Claude Code na pasta do projeto. Ele lê o [`CLAUDE.md`](CLAUDE.md) e já conhece as regras. Peça, por exemplo:

> *"Faz 3 posts e 1 Reels sobre a prova do Vestibular Fatec, confere as datas no site oficial e monta o kit."*

O Claude:
1. confere as datas no site oficial;
2. escreve o pedido em `pedidos/<nome>.json`;
3. roda o gerador;
4. renderiza e confere as imagens;
5. monta o kit em `output/publicar/<nome>/`.

Prefere fazer à mão? Os comandos são:

```powershell
.\.venv\Scripts\python.exe tools\gerar.py pedidos\exemplo-posts.json
```

Clique em **RENDER** em `src/gerador-posts` (ou `gerador-reels`) e depois rode:

```powershell
.\.venv\Scripts\python.exe tools\kit.py kits\exemplo-posts.json
```

O kit tem os arquivos na ordem de postagem, o `LEGENDAS.txt` e um `agenda.ics` com lembretes 15 minutos antes de cada post.

### Passo 4: configurar o Metricool + Google Drive (uma vez)

O Metricool publica sozinho no horário marcado. As imagens chegam a ele por um link do Google Drive. Detalhes e solução de problemas: **[docs/METRICOOL.md](docs/METRICOOL.md)**.

1. **Metricool:** crie uma conta grátis em [metricool.com](https://metricool.com) (até 20 posts agendados por mês), crie uma marca e conecte o **Instagram**. Para o Facebook, conecte uma **Página**.
2. **Google Drive:** em **Meu Drive**, crie a pasta **`ClaudeMetricool`**.
3. **Compartilhe a pasta:** botão direito em `ClaudeMetricool` → **Compartilhar → Acesso geral → Qualquer pessoa com o link → Leitor**. O Metricool só baixa arquivos compartilhados assim. Não coloque nada pessoal nessa pasta.
4. **Google Drive para computador:** instale o [Google Drive para computador](https://www.google.com/drive/download/) com **a mesma conta Google**. A pasta `ClaudeMetricool` aparece sincronizada no seu PC (por exemplo `G:\Meu Drive\ClaudeMetricool`).
5. **Claude:** em claude.ai → **Configurações → Conectores**, conecte **Metricool** e **Google Drive** (mesma conta Google). Abra uma sessão nova do Claude Code.
6. **Conferir:** peça *"confere minha conta do Metricool"*.

### Passo 5: agendar um kit

1. Mande as mídias do kit para o Drive:
   ```powershell
   .\.venv\Scripts\python.exe tools\metricool.py kits\<nome>.json
   ```
   Os arquivos vão para `Meu Drive/ClaudeMetricool/<nome>/`. Para postar nas duas redes, use `kits\<nome>.json instagram,facebook`.
2. Espere o Drive sincronizar.
3. Peça ao Claude: *"agenda o kit `<nome>` no Metricool"*. Ele mostra **imagem, legenda, rede e horário de cada post**, **só agenda com o seu OK** e, passado o horário, confere se publicou.

Para testar sem publicar, peça: *"manda o post X para o Metricool como rascunho"*.

---

## Documentação

| Documento | Conteúdo |
|---|---|
| [docs/GUIA-POSTS-E-VIDEOS.md](docs/GUIA-POSTS-E-VIDEOS.md) | guia completo: editor, onde mexer, narração e música, kit, gerador automático |
| [docs/METRICOOL.md](docs/METRICOOL.md) | Metricool + Google Drive: configuração, publicação, rascunho e problemas comuns |
| [docs/BANCOS-DE-IMAGEM.md](docs/BANCOS-DE-IMAGEM.md) | bancos de imagem com uso comercial liberado e a regra de sempre ter uma pessoa |
| [docs/DEMO.md](docs/DEMO.md) | prompts prontos para apresentar o projeto ao vivo |
| [docs/POSTAGEM-AUTOMATICA.md](docs/POSTAGEM-AUTOMATICA.md) | alternativa: API oficial da Meta (conta profissional + Página) |
| [docs/claude-skill/](docs/claude-skill/) | skill do Claude Code para Motion Canvas |
| [CLAUDE.md](CLAUDE.md) | regras e fluxo do projeto para o Claude Code |

## Regras de conteúdo

- **Sempre uma pessoa em destaque** em todo post e vídeo.
- Fotos só de bancos com uso comercial liberado (Pexels, Unsplash gratuito, Pixabay) ou fotos reais com autorização. **Nunca** apresentar modelo de banco de imagem como aluno da Fatec.
- **Logo oficial** sem alterações (`src/images/logo-fatec-taquaritinga.png`). Em fundo escuro, ele vai sobre uma plaquinha branca.
- Datas sempre conferidas no [calendário oficial](https://vestibular.fatec.sp.gov.br/calendario/).

## Estrutura

```
src/
  gen/                 gerador: estilos, ajuste de texto, fotos, filas e áudio do Reels
  scenes/              cenas do gerador e do post fixo de dezembro
  images/              logo oficial e fotos (banco + ID no nome do arquivo)
  gerador-posts.ts     projeto: posts gerados (PNG)
  gerador-reels.ts     projeto: Reels gerado (MP4 com áudio)
  post-dezembro.ts     projeto: post fixo da prova de 13/12
  theme.tsx            cores, fontes e chamada final (CTA)
tools/
  gerar.py             escolhe o visual e prepara as filas e o áudio
  kit.py               monta o kit (arquivos, legendas, agenda.ics)
  metricool.py         copia as mídias para o Google Drive e prepara o agendamento
  narracao.py          narração pt-BR (edge-tts)
  musica.py            trilha original (numpy)
  mixar.py             mixagem voz + música com ducking (ffmpeg)
  postar.py            alternativa pela API da Meta (não testado)
pedidos/               pedidos de conteúdo (exemplos)
kits/                  planos de postagem e histórico do gerador
docs/                  guias e skill
output/                renders e kits (fora do git; pode apagar)
```

> **Só `output/` pode ser apagada sem perda.** As outras pastas são código e conteúdo.

## Créditos e licenças

- `pexels-6683579-sala-prova.jpg`: [Pexels #6683579](https://www.pexels.com/photo/6683579/) (Licença Pexels). As pessoas da foto são modelos de banco de imagem, não alunos da Fatec.
- Logo da Fatec Taquaritinga: marca da instituição, usada sem alterações.
- Trilha sonora: original, gerada por `tools/musica.py`. Narração: vozes neurais da Microsoft via edge-tts.
