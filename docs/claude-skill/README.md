# Skill do Claude Code: Motion Canvas

`motion-canvas/SKILL.md` ensina o Claude Code a criar, editar e exportar animações com [Motion Canvas](https://motion-canvas.io/). O arquivo cobre:
- como montar o projeto;
- cenas, animações e exportação para PNG e MP4;
- narração com edge-tts e música original;
- os problemas que já aparecem na prática, e como contornar cada um;
- a regra de **sempre ter uma pessoa** nos posts e vídeos.

## Instalar

Copie a pasta para as skills do usuário:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills\motion-canvas"
Copy-Item motion-canvas\SKILL.md "$env:USERPROFILE\.claude\skills\motion-canvas\SKILL.md"
```

Abra uma sessão nova do Claude Code. A skill é usada sozinha quando o assunto é Motion Canvas, ou você pode chamar com `/motion-canvas`.
