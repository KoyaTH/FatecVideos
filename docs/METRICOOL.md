# Postar e agendar com Metricool + Google Drive

Como publicar os posts e vídeos do projeto no Instagram (e no Facebook) pelo **Metricool**, com as imagens e vídeos no **Google Drive**, sem GitHub e sem navegador. O projeto não traz nenhuma conta: **cada pessoa conecta a sua**.

```
projeto ──► kit (PNG/MP4 + legendas) ──► Drive: ClaudeMetricool/<kit>/ ──► Metricool ──► Instagram / Facebook
              tools/kit.py                 tools/metricool.py              (Claude)     publica no horário
```

## O que você precisa

| Item | Para quê | Custo |
|---|---|---|
| Conta no [Metricool](https://metricool.com) | agendar e publicar | grátis até **20 posts agendados por mês** |
| Instagram conectado no Metricool | rede de destino | — |
| Página do Facebook conectada no Metricool *(opcional)* | postar no Facebook (perfil pessoal não funciona) | — |
| Conta Google com Google Drive | guardar as mídias | grátis (15 GB) |
| Conectores **Metricool** e **Google Drive** no Claude | o Claude agendar e achar os arquivos | — |
| [Google Drive para computador](https://www.google.com/drive/download/) | o script copia as mídias para o Drive sem navegador | grátis |

> Use **a mesma conta Google** em tudo: no conector do Google Drive, no Google Drive para computador e, se o Metricool pedir, no Metricool. Com contas diferentes, o arquivo vai para um Drive e o Claude procura em outro.

> **Por que o Google Drive para computador:** o conector do Google Drive serve para o Claude **achar** os arquivos e pegar o link, mas não consegue **enviar** imagens e vídeos grandes. O conector recebe o arquivo como texto dentro da própria chamada, e um PNG de 1 MB ou um MP4 não cabem ali. Com o Drive para computador, o script só copia os arquivos para a pasta do Drive no seu PC e o Google sobe tudo sozinho.

## Passo a passo: configurar (uma vez)

### 1. Metricool
1. Crie uma conta grátis em [metricool.com](https://metricool.com).
2. Crie uma **marca** (por exemplo "Fatec Taquaritinga").
3. Em **Conexões** da marca, conecte o **Instagram**. Para postar no Facebook também, conecte uma **Página do Facebook**.

### 2. Google Drive
1. Entre no [drive.google.com](https://drive.google.com) com a conta Google que você vai usar.
2. Em **Meu Drive**, crie uma pasta chamada **`ClaudeMetricool`**. O nome precisa ser exatamente esse, porque o script procura por ele.
3. Clique com o botão direito em `ClaudeMetricool` → **Compartilhar → Acesso geral → Qualquer pessoa com o link → Leitor** → **Concluído**.
   > O Metricool **só consegue baixar arquivos compartilhados como "Qualquer pessoa com o link"**. Testado: arquivo privado é recusado. Tudo o que entrar nessa pasta herda o compartilhamento. Os arquivos não aparecem em buscas, mas quem tiver o link consegue abrir. Não coloque nada pessoal nessa pasta.
4. Instale o **[Google Drive para computador](https://www.google.com/drive/download/)** e entre com **a mesma conta**. Ele cria uma unidade no Windows (por exemplo `G:\Meu Drive`) com a pasta `ClaudeMetricool` sincronizada.

### 3. Claude
1. Em claude.ai → **Configurações → Conectores**, conecte **Metricool** e **Google Drive**, com a mesma conta Google.
2. Abra uma **sessão nova** do Claude Code na pasta do projeto.
3. Peça: *"confere minha conta do Metricool"*. O Claude mostra a marca e as redes conectadas.

## Passo a passo: publicar um kit

1. **Gere e renderize** as peças (veja o [guia](GUIA-POSTS-E-VIDEOS.md), seções 7 e 8):
   ```powershell
   .\.venv\Scripts\python.exe tools\gerar.py pedidos\<nome>.json
   ```
   Clique em **RENDER** no editor (`http://localhost:9000/src/gerador-posts` ou `gerador-reels`).
2. **Monte o kit:**
   ```powershell
   .\.venv\Scripts\python.exe tools\kit.py kits\<nome>.json
   ```
3. **Mande as mídias para o Drive:**
   ```powershell
   .\.venv\Scripts\python.exe tools\metricool.py kits\<nome>.json
   ```
   - Os arquivos vão para `Meu Drive/ClaudeMetricool/<nome>/`, com nomes únicos (`<nome>-01.png`, `<nome>-02.mp4`…).
   - O script cria `kits/<nome>.metricool.json` com a data, a legenda, o tipo (feed, carrossel, Reels ou Stories) e a rede de cada post.
   - Opções:
     - `instagram,facebook` depois do nome do kit, para postar nas duas redes;
     - `--pasta="G:\Meu Drive"` se o Drive não for encontrado sozinho.
   - Sem o Google Drive para computador, os arquivos ficam em `output/publicar/<nome>/drive/`. Suba essa pasta para dentro de `ClaudeMetricool` pelo drive.google.com (**Novo → Upload de pasta**).
4. **Espere o Drive sincronizar.** O ícone do Google Drive na barra do Windows mostra quando terminou.
5. **Peça ao Claude:** *"agenda o kit `<nome>` no Metricool"*.
   - Ele acha cada arquivo no seu Drive.
   - Mostra **imagem, legenda, rede e horário de cada post** e **só agenda depois do seu OK**.
   - Passado o horário, confere se publicou.

Depois de publicado, o Metricool guarda a própria cópia. Você pode apagar a subpasta do kit no Drive.

## Testar sem publicar

Peça: *"manda o post X para o Metricool como rascunho"*. O post fica salvo no **Planejamento** do Metricool como rascunho, sem publicar. Dá para conferir a imagem e a legenda lá antes de agendar de verdade, e depois apagar o rascunho.

## Problemas comuns

| Mensagem ou sintoma | Causa e solução |
|---|---|
| `Metricool can't access the Google Drive file … 'Anyone with the link'` | A pasta `ClaudeMetricool` não está compartilhada por link. Veja a configuração, passo 2.3 |
| `This brand doesn't have any social network connected yet` | Conecte o Instagram (ou a Página) no Metricool |
| O Claude não acha o arquivo no Drive | O conector do Google Drive está em outra conta Google, ou o Drive ainda não sincronizou |
| O script diz "Google Drive para computador não encontrado" | Instale o Drive para computador ou rode com `--pasta="G:\Meu Drive"` |
| `The date can't be in the past` | O horário já passou. Escolha outro |
| Post agendado, mas não publicou | Veja o status no Planejamento do Metricool. A conta do Instagram pode precisar ser reconectada |

## Alternativas

- **Modo GitHub:** `tools/metricool.py kits\<nome>.json --github` copia as mídias para `publicar/` de um repositório **público** seu e usa os links `raw.githubusercontent.com`. Depois rode `git push`.
- **Sem Metricool:** o kit (`output/publicar/<nome>/`) traz `LEGENDAS.txt` e `agenda.ics` com lembretes para você postar pelo app.
- **API oficial da Meta** (conta profissional + Página): [POSTAGEM-AUTOMATICA.md](POSTAGEM-AUTOMATICA.md).
