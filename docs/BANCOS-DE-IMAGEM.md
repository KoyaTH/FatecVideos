# Bancos de imagem e a regra do humano

Guia para escolher fotos para os posts, vídeos e animações (Motion Canvas) da Fatec Taquaritinga.

**Aqui só entram bancos gratuitos cujas licenças permitem uso comercial** (divulgação da Fatec), sem pagar e sem dar crédito. As fotos continuam tendo dono; o que esses sites dão é uma licença de uso livre, com algumas regras.

## Regra: sempre tem um ser humano

**Todo post, vídeo e animação leva pelo menos uma pessoa em destaque.** Gente estudando, usando notebook, trabalhando em laboratório ou na indústria. Ilustração, ícone e gráfico entram como complemento, nunca no lugar da pessoa.

Ordem de preferência:

1. **Fotos reais de alunos e professores da Fatec**, com autorização de uso de imagem.
2. **Os bancos gratuitos abaixo:** Pexels, Unsplash (sem Unsplash+) e Pixabay.

## Bancos liberados para uso comercial

| Banco | Custo | Crédito | Uso comercial | Atenção |
|---|---|---|---|---|
| [Pexels](https://www.pexels.com/pt-br/) | Grátis | Não precisa | ✅ Sim | Fotos **e vídeos** |
| [Unsplash](https://unsplash.com/pt-br) | Grátis | Não precisa | ✅ Sim | Só as gratuitas: **Unsplash+ não** |
| [Pixabay](https://pixabay.com/pt/) | Grátis | Não precisa | ✅ Sim | Fotos e vídeos ok; **músicas** podem ter Content ID |

### Pexels: pexels.com/pt-br

[Licença oficial](https://www.pexels.com/pt-br/licenca/): fotos e vídeos gratuitos, que podem ser modificados, sem crédito obrigatório. Tem vídeos ótimos para fundo de Reels.

### Unsplash: unsplash.com/pt-br

Licença Unsplash: uso comercial e pessoal liberado, sem pedir permissão e sem crédito obrigatório.

**Cuidado:** fotos com selo **Unsplash+** são de assinatura paga, com outra licença. Na busca, use o filtro de licença "Gratuita" (`?license=free` na URL).

### Pixabay: pixabay.com/pt

Licença de Conteúdo do Pixabay: uso comercial liberado, sem crédito.

**Músicas:** várias estão registradas no **Content ID** e podem gerar reivindicação ou deixar o vídeo sem som no Instagram/YouTube. Antes de usar, procure na página da faixa o aviso "ID de conteúdo registado". A trilha padrão dos vídeos é a original do projeto, em `tools/musica.py`.

## O que as licenças proíbem (vale para os três)

- **Dar a entender que as pessoas da foto endossam a Fatec.** Nunca apresente o modelo como aluno ("nossa aluna Ana").
- Mostrar a pessoa de forma ofensiva ou constrangedora.
- Vender a foto sem alteração (pôster, caneca, produto).
- Usar a foto como logotipo ou marca registrada.
- Redistribuir as fotos em outro banco de imagens.

## Riscos que a licença não cobre

- **Marcas na foto:** um logo de empresa em destaque (como a maçã de um MacBook) pode dar problema em anúncio. Prefira fotos sem marcas visíveis.
- **Upload indevido:** às vezes alguém sobe uma foto que não é dele. Prefira fotos populares, de fotógrafos com várias publicações, e guarde o ID para achar a origem.

## Termos de busca que funcionam

| Curso / tema | Buscar por |
|---|---|
| Sistemas para Internet | `estudantes notebook`, `programador`, `desenvolvedor`, `students laptop`, `coding` |
| Gestão da Produção Industrial | `engenheira fábrica`, `indústria trabalhador`, `factory worker tablet`, `industrial engineer` |
| Vestibular / geral | `estudantes universitários`, `campus`, `formatura`, `college students` |

Buscar em inglês costuma trazer mais resultados.

## Fotos no projeto

| Arquivo em `src/images/` | Banco | Onde aparece |
|---|---|---|
| `pexels-6683579-sala-prova.jpg` | [Pexels #6683579](https://www.pexels.com/photo/6683579/) | gerador (chave `sala` em `src/gen/fotos.ts`) e post fixo `post-dezembro` |

Quando adicionar uma foto, inclua uma linha nesta tabela.

## Como usar no projeto

1. Baixe a foto e salve em `src/images/` com o banco e o ID no nome. Exemplo: `pexels-3184465-laboratorio.jpg`, `unsplash-abc123-turma.jpg`.
2. Cadastre a foto em `src/gen/fotos.ts`, com largura, altura, **ponto de foco** (onde está o rosto, de 0 a 1), **temas** e **crédito**. O passo a passo com exemplo de código está no [guia, seção 6](GUIA-POSTS-E-VIDEOS.md#6-adicionar-uma-foto).
3. O gerador passa a usar a foto sozinho, sempre que os `temas` do pedido combinarem. O enquadramento é automático pelo ponto de foco.
4. Adicione a foto à tabela acima.

O Claude não contorna bloqueio contra robôs nos sites. Quando o download automático não funcionar, baixe pelo navegador e salve o arquivo em `src/images/`.
