const header=document.getElementById('header');
const nav=document.querySelector('.nav');
const menu=document.querySelector('.menu-toggle');
const modal=document.getElementById('profileModal');
const modalPhoto=document.getElementById('modalPhoto');
const modalName=document.getElementById('modalName');
const modalRole=document.getElementById('modalRole');
const modalBio=document.getElementById('modalBio');
const modalFunction=document.getElementById('modalFunction');
const people={
  higilda:{name:'Higilda Guilhermina S. Aveleira',role:'Direcção',function:'Liderança institucional',photo:'assets/higilda.jfif',bio:'Profissional integrada na liderança institucional, com foco na responsabilidade, organização e na construção de uma cultura de cuidado centrada nas pessoas. Este espaço pode ser actualizado com a formação, experiência, áreas de actuação e biografia oficial.'},
  edimilson:{name:'Edimilson',role:'Direcção',function:'Liderança institucional',photo:'assets/edimilson.jfif',bio:'Membro da direcção, contribuindo para a orientação institucional e para o desenvolvimento de uma prestação de cuidados responsável, eficiente e próxima. Este espaço pode ser actualizado com a formação, experiência, áreas de actuação e biografia oficial.'},
  afonso:{name:'Afonso Hegoel de Sousa',role:'Direcção',function:'Liderança institucional',photo:'assets/afonso.jfif',bio:'Profissional ligado à direcção da instituição, com participação na orientação estratégica e no compromisso com a qualidade dos serviços. Este espaço pode ser actualizado com a formação, experiência, áreas de actuação e biografia oficial.'}
};
function toggleMenu(){const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)}
menu.addEventListener('click',toggleMenu);
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>40),{passive:true});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});
document.querySelectorAll('.reveal,.reveal-group').forEach(el=>observer.observe(el));
function openProfile(key){const p=people[key];if(!p)return;modalPhoto.src=p.photo;modalPhoto.alt=p.name;modalName.textContent=p.name;modalRole.textContent=p.role;modalFunction.textContent=p.function;modalBio.textContent=p.bio;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');setTimeout(()=>document.querySelector('.modal-close').focus(),100)}
function closeProfile(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')}
document.querySelectorAll('.director-card').forEach(card=>card.querySelector('.more-btn').addEventListener('click',()=>openProfile(card.dataset.person)));
modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeProfile));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeProfile()});
document.getElementById('year').textContent=new Date().getFullYear();
const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.nav a')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+entry.target.id))}}),{rootMargin:'-40% 0px -50%'});sections.forEach(s=>sectionObserver.observe(s));
