# Viana I — Suspensão temporária (GitHub/Vercel)

## Ficheiros
- index.html — entrada do site
- employee.html — perfis abertos pelos QR Codes
- suspenso.html — página pública de indisponibilidade
- site-status.js — controlo central

## Suspender
Em `site-status.js`:
```js
window.SITE_ATIVO = false;
```

## Reactivar
Alterar para:
```js
window.SITE_ATIVO = true;
```
Depois fazer commit/push no GitHub. O Vercel fará novo deploy.

## QR Codes
Não é necessário gerar novos QR Codes. Os links existentes para `employee.html?id=...` continuam válidos e são redireccionados para `suspenso.html` enquanto o site estiver suspenso.

## GitHub/Vercel
Coloque estes ficheiros na raiz do repositório, mantendo exactamente os nomes e capitalização.

Nota: este mecanismo é uma suspensão no lado do cliente. Não é controlo de acesso de servidor; ficheiros estáticos conhecidos continuam tecnicamente acessíveis por URL directa.
