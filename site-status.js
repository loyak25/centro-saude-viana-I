/* =========================================================
   VIANA I — CONTROLO CENTRAL DO WEBSITE
   true  = website activo
   false = website temporariamente indisponível
   ========================================================= */

window.SITE_ATIVO = false;

(function () {
  "use strict";

  // Página que deve permanecer acessível mesmo quando o site está suspenso.
  var paginaSuspensao = "suspenso.html";
  var paginaAtual = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  if (!window.SITE_ATIVO && paginaAtual !== paginaSuspensao) {
    var destino = new URL(paginaSuspensao, window.location.href);
    // Não precisamos preservar o id do funcionário: a intenção é mostrar
    // exactamente a mesma mensagem de indisponibilidade em qualquer QR Code.
    window.location.replace(destino.href);
  }
})();
