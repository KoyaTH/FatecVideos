# Roteiro de demonstração

Prompts prontos para apresentar o projeto e gerar um exemplo ao vivo com o Claude Code.

## Antes de apresentar (5 minutos)

- [ ] Abrir o Claude Code na pasta `D:\kauan\FatecVideos`. Ele lê o `CLAUDE.md` sozinho.
- [ ] Deixar o editor rodando num terminal (`npm start`) e aberto em `http://localhost:9000/`.
- [ ] Confirmar que tem internet: a narração usa as vozes neurais da Microsoft.
- [ ] Ter abertos, para mostrar se der problema, uns exemplos prontos: `output/publicar/exemplo-posts/` e `output/publicar/exemplo-reels/`.
- [ ] Tempos aproximados:
  - posts: menos de 1 minuto;
  - Reels: 2 a 3 minutos, entre narração, música e render.

## Prompt principal (posts, rápido)

Copie e cole:

```
Vou apresentar este projeto agora, então explique em 2 ou 3 frases o que está fazendo em cada etapa.

Gere 3 posts para o Instagram da Fatec Taquaritinga sobre a prova do Vestibular Fatec, usando o gerador automático do projeto:

1. Antes, confira no calendário oficial (vestibular.fatec.sp.gov.br/calendario) a data da prova e use só informações oficiais.
2. Escreva o pedido em pedidos/demo-ao-vivo.json, só com o conteúdo: um post com a data da prova em destaque, um checklist do que levar e um com os horários dos portões. Inclua legenda com hashtags em cada um.
3. Rode tools/gerar.py e mostre qual estilo, paleta e fundo foram escolhidos para cada post, e por quê não repetem.
4. Renderize o projeto gerador-posts e confira as imagens: texto cortado, sobreposição, pessoa visível e logo oficial.
5. Monte o kit com tools/kit.py e me mostre os 3 posts lado a lado.

Não publique nada em rede social.
```

## Prompt do Reels (se der tempo)

```
Agora transforme o mesmo conteúdo num Reels vertical de uns 20 segundos com narração em português e música original:
3 slides (data da prova, horários dos portões, o que levar), uma frase de narração curta por slide.
Use o gerador (pedido tipo "reels"), renderize o gerador-reels e me mostre 3 quadros do vídeo e a duração final.
```

## Prompt de variação (mostra que não fica tudo igual)

```
Gere de novo os mesmos 3 posts com o mesmo texto e me mostre lado a lado com os anteriores,
para ver que o gerador escolhe estilos, paletas e fundos diferentes, sem repetir os últimos usados.
```

## Prompt curto (plano B, 1 frase)

```
Usando o gerador do projeto, faz 1 post sobre a prova do Vestibular Fatec com a data em destaque, renderiza e me mostra.
```

## O que destacar na apresentação

- **Conteúdo → arte automática:** você descreve só o texto; o visual (6 estilos, 4 paletas, 4 fundos, 4 animações) é escolhido sem repetir os últimos.
- **Nada estoura:** o texto mede a si mesmo e se ajusta; a foto é enquadrada pelo rosto.
- **Identidade preservada:** logo oficial, cores da Fatec e sempre uma pessoa em destaque.
- **Áudio próprio:** narração neural pt-BR e trilha original, sem problema de direitos autorais.
- **Pronto para postar:** kit com arquivos na ordem, legendas e lembretes no calendário.
- **Responsável:** só fotos de bancos com licença comercial, dados conferidos no site oficial, e nada é publicado sem você.

> Fale do limite com honestidade: hoje o projeto tem só uma foto cadastrada, então todos os posts usam a mesma imagem. Mais fotos em `src/gen/fotos.ts` = mais variedade.
