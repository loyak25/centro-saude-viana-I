# Viana I — Landing Page Institucional

Versão estática, responsiva e sem dependências de build.

## Estrutura
- `index.html` — conteúdo e estrutura.
- `style.css` — identidade visual, responsividade e animações.
- `script.js` — navegação, scroll reveal e perfis em modal.
- `assets/` — imagens fornecidas para a capa e direcção.

## Como abrir
Basta abrir `index.html` num navegador moderno. Para desenvolvimento local, também pode usar qualquer servidor estático, por exemplo VS Code + Live Server.

## Conteúdo dos profissionais
As biografias estão preparadas como conteúdo inicial/editável. Substitua os textos no objecto `people` de `script.js` pelos dados oficiais de cada director.

## Publicação
Pode ser publicado directamente em GitHub Pages, Netlify, Vercel ou num alojamento web tradicional, mantendo estes quatro elementos na mesma estrutura de pastas.


## Actualização da equipa
A versão nova foi preenchida com os 150 nomes identificados nas tabelas fornecidas em imagem. A estrutura mantém a versão antiga como referência visual e preserva as fotografias já existentes.

As fotografias que ainda não estão disponíveis no projecto usam um marcador provisório. Para associar uma fotografia real, basta preencher o campo `photo` correspondente em `team-data.js`.

Os campos profissionais que não estavam suficientemente definidos foram mantidos de forma provisória, sem inventar qualificações ou funções. Devem ser substituídos pelos dados oficiais antes da publicação institucional.


## Actualização final — equipa, formulário e QR Codes

- A equipa foi normalizada para **150 profissionais**, correspondendo à lista fornecida. O registo do Director de Enfermagem foi integrado no ID 035 e apresentado como **Edmilson**, conforme solicitado.
- A paginação agora mostra anterior/seguinte, páginas próximas, reticências e “Página X de Y”.
- O formulário de sugestões/reclamações exige tipo, nome, apelido, e-mail válido, telefone e mensagem. Não existe login para o utente.
- O envio usa FormSubmit em AJAX para **scuallyboy@gmail.com**. O serviço não exige conta ao visitante; na primeira activação do formulário, o proprietário deve confirmar o endereço de e-mail. Depois disso, as mensagens são entregues directamente na caixa de entrada.
- Foi adicionada a pasta `qr-codes/` com 150 QR codes. **Antes de imprimir os passes, substitua `SEU-DOMINIO` pelo domínio real do site e execute `python generate_qr_codes.py`** para gerar os QR codes definitivos.
- Cada QR abre `employee.html?id=XXX`; o perfil do funcionário é o destino permanente enquanto o ID for mantido.


## Fotografias da equipa
A pasta `assets/equipa/` contém um ficheiro JPG por funcionário, nomeado por ID + primeiro nome (ex.: `035_Edmilson.jpg`). A imagem contém apenas o primeiro nome e serve como placeholder. Os três retratos já disponíveis foram mantidos em formato JFIF. Para substituir por uma fotografia real, mantenha exactamente o mesmo nome do ficheiro e substitua o JPG; o perfil passa a mostrar a nova fotografia automaticamente.

## Paginação
A directoria usa 24 profissionais por página, totalizando 7 páginas para os 150 profissionais actuais.

## Sugestões e reclamações
O formulário envia via FormSubmit para `scuallyboy@gmail.com` sem exigir login. A primeira utilização do endereço pode exigir a confirmação do e-mail de ativação do FormSubmit.
