# FatecVideos

Posts, carrosséis e vídeos de divulgação do vestibular da **Fatec Taquaritinga**, feitos com código em [Motion Canvas](https://motion-canvas.io/), TypeScript.

| Projeto | Resultado |
|---|---|
| Post único | PNG 1080×1350 por curso (Sistemas para Internet, Gestão da Produção Industrial) |
| Carrossel | 5 slides PNG 1080×1350 |
| Vídeo vertical | MP4 1080×1920, 20 s (Reels/Stories) |
| Vídeo narrado | MP4 1080×1350 com narração pt-BR e trilha original |

## Começar

```powershell
npm install
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
npm start
```

Abra `http://localhost:9000/`, escolha o projeto e clique em **RENDER**. Os arquivos saem em `output/`.

## Documentação

- [docs/GUIA-POSTS-E-VIDEOS.md](docs/GUIA-POSTS-E-VIDEOS.md): passo a passo completo (editar textos, trocar fotos, criar curso novo, narração, música, exportar).
- [docs/BANCOS-DE-IMAGEM.md](docs/BANCOS-DE-IMAGEM.md): bancos de imagem com uso comercial liberado e a regra de sempre ter uma pessoa.
- [docs/claude-skill/](docs/claude-skill/): skill do Claude Code para Motion Canvas.
- [CLAUDE.md](CLAUDE.md): instruções do projeto para o Claude Code.

## Estrutura

```
src/
  theme.tsx            cores, fontes, logo, fotos e photoBand()
  poster.tsx           layout do post único + conteúdo de cada curso
  scenes/              cenas (vídeo, carrossel, posts, vídeo narrado)
  images/              fotos (banco + ID no nome do arquivo)
  audio/               roteiro, narração, música e mixagem
  project.ts           vídeo vertical
  carrossel.ts         carrossel
  post.ts              posts únicos
  post-video.ts        vídeo narrado
tools/
  narracao.py          narração pt-BR (edge-tts)
  musica.py            trilha original (numpy)
  mixar.py             mixagem voz + música com ducking (ffmpeg)
docs/                  guias e skill
```

## Créditos e licenças das fotos

Fotos de bancos com licença de uso comercial gratuita, sem crédito obrigatório:
- `pixabay-students-1807505.jpg`: [Pixabay #1807505](https://pixabay.com/pt/photos/alunos-computadores-laptops-1807505/) (Licença de Conteúdo do Pixabay)
- `unsplash-N_nAAwnBDy8-tecnico-estoque.jpg`: [Unsplash N_nAAwnBDy8](https://unsplash.com/photos/N_nAAwnBDy8) (Licença Unsplash)
- `unsplash-5jugXEl5YHM-operadora-fabrica.jpg`: [Unsplash 5jugXEl5YHM](https://unsplash.com/photos/5jugXEl5YHM) (Licença Unsplash)

As pessoas das fotos são modelos de banco de imagem, não alunos da Fatec.

A trilha `src/audio/musica-tech.wav` é original, gerada por `tools/musica.py`. A narração é gerada com vozes neurais da Microsoft via edge-tts.
