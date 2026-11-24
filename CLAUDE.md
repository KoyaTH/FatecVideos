# FatecVideos

Posts, carrosséis, vídeos e animações em Motion Canvas para a Fatec Taquaritinga (vestibular / divulgação de cursos). Conteúdo em pt-BR.

## Regras de conteúdo

- **Sempre ter pelo menos um ser humano** em destaque em todo post, carrossel, vídeo e animação Motion Canvas. Ilustrações e ícones complementam, nunca substituem a pessoa. Se um trabalho existente não tiver gente, aponte isso e proponha uma foto.
- Fontes de imagem, licenças e cuidados: ver [docs/BANCOS-DE-IMAGEM.md](docs/BANCOS-DE-IMAGEM.md); passo a passo em [docs/GUIA-POSTS-E-VIDEOS.md](docs/GUIA-POSTS-E-VIDEOS.md). Usar só bancos com uso comercial liberado: fotos reais da Fatec (com autorização) → Pexels / Unsplash (gratuitas, não Unsplash+) / Pixabay. Nada de bancos pagos (Magnific/Freepik, Unsplash+).
- Nunca apresentar modelo de banco de imagem como aluno da Fatec.
- Música: evitar faixas com Content ID; o padrão é a trilha original de `tools/musica.py`.
- **Logo oficial:** `src/images/logo-fatec-taquaritinga.png` (376×120, fundo transparente). Nunca recolorir nem redesenhar; em fundo escuro ou foto, usar sobre uma plaquinha branca (como no gerador, `logo()` em `src/gen/estilos.tsx`).
- Escrever "Taquaritinga" (com Q). Link do vestibular: vestibular.fatec.sp.gov.br.
- **Antes de montar posts ou kits, conferir o calendário oficial** (vestibular.fatec.sp.gov.br/calendario). Não publicar "Inscrições abertas" fora do período: a chamada final vem de `CTA` em `src/theme.tsx` (`PROXIMO_VESTIBULAR` ou `INSCRICOES_ABERTAS`).
- A conta do Instagram/Facebook é **pessoal** e o usuário não quer torná-la profissional: não há API para postar/agendar. O fluxo é o kit de publicação (`tools/kit.py` + `kits/*.json`) e o usuário posta pelo app. Para quem tiver conta profissional + Página: [docs/POSTAGEM-AUTOMATICA.md](docs/POSTAGEM-AUTOMATICA.md) e `tools/postar.py` (não testado contra a API real).

## Gerador automático (padrão para peças novas)

- Para posts/Reels novos, **use o gerador** em vez de criar cenas fixas: escreva `pedidos/<nome>.json` só com conteúdo (chamada, titulo, destaque, texto, itens, temas, legenda, data/hora; `narracao` por slide no Reels), rode `tools/gerar.py`, renderize `gerador-posts` ou `gerador-reels` e monte o kit com `tools/kit.py`.
- O gerador escolhe estilo (faixa, cheia, dividido, numero, lista, polaroid), paleta, fundo, alinhamento, animação e foto, evitando repetir o histórico (`kits/historico.json`). Texto é ajustado por `src/gen/fit.ts`; fotos são enquadradas pelo ponto de foco cadastrado em `src/gen/fotos.ts`.
- Depois de renderizar, **conferir visualmente** os PNGs/quadros antes de entregar. Renderizar e montar o kit de um pedido antes de gerar o próximo (as saídas são sobrescritas).
- Variedade de fotos depende de `src/gen/fotos.ts`: hoje só há 1 foto; propor mais fotos (com aprovação de download) quando o tema não combinar.

## Estrutura

- `src/theme.tsx`: cores, fontes, logo e listas compartilhadas; fotos de pessoas (`FOTO_TECNICO`, `FOTO_OPERADORA`) e `photoBand()`.
- `src/images/`: fotos, com o banco e o ID no nome do arquivo.
- `src/poster.tsx`: layout do post único (1080×1350) e o conteúdo de cada curso (campo `photo` para a foto com pessoas).
- Projetos Motion Canvas (editor em `http://localhost:9000/src/<nome>`):
  - `project`: vídeo vertical de 20 s.
  - `carrossel`: 5 slides em PNG.
  - `post`: post único em PNG.
  - `post-video`: post animado com narração e música.
  - `matricula-video`: Reels vertical de matrícula. **Desativado** em `vite.config.ts`: a cena `src/scenes/video-matricula.tsx` e o áudio foram apagados em 24/11/2026 e nunca estiveram no git. O roteiro (`src/audio/roteiro-matricula.json`) e o layout (`src/matricula.tsx`, usado pelo post `post-matricula`) existem; datas ainda de jan/2026, atualizar para 2027 (calendário oficial: listas 18/01, 26/01 e 03/02/2027).
- **Só `output/` pode ser apagada sem perda** (é regenerada pelo RENDER). `src/scenes`, `src/images`, `src/audio` e `kits/` são código e conteúdo.
- `src/exame.tsx`: posts da prova (data/linha do tempo e checklist), com dados do FAQ e calendário oficiais; cenas `post-exame-data` e `post-exame-checklist` no projeto `post`.
- `kits/*.json` + `tools/kit.py`: kit de publicação (arquivos numerados, `LEGENDAS.txt` e `agenda.ics` com lembretes) em `output/publicar/<nome>/`.
- Áudio: `tools/narracao.py` (voz edge-tts), `tools/musica.py` (trilha original) e `tools/mixar.py` (mixagem com ducking), rodando pelo `.venv`.
- Saídas em `output/` (fora do git).
