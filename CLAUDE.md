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
## Postagem e agendamento (Metricool)

Conta do Metricool (deixe vazio no repositório; cada pessoa usa a sua, e o Claude descobre os valores com `getBrandSettings`):
- ID da marca (`blogId`):
- Redes conectadas:

- **Depois de entregar qualquer post ou vídeo, perguntar se a pessoa quer postar/agendar pelo Metricool** (e para quando). Se o conector não estiver conectado, explicar como conectar (guia, seção 7) e oferecer o kit para postar pelo app.
- **Agendar pelo conector do Metricool.** Cada pessoa que clonar o projeto conecta **a própria conta** (passo a passo no guia, seção 7). Nunca gravar no repositório IDs de marca, nomes de usuário, e-mails ou links de posts: no começo de cada agendamento, chamar `getBrandSettings` para descobrir o `blogId`, o fuso e as redes conectadas. Se nenhuma rede estiver conectada, mandar a pessoa conectar no Metricool e parar.
- Funciona com Instagram que o Metricool aceite publicar (testado em 24/11/2026: publicou sozinho no horário). Facebook só como **Página**. Incluir só as redes que `getBrandSettings` mostrar.
- Plano grátis: **20 posts agendados por mês**. Avisar quando o mês estiver perto do limite (`getScheduledPosts`).
- **Mídias pelo Google Drive (padrão, sem GitHub).** O Metricool só aceita mídia por link e importa sozinho links do Google Drive, **desde que esteja na pasta `ClaudeMetricool` do Meu Drive, compartilhada (uma vez) como "Qualquer pessoa com o link"** (testado em 24/11/2026: arquivo privado é recusado). Compartilhar é feito **pela pessoa** no Drive (o Claude Code bloqueia mudar compartilhamento). Requisitos: conectores **Metricool** e **Google Drive** no Claude, na **mesma conta Google** do Google Drive para computador. Guia completo: [docs/METRICOOL.md](docs/METRICOOL.md).
- Fluxo: gerar → renderizar → `tools/kit.py kits/<nome>.json` → `tools/metricool.py kits/<nome>.json` (copia as mídias para `<Drive>/ClaudeMetricool/<nome>/` com nomes únicos `<nome>-NN.ext` e escreve `kits/<nome>.metricool.json`) → esperar o Drive sincronizar → para cada arquivo, achar o link com o conector do Google Drive (`search_files` pelo nome) e pôr em `media` → `createScheduledPost` → anotar o `id` em `metricoolId` → depois do horário, conferir com `getScheduledPosts`.
- Sem Google Drive para computador, o script deixa as mídias em `output/publicar/<nome>/drive/` para a pessoa subir no drive.google.com. `--github` mantém o modo antigo (repositório público + links `raw.githubusercontent.com`).
- **Sempre mostrar ao usuário imagem, legenda, redes e horário e esperar o OK antes de agendar.** Data não pode estar no passado.
- Alternativas: kit para postar pelo app (`agenda.ics` com lembretes) e, para conta profissional + Página sem Metricool, [docs/POSTAGEM-AUTOMATICA.md](docs/POSTAGEM-AUTOMATICA.md) + `tools/postar.py` (não testado).

## Gerador automático (padrão para peças novas)

- Para posts/Reels novos, **use o gerador** em vez de criar cenas fixas: escreva `pedidos/<nome>.json` só com conteúdo (chamada, titulo, destaque, texto, itens, temas, legenda, data/hora; `narracao` por slide no Reels), rode `tools/gerar.py`, renderize `gerador-posts` ou `gerador-reels` e monte o kit com `tools/kit.py`.
- O gerador escolhe estilo (faixa, cheia, dividido, numero, lista, polaroid), paleta, fundo, alinhamento, animação e foto, evitando repetir o histórico (`kits/historico.json`). Texto é ajustado por `src/gen/fit.ts`; fotos são enquadradas pelo ponto de foco cadastrado em `src/gen/fotos.ts`.
- Depois de renderizar, **conferir visualmente** os PNGs/quadros antes de entregar. Renderizar e montar o kit de um pedido antes de gerar o próximo (as saídas são sobrescritas).
- Variedade de fotos depende de `src/gen/fotos.ts`: hoje só há 1 foto; propor mais fotos (com aprovação de download) quando o tema não combinar.

## Estrutura

- Projetos Motion Canvas (editor em `http://localhost:9000/src/<nome>`), listados em `vite.config.ts`:
  - `gerador-posts`: posts do feed gerados (um PNG por item da fila `src/gen/fila-posts.json`).
  - `gerador-reels`: Reels gerado (MP4 1080×1920 com narração e música, fila `src/gen/fila-reels.json`).
  - `post-dezembro`: post fixo da prova de 13/12 e dos cursos (`src/scenes/post-vestibular-dezembro.tsx`, autocontido).
- `src/gen/`: gerador (estilos, ajuste de texto, fotos, filas e áudio do Reels). `src/images/`: logo oficial e fotos, com o banco e o ID no nome do arquivo.
- Módulos antigos sem projeto no editor (importam fotos que não existem mais; não usar sem refazer): `src/theme.tsx`, `src/poster.tsx`, `src/exame.tsx`, `src/matricula.tsx` e `src/matricula-video.ts` (Reels de matrícula, cena perdida; datas de 2027: listas 18/01, 26/01 e 03/02/2027).
- **Só `output/` pode ser apagada sem perda** (é regenerada pelo RENDER). `src/`, `kits/` e `pedidos/` são código e conteúdo.
- `kits/*.json` + `tools/kit.py`: kit de publicação (arquivos numerados, `LEGENDAS.txt` e `agenda.ics` com lembretes) em `output/publicar/<nome>/`.
- Áudio: `tools/narracao.py` (voz edge-tts), `tools/musica.py` (trilha original) e `tools/mixar.py` (mixagem com ducking), rodando pelo `.venv`.
- Saídas em `output/` (fora do git).
