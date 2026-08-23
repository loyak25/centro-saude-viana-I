from pathlib import Path
import json, re, os, shutil
from PIL import Image, ImageDraw, ImageFont

root=Path('/mnt/data/edit')

# team data
p=root/'team-data.js'
s=p.read_text(encoding='utf-8')
start=s.index('['); end=s.index('\n];',start)+2
data=json.loads(s[start:end])

def first_name(name):
    return name.split()[0] if name else 'Viana'

def safe(s):
    import unicodedata
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode('ascii')
    return re.sub(r'[^A-Za-z0-9_-]+','_',s).strip('_') or 'Viana'

# Create a stable image path for every member. Real photos can replace these files directly.
photo_dir=root/'assets'/'equipa'
photo_dir.mkdir(parents=True, exist_ok=True)
try:
    font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 48)
    small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
except:
    font=None; small=None
for m in data:
    fn=first_name(m['name'])
    filename=f"{m['id']}_{safe(fn)}.jpg"
    path=photo_dir/filename
    # Keep existing real photos for current known portraits, but also create the standardized replacement file.
    if not path.exists():
        img=Image.new('RGB',(900,1100),(232,239,236))
        d=ImageDraw.Draw(img)
        # subtle initials circle
        initials=''.join([x[0] for x in m['name'].split()[:2]]).upper()
        d.ellipse((310,245,590,525),fill=(214,225,221),outline=(150,176,169),width=3)
        if font:
            bbox=d.textbbox((0,0),initials,font=font); tw=bbox[2]-bbox[0]; th=bbox[3]-bbox[1]
            d.text(((900-tw)/2,(525+245-th)/2-5),initials,font=font,fill=(45,76,70))
            bbox=d.textbbox((0,0),fn,font=font); tw=bbox[2]-bbox[0]
            d.text(((900-tw)/2,650),fn,font=font,fill=(24,44,43))
            d.text((300,735),'Fotografia a substituir',font=small,fill=(90,111,106))
        img.save(path,quality=90)
    # Every profile points to the stable standardized path, so replacing the JPG updates immediately.
    m['photo']=f'assets/equipa/{filename}'

newdata='window.teamMembers = '+json.dumps(data,ensure_ascii=False,indent=2)+';'
rest=s[end:]
p.write_text(newdata+rest,encoding='utf-8')

# index updates
p=root/'index.html'; s=p.read_text(encoding='utf-8')
s=s.replace('<div class="form-row"><label>Tipo de mensagem<select name="tipo" required><option value="">Selecione</option><option>Sugestão</option><option>Reclamação</option></select></label><label>Nome <span class="required-mark">*</span><input name="nome" required minlength="2" autocomplete="given-name" placeholder="Primeiro nome"></label></div>\n          <div class="form-row"><label>Apelido / sobrenome <span class="required-mark">*</span><input name="apelido" required minlength="2" autocomplete="family-name" placeholder="Nome e apelido"></label><label>E-mail <span class="required-mark">*</span><input name="email" type="email" required autocomplete="email" placeholder="exemplo@email.com"></label></div>\n          <label>Número de telefone <span class="required-mark">*</span><input name="telefone" type="tel" required inputmode="tel" pattern="[0-9+()\\s-]{9,20}" autocomplete="tel" placeholder="Ex.: +244 9XX XXX XXX"></label>', '''<div class="feedback-form-heading"><span>Formulário de contacto</span><small>Todos os campos marcados com * são obrigatórios.</small></div>
          <label>Tipo de mensagem <span class="required-mark">*</span><select name="tipo" required><option value="">Escolha entre sugestão ou reclamação</option><option>Sugestão</option><option>Reclamação</option></select></label>
          <div class="identity-grid">
            <label>Primeiro nome <span class="required-mark">*</span><input name="nome" required minlength="2" autocomplete="given-name" placeholder="Ex.: João"></label>
            <label>Apelido / sobrenome <span class="required-mark">*</span><input name="apelido" required minlength="2" autocomplete="family-name" placeholder="Ex.: Silva"></label>
          </div>
          <div class="identity-grid">
            <label>E-mail <span class="required-mark">*</span><input name="email" type="email" required autocomplete="email" placeholder="exemplo@email.com"></label>
            <label>Número de telefone <span class="required-mark">*</span><input name="telefone" type="tel" required inputmode="tel" pattern="[0-9+()\\s-]{9,20}" autocomplete="tel" placeholder="Ex.: +244 9XX XXX XXX"></label>
          </div>''')
s=s.replace('<input type="hidden" name="_template" value="table">','<input type="hidden" name="_template" value="table">\n          <input type="hidden" name="_captcha" value="false">\n          <input type="hidden" name="_url" value="https://centro-saude-viana-i.vercel.app/">')
s=s.replace('<div class="section-label reveal">06 — Contactos</div>','<div class="section-label reveal">07 — Contactos</div>')
s=s.replace('© <span id="year"></span> Viana I. Todos os direitos reservados.','© <span id="year"></span> Viana I. Todos os direitos reservados a <strong>Kutxi Tec</strong>.')
p.write_text(s,encoding='utf-8')

# JS: 24/page => 7 pages for 150; JSON AJAX + better error/fallback
p=root/'script.js'; s=p.read_text(encoding='utf-8')
s=s.replace('const pageSize=12;','const pageSize=24;')
start=s.index("feedbackForm?.addEventListener('submit',async e=>{")
# replace to end of listener
new_listener="""feedbackForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!feedbackForm.reportValidity()) return;
  const submitButton=feedbackForm.querySelector('button[type="submit"]');
  const originalLabel=submitButton.innerHTML;
  const data=Object.fromEntries(new FormData(feedbackForm).entries());
  submitButton.disabled=true;
  submitButton.innerHTML='A enviar…';
  feedbackSuccess.classList.remove('show');
  try{
    const response=await fetch('https://formsubmit.co/ajax/scuallyboy@gmail.com',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(data)
    });
    const result=await response.json().catch(()=>({success:response.ok}));
    if(!response.ok || result.success===false) throw new Error(result.message||'Falha no envio');
    feedbackSuccess.textContent='Mensagem enviada com sucesso. Obrigado pela sua participação.';
    feedbackSuccess.className='feedback-success show success';
    feedbackForm.reset();
    document.querySelectorAll('[data-feedback-type]').forEach(b=>b.classList.remove('selected'));
  }catch(error){
    feedbackSuccess.innerHTML='Não foi possível concluir o envio automático. Se for a primeira utilização deste formulário, confirme primeiro o e-mail de ativação enviado pelo FormSubmit. <a href="mailto:scuallyboy@gmail.com">Enviar directamente por e-mail →</a>';
    feedbackSuccess.className='feedback-success show error';
  }finally{
    submitButton.disabled=false;
    submitButton.innerHTML=originalLabel;
  }
});
"""
s=s[:start]+new_listener
p.write_text(s,encoding='utf-8')

# CSS append/override for feedback UX and placeholders
p=root/'style.css'; s=p.read_text(encoding='utf-8')
s += '''\n\n/* UX/UI — Participação do utente */\n.feedback-form{border-radius:2px;box-shadow:0 18px 50px rgba(9,34,34,.06);padding:38px}.feedback-form-heading{display:flex;justify-content:space-between;align-items:baseline;gap:20px;margin:0 0 24px;padding-bottom:18px;border-bottom:1px solid var(--line)}.feedback-form-heading span{font-family:Manrope;font-size:15px;font-weight:800;letter-spacing:-.01em}.feedback-form-heading small{font-size:10px;color:var(--muted);line-height:1.5}.identity-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.feedback-types button{border-radius:2px}.feedback-types button.selected{background:#fff;border-color:var(--accent);box-shadow:0 8px 24px rgba(12,119,113,.08)}.feedback-success{border-left:3px solid var(--accent);background:#edf7f4}.feedback-success.error{border-left-color:#b56a55;background:#fff3ef;color:#754337}.feedback-success.success{border-left-color:#2f8c70}.feedback-success a{color:inherit;font-weight:800;text-decoration:underline}.feedback-form select{appearance:none;background-image:linear-gradient(45deg,transparent 50%,#71817d 50%),linear-gradient(135deg,#71817d 50%,transparent 50%);background-position:calc(100% - 18px) 52%,calc(100% - 13px) 52%;background-size:5px 5px,5px 5px;background-repeat:no-repeat;padding-right:38px}.feedback-form label{min-width:0}.feedback-form input,.feedback-form select,.feedback-form textarea{box-sizing:border-box;border-radius:2px}.feedback-email{border-radius:2px}.team-results-meta{display:flex;align-items:center;justify-content:space-between}.team-pagination .page-status{order:10}.team-person-card .portrait img{object-fit:cover}.team-person-card .portrait-placeholder{height:100%}@media(max-width:700px){.feedback-form{padding:28px 22px}.feedback-form-heading{display:block}.feedback-form-heading small{display:block;margin-top:6px}.identity-grid{grid-template-columns:1fr;gap:0}.feedback-grid{gap:28px}}\n'''
p.write_text(s,encoding='utf-8')

# README note
p=root/'README.md'; s=p.read_text(encoding='utf-8') if p.exists() else ''
s += '''\n\n## Fotografias da equipa\nA pasta `assets/equipa/` contém um ficheiro JPG por funcionário, nomeado por ID + primeiro nome (ex.: `035_Edmilson.jpg`). A imagem contém apenas o primeiro nome e serve como placeholder. Para substituir por uma fotografia real, mantenha exactamente o mesmo nome do ficheiro e substitua o JPG; o perfil passa a mostrar a nova fotografia automaticamente.\n\n## Paginação\nA directoria usa 24 profissionais por página, totalizando 7 páginas para os 150 profissionais actuais.\n\n## Sugestões e reclamações\nO formulário envia via FormSubmit para `scuallyboy@gmail.com` sem exigir login. A primeira utilização do endereço pode exigir a confirmação do e-mail de ativação do FormSubmit.\n'''
p.write_text(s,encoding='utf-8')
