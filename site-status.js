/* KUTXI TEC / VIANA I — CONTROLO CENTRAL
   true = activo | false = suspenso */

window.SITE_false = true;

(function () {
  if (window.SITE_ATIVO !== false) return;

  function suspend() {
    document.title = "Website temporariamente indisponível — Viana I";

    const s = document.createElement("style");

    s.textContent = `
      html, body {
        margin: 0 !important;
        min-height: 100%;
        background: #111 !important;
      }

      #site-suspenso {
        min-height: 100vh;
        min-height: 100svh;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px 22px;
        background:
          radial-gradient(
            circle at 50% 35%,
            rgba(255,255,255,.07),
            transparent 38%
          ),
          #111;
        color: #fff;
        font-family: "DM Sans", Arial, sans-serif;
        text-align: center;
      }

      #site-suspenso .inner {
        width: min(620px, 100%);
      }

      #site-suspenso .marca {
        width: 58px;
        height: 58px;
        border: 1px solid rgba(255,255,255,.24);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 30px;
        border-radius: 50%;
        font-family: "Manrope", Arial, sans-serif;
        font-weight: 800;
      }

      #site-suspenso .linha {
        width: 42px;
        height: 1px;
        background: rgba(255,255,255,.45);
        margin: 0 auto 26px;
      }

      #site-suspenso .rotulo {
        margin: 0 0 14px;
        font-size: 11px;
        letter-spacing: .18em;
        text-transform: uppercase;
        color: rgba(255,255,255,.55);
      }

      #site-suspenso h1 {
        margin: 0 0 18px;
        font-family: "Manrope", Arial, sans-serif;
        font-size: clamp(32px, 6vw, 58px);
        line-height: 1.04;
        letter-spacing: -.045em;
      }

      #site-suspenso p {
        margin: 0 auto;
        max-width: 500px;
        font-size: 16px;
        line-height: 1.7;
        color: rgba(255,255,255,.68);
      }

      #site-suspenso .assinatura {
        margin-top: 34px;
        font-weight: 700;
        font-size: 13px;
        letter-spacing: .04em;
      }

      #site-suspenso .assinatura small {
        display: block;
        margin-top: 7px;
        font-weight: 400;
        color: rgba(255,255,255,.42);
        letter-spacing: .08em;
      }
    `;

    document.head.appendChild(s);

    document.body.innerHTML = `
      <main id="site-suspenso">
        <div class="inner">

          <div class="marca">KT</div>

          <div class="linha"></div>

          <p class="rotulo">
            Viana I — Saúde &amp; Cuidado
          </p>

          <h1>
            Website temporariamente indisponível
          </h1>

          <p>
            Estamos a concluir os últimos procedimentos necessários
            para disponibilizar novamente esta plataforma.
          </p>

          <div class="assinatura">
            KUTXI TEC

            <small>
              TECNOLOGIA • DESIGN &amp; SOLUÇÕES DIGITAIS
            </small>
          </div>

        </div>
      </main>
    `;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", suspend);
  } else {
    suspend();
  }
})();