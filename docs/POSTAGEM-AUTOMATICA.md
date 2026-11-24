# Tutorial: postar automaticamente no Instagram e no Facebook

Este guia serve para **quem quiser agendar ou automatizar** os posts da Fatec Taquaritinga. Hoje o projeto usa outro fluxo: a conta é pessoal, então você posta pelo app com o kit de publicação ([GUIA-POSTS-E-VIDEOS.md §7](GUIA-POSTS-E-VIDEOS.md#7-kit-de-publicação-postar-pelo-celular)). Esse fluxo continua valendo.

> Conferido em 24/11/2026 na documentação da Meta (Instagram Platform, Content Publishing, API v27.0). A Meta muda telas, versões e limites com frequência. Se algo estiver diferente, confie no painel e na documentação oficial.

## 0. O que é obrigatório (sem isso não existe automação)

| Rede | Precisa ter | Não funciona com |
|---|---|---|
| Instagram | Conta **profissional**: *Criador de conteúdo* ou *Empresa* | Conta pessoal |
| Facebook | Uma **Página** do Facebook | Perfil pessoal (a Meta tirou a API de perfil em 2018) |

Para usar o caminho da API (opção C), a conta profissional do Instagram também precisa estar **vinculada à Página**.

**Como trocar o Instagram para conta profissional:** no app, vá em *Configurações → Tipo de conta e ferramentas → Mudar para conta profissional*. Escolha **Criador de conteúdo**, que é grátis. Dá para voltar para pessoal depois. O que muda:
- o perfil fica **público**;
- surgem as estatísticas (*Insights*) e o botão de contato;
- algumas músicas da biblioteca do Reels podem ficar indisponíveis. Isso não pesa para o projeto, porque a trilha padrão é a de `tools/musica.py`.

**Como vincular a Página:** no Instagram, abra *Editar perfil → Página* e escolha a Página. Outro caminho é pela Central de Contas da Meta.

> **Não use** bibliotecas ou apps "não oficiais" que postam com o seu usuário e senha (instagrapi, bots, extensões de navegador). Elas violam os termos da Meta e podem fazer a conta ser **bloqueada**. Também exigem entregar a sua senha a terceiros.

## Qual caminho escolher

| Opção | Para quem | Programação? | Custo |
|---|---|---|---|
| **A. Meta Business Suite** | Quase todo mundo: agenda Instagram e Facebook juntos | Não | Grátis |
| **B. Ferramentas de terceiros** (mLabs, Buffer, Later, etc.) | Quem já usa uma delas ou cuida de várias contas | Não | Em geral pago, às vezes com plano grátis limitado |
| **C. API da Meta + `tools/postar.py`** | Quem quer publicar direto do kit, sem abrir nada | Sim, um pouco | Grátis |

**Recomendação:** comece pela **A**. A **C** só compensa se você for publicar muitos kits.

---

## A. Agendar pelo Meta Business Suite (sem código)

1. Entre em **business.facebook.com** com a conta do Facebook que administra a Página. No celular, use o app **Meta Business Suite**.
2. Confira se a Página e o Instagram aparecem no topo. Se o Instagram não aparecer, vincule em *Configurações → Contas do Instagram*.
3. Gere o kit normalmente:
   ```powershell
   .\.venv\Scripts\python.exe tools\kit.py kits\<nome>.json
   ```
4. Para cada post de `output/publicar/<nome>/`:
   1. clique em **Criar post** (ou *Criar Reel* para vídeo);
   2. marque **Facebook** e **Instagram** como destino;
   3. envie a imagem. No carrossel, envie os `slide-1`, `slide-2`… em ordem;
   4. cole a legenda de `LEGENDAS.txt`;
   5. em **Opções de agendamento**, escolha **Programar** e coloque a data e a hora do nome do arquivo (horário de Brasília);
   6. clique em **Programar**.
5. Confira tudo em **Planejador**: os posts agendados aparecem no calendário, e lá dá para editar ou cancelar.

O próprio app do Instagram também agenda posts de contas profissionais: em *Configurações avançadas → Programar este post*. Funciona bem para um post solto, mas o Business Suite agenda o Instagram e o Facebook de uma vez.

## B. Ferramentas de terceiros

Funcionam igual à opção A: você conecta a Página e o Instagram profissional, envia os arquivos do kit e agenda. Antes de usar:
- elas também **exigem conta profissional** e Página, porque usam a mesma API da Meta;
- confira o preço e o limite de posts do plano;
- só use ferramentas que pedem **login pela tela da Meta**. Nunca entregue a senha do Instagram.

---

## C. Publicar pela API da Meta com `tools/postar.py`

O script lê o mesmo `kits/<nome>.json` do kit. Quando chega a hora de cada post, ele publica na **Página do Facebook** e no **Instagram**. O Agendador de Tarefas do Windows roda o script a cada 15 minutos.

O script cuida destas regras:
- **Só imagens**: post único ou carrossel de até 20 itens. Vídeo e Reels ele pula e avisa: poste esses pelo Business Suite.
- **Converte PNG em JPEG**, porque a API do Instagram só aceita JPEG. Ela aceita proporção de 4:5 a 1,91:1, e o post de 1080×1350 é 4:5, então serve.
- **O Instagram busca a imagem por um link público.** O script primeiro sobe cada imagem na Página **sem publicar** e usa o link que o Facebook devolve. Assim não é preciso ter hospedagem.
- **Nunca posta duas vezes**: o que já saiu fica em `output/publicar/<nome>/publicados.json`.
- **Nunca posta muito atrasado**: se o PC estava desligado e o post passou da hora há mais de 3 horas, o script não publica e avisa no log.
- **Legenda de até 2.200 caracteres** (limite do Instagram).
- O registro de cada execução fica em `output/publicar/<nome>/postar.log`.

### C1. Criar o app na Meta (uma vez)

1. Entre em **developers.facebook.com** com a conta que administra a Página e clique em **Meus apps → Criar app**.
2. No caso de uso, escolha o de **gerenciar tudo na Página**, ou *Outro → Empresa*, conforme o painel oferecer.
3. Adicione os produtos **Login do Facebook para Empresas** e **API do Instagram** (a opção *com Login do Facebook*).
4. Deixe o app em **modo de desenvolvimento**. Para publicar nas **suas próprias** contas, em que você é administrador do app e da Página, **não precisa de Análise do App** (App Review). Ela só é exigida para publicar em contas de outras pessoas.

### C2. Pegar os tokens e os IDs (uma vez)

1. Abra o **Graph API Explorer** (developers.facebook.com/tools/explorer) e escolha o seu app.
2. Em *Permissões*, marque:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `instagram_basic`
   - `instagram_content_publish`
   - `business_management`

   Clique em **Generate Access Token** e autorize a Página e o Instagram.
3. Esse token dura cerca de uma hora. Troque por um de **longa duração** (60 dias). Para isso, abra no navegador o endereço abaixo, preenchendo os três valores. O ID e a chave secreta ficam em *Configurações do app → Básico*.
   ```
   https://graph.facebook.com/v27.0/oauth/access_token?grant_type=fb_exchange_token&client_id=ID_DO_APP&client_secret=CHAVE_SECRETA&fb_exchange_token=TOKEN_CURTO
   ```
   Esse endereço leva a chave secreta. Não salve, não compartilhe e não deixe no histórico de um computador compartilhado.
4. Com o token longo, consulte no Explorer `me/accounts`. A resposta traz o `id` da Página e o `access_token` **da Página**. Um token de Página tirado de um token longo **não expira**, a menos que você troque a senha, perca a função de administrador ou remova o app.
5. Consulte `ID_DA_PAGINA?fields=instagram_business_account`. O `id` que voltar é o **ID do Instagram**.
6. Na raiz do projeto, crie o arquivo `.env` (o `.gitignore` já impede que ele vá para o git):
   ```
   META_PAGE_ID=1234567890
   META_IG_ID=17841400000000000
   META_PAGE_TOKEN=EAAG...
   ```

> O token da Página **publica em nome da Fatec**. Trate-o como uma senha: não mande por WhatsApp, não cole em post e não faça commit. Se vazar, remova o app em *Configurações → Integrações comerciais* do Facebook e gere outro.

### C3. Instalar as dependências (uma vez)

```powershell
.\.venv\Scripts\python.exe -m pip install requests pillow
```

### C4. Montar o plano

O plano é o mesmo `kits/<nome>.json` do kit. Cada post tem `data`, `hora` (horário de Brasília), `tipo`, `titulo`, `arquivos` e `legenda`. Há um campo opcional, `redes`, para postar em uma rede só:

```json
{
  "data": "2026-12-09",
  "hora": "18:00",
  "tipo": "feed",
  "titulo": "Prova em 13 de dezembro",
  "arquivos": ["output/post-dezembro/post-vestibular-dezembro/000000.png"],
  "legenda": "Domingo, 13/12, às 13h é dia de prova do Vestibular Fatec! ...",
  "redes": ["instagram", "facebook"]
}
```

Antes de agendar, **confira o calendário oficial** (vestibular.fatec.sp.gov.br/calendario). Não agende "Inscrições abertas" fora do período. Confira também se todos os arquivos já foram renderizados.

### C5. Testar sem publicar

```powershell
.\.venv\Scripts\python.exe tools\postar.py kits\<nome>.json --teste
```

O teste lista o que está **agendado**, o que **publicaria** agora e o que seria **pulado** (vídeo, arquivo faltando, legenda longa, post atrasado). Ele não usa o token nem publica nada.

Para um teste de verdade, crie um plano com **um post só**, com a hora de agora e `"redes": ["facebook"]`. Rode o script sem `--teste`, confira na Página e apague o post depois.

### C6. Deixar rodando sozinho (Agendador de Tarefas do Windows)

No PowerShell, na pasta do projeto, troque `<nome>` e rode:

```powershell
$acao = New-ScheduledTaskAction -Execute "$PWD\.venv\Scripts\python.exe" -Argument "tools\postar.py kits\<nome>.json" -WorkingDirectory "$PWD"
$gatilho = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 15)
Register-ScheduledTask -TaskName "Fatec - postar <nome>" -Action $acao -Trigger $gatilho
```

- O **computador precisa estar ligado e com internet** na hora do post. Se não puder garantir isso, use a opção A, que publica pelos servidores da Meta.
- Acompanhe pelo `output/publicar/<nome>/postar.log`.
- Quando o kit terminar, apague a tarefa:
  ```powershell
  Unregister-ScheduledTask -TaskName "Fatec - postar <nome>" -Confirm:$false
  ```

### C7. Limites e erros comuns

| Mensagem ou situação | O que fazer |
|---|---|
| `(#10) ... permission` / `(#200)` | Falta permissão no token: refaça o passo C2 marcando todas |
| `Error validating access token` | O token expirou ou foi revogado: refaça o passo C2 |
| `Only photo or video can be accepted as media type` | O Instagram não conseguiu baixar a imagem. Rode de novo; se persistir, confira se a imagem é JPEG/PNG válido |
| `aspect ratio` | A imagem está fora de 4:5 a 1,91:1 (por exemplo 9:16 no feed). Story e Reels não passam por este script |
| Carrossel cortado | O Instagram corta todos os itens na proporção do **primeiro**. Use o mesmo tamanho em todos |
| Limite diário | A Meta permite cerca de 100 posts por API a cada 24 h por conta (carrossel conta como 1). Para conferir: `ID_DO_INSTAGRAM/content_publishing_limit` |
| Post saiu só no Facebook | O erro do Instagram aparece no log. Na próxima execução (até 3 h depois do horário) o script tenta **só o Instagram** de novo |

## Antes de publicar (vale para A, B e C)

- **Gente na imagem**: todo post precisa ter pelo menos uma pessoa em destaque.
- **Modelo de banco de imagem não é aluno**: nunca chame a pessoa da foto de "nossa aluna".
- **Datas e chamada**: confira o calendário oficial e o `CTA` em `src/theme.tsx`.
- **Link do vestibular**: vestibular.fatec.sp.gov.br.
- **Música**: no Reels, use a trilha original do projeto e evite faixas com Content ID.
