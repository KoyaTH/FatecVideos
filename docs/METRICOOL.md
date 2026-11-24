# Postar e agendar com Metricool + Google Drive

Como publicar os posts e vídeos do projeto no Instagram (e no Facebook) pelo **Metricool**, com as mídias no **Google Drive**, sem precisar de GitHub. O projeto não traz nenhuma conta: **cada pessoa conecta a sua**.

```
projeto ──► kit (PNG/MP4 + legendas) ──► Google Drive ──► Metricool ──► Instagram / Facebook
                tools/kit.py           tools/metricool.py   (Claude)     publica no horário
```

## O que você precisa

| Item | Para quê | Custo |
|---|---|---|
| Conta no [Metricool](https://metricool.com) | agendar e publicar | grátis até **20 posts agendados por mês** |
| Instagram conectado no Metricool | rede de destino | — |
| Página do Facebook conectada no Metricool *(opcional)* | postar no Facebook (perfil pessoal não funciona) | — |
| Conta Google com Google Drive | guardar as mídias | grátis (15 GB) |
| Conectores **Metricool** e **Google Drive** no Claude | o Claude agendar e achar os arquivos | — |
| [Google Drive para computador](https://www.google.com/drive/download/) *(recomendado)* | o script já salva as mídias direto no Drive | grátis |

> Use **a mesma conta Google** no conector do Google Drive e no Google Drive para computador. Se forem contas diferentes, o arquivo vai para um Drive e o Claude procura em outro.

> **Por que o Google Drive para computador:** o conector do Google Drive serve para o Claude **achar** os arquivos e pegar o link, mas ele não consegue enviar imagens e vídeos grandes. O conector recebe o arquivo como texto dentro da própria chamada, e um PNG de 1 MB ou um MP4 não cabem ali. Com o Drive para computador, o script só copia os arquivos para a pasta `Meu Drive` e o Google sobe tudo sozinho, sem navegador.

## Configurar (uma vez)

1. **Metricool:** crie a conta, crie uma marca e conecte o **Instagram** (e, se quiser, uma **Página do Facebook**).
2. **Claude:** em claude.ai → **Configurações → Conectores**, conecte **Metricool** e **Google Drive**. Depois abra uma **sessão nova** do Claude Code na pasta do projeto.
3. **Computador:** instale o **Google Drive para computador** e entre com a mesma conta Google. Ele cria a pasta `Meu Drive` no seu PC.
4. **Conferir:** peça ao Claude *"confere minha conta do Metricool"*. Ele mostra a marca e as redes conectadas.

## Publicar um kit

1. **Gerar e montar o kit**, conforme o [guia](GUIA-POSTS-E-VIDEOS.md), seções 7 e 8:
   ```powershell
   .\.venv\Scripts\python.exe tools\gerar.py pedidos\<nome>.json
   ```
   Depois clique em **RENDER** no editor e rode:
   ```powershell
   .\.venv\Scripts\python.exe tools\kit.py kits\<nome>.json
   ```
2. **Mandar as mídias para o Drive:**
   ```powershell
   .\.venv\Scripts\python.exe tools\metricool.py kits\<nome>.json
   ```
   - Os arquivos vão para `Meu Drive/FatecVideos/<nome>/`, com nomes únicos (`<nome>-01.png`…).
   - O script também cria `kits/<nome>.metricool.json` com a data, a legenda, o tipo e a rede de cada post.
   - Opções:
     - `instagram,facebook` depois do nome do kit, para postar nas duas redes;
     - `--pasta="G:\Meu Drive"` quando o Drive estiver em outro lugar.
   - Sem o Google Drive para computador, os arquivos ficam em `output/publicar/<nome>/drive/`. Suba essa pasta pelo drive.google.com (**Novo → Upload de pasta**).
3. **Compartilhar por link:** no Drive, clique com o botão direito na pasta `FatecVideos/<nome>` e escolha **Compartilhar → Acesso geral → Qualquer pessoa com o link (Leitor)**. Os arquivos de dentro herdam o acesso.
   > O Metricool **só consegue baixar arquivos compartilhados como "Qualquer pessoa com o link"**. O arquivo não aparece em buscas, mas quem tiver o link consegue abrir. Depois de publicar, você pode voltar o acesso para "Restrito" ou apagar a pasta, porque o Metricool guarda a própria cópia.
4. **Agendar:** peça ao Claude *"agenda o kit `<nome>` no Metricool"*.
   - Ele acha cada arquivo no seu Drive.
   - Mostra **imagem, legenda, rede e horário de cada post** e **só agenda depois do seu OK**.
   - Passado o horário, confere se publicou.

## Testar sem publicar

Peça: *"manda o post X para o Metricool como rascunho"*. O post fica salvo no **Planejamento** do Metricool como rascunho, sem data de publicação ativa. Assim dá para conferir imagem e legenda lá antes de agendar de verdade.

## Problemas comuns

| Mensagem | Causa e solução |
|---|---|
| `Metricool can't access the Google Drive file … 'Anyone with the link'` | O arquivo ou a pasta não está compartilhado por link. Faça o passo 3 |
| `This brand doesn't have any social network connected yet` | Conecte o Instagram (ou a Página) no Metricool |
| O Claude não acha o arquivo no Drive | O conector do Google Drive está em outra conta Google, ou o Drive ainda não sincronizou. Espere um pouco e confira a conta |
| `The date can't be in the past` | O horário já passou. Escolha outro |
| Post agendado, mas não publicou | Veja o status no Planejamento do Metricool. A conta do Instagram pode precisar ser reconectada |

## Alternativas

- **Modo GitHub:** `tools/metricool.py kits\<nome>.json --github` copia as mídias para `publicar/` de um repositório **público** seu e usa os links `raw.githubusercontent.com`. Depois rode `git push`.
- **Sem Metricool:** o kit (`output/publicar/<nome>/`) traz `LEGENDAS.txt` e `agenda.ics` com lembretes para você postar pelo app.
- **API oficial da Meta** (conta profissional + Página): [POSTAGEM-AUTOMATICA.md](POSTAGEM-AUTOMATICA.md).
