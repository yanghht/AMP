/* ---------- header scroll ---------- */
const header=document.getElementById('header');
addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',scrollY>30);
});

/* ---------- burger ---------- */
const burger=document.getElementById('burger'),
      navLinks=document.getElementById('navLinks');
burger.addEventListener('click',()=>navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=>
  a.addEventListener('click',()=>navLinks.classList.remove('open')));

/* ---------- reveal on scroll ---------- */
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:.14});
document.querySelectorAll('.reveal').forEach((el,i)=>{
  el.style.transitionDelay=(i%3)*0.08+'s';
  io.observe(el);
});

/* ---------- modal helpers ---------- */
function openModal(id){
  document.getElementById(id).classList.add('show');
  document.body.style.overflow='hidden';
}
function closeModal(id){
  document.getElementById(id).classList.remove('show');
  document.body.style.overflow='';
}
function openGuide(){openModal('modalGuide');}
function openPrice(){openModal('modalPrice');}

document.querySelectorAll('.modal-ov').forEach(ov=>{
  ov.addEventListener('click',e=>{if(e.target===ov){
    ov.classList.remove('show');document.body.style.overflow='';}});
});
addEventListener('keydown',e=>{
  if(e.key==='Escape')document.querySelectorAll('.modal-ov.show')
    .forEach(m=>{m.classList.remove('show');document.body.style.overflow='';});
});

/* ---------- funnel: guide -> thank you + offer ---------- */
function getGuide(){
  const n=document.getElementById('gName').value.trim();
  const c=document.getElementById('gContact').value.trim();
  if(!c){alert('Укажите контакт, куда прислать гайд');return;}
  closeModal('modalGuide');
  setTimeout(()=>openModal('modalThanks'),260);
}
function acceptOffer(){
  closeModal('modalThanks');
  document.getElementById('doneTitle').textContent='Заявка на ТЗ принята';
  document.getElementById('doneText').textContent=
    'Отлично! Мы свяжемся с вами, чтобы оформить заказ ТЗ за 5 000 ₽ и уточнить детали проекта.';
  setTimeout(()=>openModal('modalDone'),260);
}

/* ---------- price ---------- */
function getPrice(){
  const c=document.getElementById('pContact').value.trim();
  if(!c){alert('Укажите контакт, куда прислать прайс');return;}
  closeModal('modalPrice');
  document.getElementById('doneTitle').textContent='Прайс отправлен';
  document.getElementById('doneText').textContent=
    'Подробный прайс уже в пути на указанный контакт. Если возникнут вопросы — мы на связи.';
  setTimeout(()=>openModal('modalDone'),260);
}

/* ---------- contact form ---------- */
function submitContact(){
  const c=document.getElementById('cContact').value.trim();
  if(!c){alert('Укажите контакт для связи');return;}
  ['cName','cContact','cMsg'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('doneTitle').textContent='Заявка отправлена';
  document.getElementById('doneText').textContent=
    'Спасибо! Мы свяжемся с вами в течение рабочего дня и обсудим проект.';
  openModal('modalDone');
}

/* ---------- gold dust cursor trail ---------- */
const canvas=document.getElementById('dust'),ctx=canvas.getContext('2d');
let W,H,particles=[];
function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
resize();addEventListener('resize',resize);
const golds=['#f4d678','#ffe9a8','#caa24a','#e6c061'];
let last={x:0,y:0},moved=false;
addEventListener('mousemove',e=>{
  moved=true;
  const dx=e.clientX-last.x,dy=e.clientY-last.y;
  const dist=Math.hypot(dx,dy);
  const count=Math.min(4,1+Math.floor(dist/14));
  for(let i=0;i<count;i++){
    particles.push({
      x:e.clientX+(Math.random()-.5)*8,
      y:e.clientY+(Math.random()-.5)*8,
      vx:(Math.random()-.5)*.5,
      vy:(Math.random()-.5)*.5-.15,
      life:1,
      size:Math.random()*1.8+.7,
      color:golds[(Math.random()*golds.length)|0]
    });
  }
  last.x=e.clientX;last.y=e.clientY;
  if(particles.length>140)particles.splice(0,particles.length-140);
});
function tick(){
  ctx.clearRect(0,0,W,H);
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx;p.y+=p.vy;p.life-=0.032;
    if(p.life<=0){particles.splice(i,1);continue;}
    ctx.globalAlpha=p.life*.85;
    ctx.fillStyle=p.color;
    ctx.shadowBlur=6;ctx.shadowColor=p.color;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size*p.life,0,6.283);
    ctx.fill();
  }
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  requestAnimationFrame(tick);
}
tick();