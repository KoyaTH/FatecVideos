# FatecVideos

Posts, carrosséis, vídeos e animações em Motion Canvas para a Fatec Taquaritinga (vestibular / divulgação de cursos). Conteúdo em pt-BR.

## Regras de conteúdo

- **Sempre ter pelo menos um ser humano** em destaque em todo post, carrossel, vídeo e animação Motion Canvas. Ilustrações e ícones complementam, nunca substituem a pessoa. Se um trabalho existente não tiver gente, aponte isso e proponha uma foto.
- Fontes de imagem, licenças e cuidados: ver [docs/BANCOS-DE-IMAGEM.md](docs/BANCOS-DE-IMAGEM.md); passo a passo em [docs/GUIA-POSTS-E-VIDEOS.md](docs/GUIA-POSTS-E-VIDEOS.md). Usar só bancos com uso comercial liberado: fotos reais da Fatec (com autorização) → Pexels / Unsplash (gratuitas, não Unsplash+) / Pixabay. Nada de bancos pagos (Magnific/Freepik, Unsplash+).
- Nunca apresentar modelo de banco de imagem como aluno da Fatec.
- Música: evitar faixas com Content ID; o padrão é a trilha original de `tools/musica.py`.
- Escrever "Taquaritinga" (com Q). Link do vestibular: vestibular.fatec.sp.gov.br.
- **Antes de montar posts ou kits, conferir o calendário oficial** (vestibular.fatec.sp.gov.br/calendario). Não publicar "Inscrições abertas" fora do período: a chamada final vem de `CTA` em `src/theme.tsx` (`PROXIMO_VESTIBULAR` ou `INSCRICOES_ABERTAS`).
- A conta do Instagram/Facebook é **pessoal** e o usuário não quer torná-la profissional: não há API para postar/agendar. O fluxo é o kit de publicação (`tools/kit.py` + `kits/*.json`) e o usuário posta pelo app.

## Estrutura

- `src/theme.tsx`: cores, fontes, logo e listas compartilhadas; fotos de pessoas (`FOTO_TECNICO`, `FOTO_OPERADORA`) e `photoBand()`.
- `src/images/`: fotos, com o banco e o ID no nome do arquivo.
- `src/poster.tsx`: layout do post único (1080×1350) e o conteúdo de cada curso (campo `photo` para a foto com pessoas).
- Projetos Motion Canvas (editor em `http://localhost:9000/src/<nome>`):
  - `project`: vídeo vertical de 20 s.
  - `carrossel`: 5 slides em PNG.
  - `post`: post único em PNG.
  - `post-video`: post animado com narração e música.
  - `matricula-video`: Reels vertical (1080×1920, ~52 s) de matrícula, com narração e música. Datas e documentos ficam em `src/matricula.tsx` (também usado pelo post `post-matricula`); hoje com os dados do vestibular do 1º semestre de 2026.
- `src/exame.tsx`: posts da prova (data/linha do tempo e checklist), com dados do FAQ e calendário oficiais; cenas `post-exame-data` e `post-exame-checklist` no projeto `post`.
- `kits/*.json` + `tools/kit.py`: kit de publicação (arquivos numerados, `LEGENDAS.txt` e `agenda.ics` com lembretes) em `output/publicar/<nome>/`.
- Áudio: `tools/narracao.py` (voz edge-tts), `tools/musica.py` (trilha original) e `tools/mixar.py` (mixagem com ducking), rodando pelo `.venv`.
- Saídas em `output/` (fora do git).
