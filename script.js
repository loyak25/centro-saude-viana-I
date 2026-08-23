const header=document.getElementById('header');
const nav=document.querySelector('.nav');
const menu=document.querySelector('.menu-toggle');
const modal=document.getElementById('profileModal');
const modalPhoto=document.getElementById('modalPhoto');
const modalName=document.getElementById('modalName');
const modalRole=document.getElementById('modalRole');
const modalBio=document.getElementById('modalBio');
const modalFunction=document.getElementById('modalFunction');
const modalCategory=document.getElementById('modalCategory');
const modalProfileLink=document.getElementById('modalProfileLink');

function toggleMenu(){const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)}
menu.addEventListener('click',toggleMenu);
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>40),{passive:true});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});
document.querySelectorAll('.reveal,.reveal-group').forEach(el=>observer.observe(el));

const members=(window.teamMembers||[]).filter(p=>p.status==='ready');
const categories=window.teamCategories||[];
const categoryBox=document.getElementById('teamCategories');
const teamGrid=document.getElementById('teamGrid');
const teamTitle=document.getElementById('teamTitle');
const teamDescription=document.getElementById('teamDescription');
const teamCount=document.getElementById('teamCount');
const teamSearch=document.getElementById('teamSearch');
const teamSort=document.getElementById('teamSort');
const teamPagination=document.getElementById('teamPagination');
const teamResultsLabel=document.getElementById('teamResultsLabel');
const teamClear=document.getElementById('teamClear');
let activeCategory='all';
let currentPage=1;
const pageSize=24;

const allCategory={key:'all',label:'Toda a equipa',description:'Consulte todos os profissionais da unidade num único directório.'};
function categoryCount(key){return members.filter(p=>p.category===key).length}
function renderCategories(){
  const list=[allCategory,...categories];
  categoryBox.innerHTML=list.map((cat,i)=>`<button class="team-category ${i===0?'active':''}" type="button" data-category="${cat.key}"><span class="cat-index">${String(i+1).padStart(2,'0')}</span><span><strong>${cat.label}</strong><small>${cat.key==='all'?members.length:categoryCount(cat.key)} ${((cat.key==='all'?members.length:categoryCount(cat.key))===1)?'profissional':'profissionais'}</small></span><b>→</b></button>`).join('');
  categoryBox.querySelectorAll('.team-category').forEach(btn=>btn.addEventListener('click',()=>selectCategory(btn.dataset.category)));
}
function selectCategory(key){
  activeCategory=key; currentPage=1;
  const cat=key==='all'?allCategory:(categories.find(c=>c.key===key)||allCategory);
  categoryBox.querySelectorAll('.team-category').forEach(b=>b.classList.toggle('active',b.dataset.category===key));
  teamTitle.textContent=cat.label;
  teamDescription.textContent=cat.description;
  renderDirectory();
  document.querySelector('.team-directory')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function initials(name){return (name||'V I').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function escapeHTML(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function filteredMembers(){
  const q=(teamSearch.value||'').trim().toLocaleLowerCase('pt');
  let list=members.filter(p=>activeCategory==='all'||p.category===activeCategory);
  if(q) list=list.filter(p=>[p.name,p.role,p.function,p.category].filter(Boolean).join(' ').toLocaleLowerCase('pt').includes(q));
  if(teamSort.value==='name-desc') list.sort((a,b)=>b.name.localeCompare(a.name,'pt'));
  else if(teamSort.value==='category') list.sort((a,b)=>a.category.localeCompare(b.category,'pt')||a.name.localeCompare(b.name,'pt'));
  else list.sort((a,b)=>a.name.localeCompare(b.name,'pt'));
  return list;
}
function renderDirectory(){
  const list=filteredMembers();
  const totalPages=Math.max(1,Math.ceil(list.length/pageSize));
  if(currentPage>totalPages) currentPage=totalPages;
  const start=(currentPage-1)*pageSize;
  const page=list.slice(start,start+pageSize);
  teamCount.textContent=String(list.length).padStart(2,'0');
  teamResultsLabel.textContent=list.length?`A apresentar ${start+1}–${Math.min(start+pageSize,list.length)} de ${list.length} profissionais`:'Nenhum profissional corresponde aos filtros seleccionados.';
  teamGrid.innerHTML=page.length?page.map((p,i)=>{
    const photo=p.photo;
    const portrait=photo?`<img src="${escapeHTML(photo)}" alt="${escapeHTML(p.name)}" loading="lazy">`:`<div class="portrait-placeholder" aria-label="Fotografia de ${escapeHTML(p.name)}"><span>${initials(p.name)}</span><small>Fotografia a disponibilizar</small></div>`;
    return `<article class="director-card team-person-card reveal is-visible" data-person="${escapeHTML(p.id)}"><div class="portrait">${portrait}<div class="portrait-shade"></div><span class="number">${String(start+i+1).padStart(2,'0')}</span><span class="category-chip">${escapeHTML(p.category)}</span></div><div class="director-info"><div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.role||p.category)}</p></div><button class="more-btn" type="button" data-open-profile="${escapeHTML(p.id)}">Ver perfil <span>↗</span></button></div></article>`;
  }).join(''):`<div class="team-empty reveal is-visible"><span>⌕</span><strong>Nenhum profissional encontrado</strong><p>Tente pesquisar por outro nome, função ou categoria, ou limpe os filtros para voltar a consultar toda a equipa.</p></div>`;
  teamGrid.querySelectorAll('[data-open-profile]').forEach(btn=>btn.addEventListener('click',()=>openProfile(btn.dataset.openProfile)));
  renderPagination(totalPages);
}
function renderPagination(totalPages){
  if(totalPages<=1){teamPagination.innerHTML='';return}
  const buttons=[];
  const addPage=(n)=>buttons.push(`<button type="button" class="page-number ${n===currentPage?'active':''}" data-page="${n}" aria-label="Página ${n}" ${n===currentPage?'aria-current="page"':''}>${String(n).padStart(2,'0')}</button>`);
  const addGap=()=>buttons.push('<span class="page-gap" aria-hidden="true">…</span>');
  buttons.push(`<button type="button" class="page-arrow page-prev" data-page="${Math.max(1,currentPage-1)}" aria-label="Página anterior" ${currentPage===1?'disabled':''}>← <span>Anterior</span></button>`);
  if(totalPages<=7){for(let i=1;i<=totalPages;i++) addPage(i);}
  else{
    addPage(1);
    if(currentPage>4) addGap();
    const from=Math.max(2,currentPage-1), to=Math.min(totalPages-1,currentPage+1);
    for(let i=from;i<=to;i++) addPage(i);
    if(currentPage<totalPages-3) addGap();
    addPage(totalPages);
  }
  buttons.push(`<button type="button" class="page-arrow page-next" data-page="${Math.min(totalPages,currentPage+1)}" aria-label="Página seguinte" ${currentPage===totalPages?'disabled':''}><span>Seguinte</span> →</button>`);
  buttons.push(`<span class="page-status">Página <strong>${currentPage}</strong> de <strong>${totalPages}</strong></span>`);
  teamPagination.innerHTML=buttons.join('');
  teamPagination.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>{if(btn.disabled)return;currentPage=Number(btn.dataset.page);renderDirectory();document.querySelector('.team-directory')?.scrollIntoView({behavior:'smooth',block:'start'})}));
}
function openProfile(id){
  const p=members.find(x=>x.id===id);if(!p)return;
  modalPhoto.src=p.photo||'assets/placeholder.svg';modalPhoto.alt=p.name;modalName.textContent=p.name;modalRole.textContent=p.role||p.category;modalCategory.textContent=p.category;modalFunction.textContent=p.function||'A completar';modalBio.textContent=p.bio||'Perfil profissional a completar com os dados oficiais da instituição.';modalProfileLink.href=`employee.html?id=${encodeURIComponent(p.id)}`;
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');setTimeout(()=>document.querySelector('.modal-close').focus(),100);
}
function closeProfile(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')}
modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeProfile));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeProfile()});

teamSearch.addEventListener('input',()=>{currentPage=1;renderDirectory()});
teamSort.addEventListener('change',()=>{currentPage=1;renderDirectory()});
teamClear.addEventListener('click',()=>{activeCategory='all';currentPage=1;teamSearch.value='';teamSort.value='name-asc';categoryBox.querySelectorAll('.team-category').forEach(b=>b.classList.toggle('active',b.dataset.category==='all'));teamTitle.textContent=allCategory.label;teamDescription.textContent=allCategory.description;renderDirectory()});
renderCategories();
renderDirectory();

document.getElementById('year').textContent=new Date().getFullYear();
const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.nav a')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+entry.target.id))}}),{rootMargin:'-40% 0px -50%'});sections.forEach(s=>sectionObserver.observe(s));

const feedbackForm=document.getElementById('feedback-form');
const feedbackSuccess=document.getElementById('feedback-success');
document.querySelectorAll('[data-feedback-type]').forEach(btn=>btn.addEventListener('click',()=>{const select=feedbackForm?.querySelector('[name="tipo"]');if(select){select.value=btn.dataset.feedbackType;document.querySelectorAll('[data-feedback-type]').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');document.getElementById('feedback').scrollIntoView({behavior:'smooth'});setTimeout(()=>feedbackForm.querySelector('[name="mensagem"]').focus(),500)}}));
feedbackForm?.addEventListener('submit',async e=>{
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
