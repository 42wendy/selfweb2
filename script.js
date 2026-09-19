const experiences={
  product:{number:'01 / 05',period:'PRODUCT OPERATIONS · 2024.10 — 2024.11',title:'广州趣玩网络科技有限公司',description:'参与 TT Voice 用户研究与行为数据整理，协助游戏叙事 AI 模型的训练和优化，并为“灵魂伴侣”模块撰写内容。',tags:['用户研究','数据分析','内容运营']},
  visual:{number:'02 / 05',period:'FREELANCE ILLUSTRATOR · 2024.07 — PRESENT',title:'自由插画师',description:'将客户需求和活动主题转化为视觉作品，累计交付约 500 个委托项目。独立处理沟通、修改、进度与交付。',tags:['插画','客户沟通','项目管理']},
  field:{number:'03 / 05',period:'TECHNICAL ASSISTANT · 2025.05 — 2025.06',title:'仁德园林绿化有限公司',description:'参与西沙河修复项目，协助工程监图、技术文档、现场标记与测量，以及空间数据采集和工地协调。',tags:['生态修复','工程支持','现场协调']},
  education:{number:'04 / 05',period:'EDUCATION',title:'广东工业大学 · 岭南大学',description:'广东工业大学环境工程本科（2021.09 — 2025.06）；岭南大学 ATB 硕士在读。',tags:['环境工程','ATB','持续学习']},
  tools:{number:'05 / 05',period:'TOOLS & LANGUAGES',title:'能力与工具',description:'普通话（母语）、英语（IELTS 5.5）。使用 Microsoft Office、Photoshop、CLIP STUDIO PAINT、Procreate、SAI2 与 Nomad Sculpt。',tags:['Office','Adobe','数字绘画']}
};

const rotor=document.querySelector('#rotor');
const panel=document.querySelector('#experience');
const contactReveal=document.querySelector('#contactReveal');
const bladeTip=document.querySelector('#bladeTip');
const scene=document.querySelector('.scene');
const plug=document.querySelector('#plug');
const socketCard=document.querySelector('#socketCard');
const cablePath=document.querySelector('#cablePath');
const powerHint=document.querySelector('#powerHint');
const blades=[...document.querySelectorAll('.blade')];
let rotation=0,velocity=0,holding=false,previousTime=0,heldFor=0,contactsUnlocked=false,powered=false,draggingPlug=false,plugOffset={x:0,y:0};
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const bladeNames={product:'产品运营',visual:'视觉创作',field:'工程现场',education:'教育背景',tools:'能力工具'};

function updateCable(){
  const sceneBox=scene.getBoundingClientRect();
  const baseBox=document.querySelector('.base').getBoundingClientRect();
  const endBox=(powered?socketCard.querySelector('.socket'):plug).getBoundingClientRect();
  const startX=baseBox.right-sceneBox.left-5, startY=baseBox.top-sceneBox.top+baseBox.height*.68;
  const endX=(powered?endBox.left+endBox.width*.29:endBox.left)-sceneBox.left;
  const endY=endBox.top-sceneBox.top+endBox.height*.5;
  const span=Math.max(40,endX-startX);
  const lowPoint=Math.min(sceneBox.height-13,Math.max(startY,endY)+56);
  cablePath.setAttribute('d',`M ${startX} ${startY} C ${startX+span*.29} ${lowPoint}, ${endX-span*.47} ${lowPoint}, ${endX} ${endY}`);
}
function enablePower(){
  powered=true;draggingPlug=false;scene.classList.add('powered');scene.classList.remove('needs-power');
  plug.classList.remove('dragging');socketCard.classList.remove('ready');
  powerHint.textContent='已接通电源 · 按住页面吹风';updateCable();
}
function movePlug(event){
  if(!draggingPlug||powered)return;
  const box=scene.getBoundingClientRect();
  const x=Math.max(0,Math.min(box.width-plug.offsetWidth,event.clientX-box.left-plugOffset.x));
  const y=Math.max(0,Math.min(box.height-plug.offsetHeight,event.clientY-box.top-plugOffset.y));
  plug.style.left=`${x}px`;plug.style.top=`${y}px`;updateCable();
  const plugBox=plug.getBoundingClientRect(),socketBox=socketCard.querySelector('.socket').getBoundingClientRect();
  const centerX=plugBox.left+plugBox.width/2,centerY=plugBox.top+plugBox.height/2;
  socketCard.classList.toggle('ready',centerX>=socketBox.left-20&&centerX<=socketBox.right+20&&centerY>=socketBox.top-20&&centerY<=socketBox.bottom+20);
}
plug.addEventListener('pointerdown',event=>{
  if(powered)return;event.preventDefault();event.stopPropagation();
  const box=plug.getBoundingClientRect();plugOffset={x:event.clientX-box.left,y:event.clientY-box.top};draggingPlug=true;plug.classList.add('dragging');plug.setPointerCapture?.(event.pointerId);
});
plug.addEventListener('keydown',event=>{if(!powered&&(event.key==='Enter'||event.key===' ')){event.preventDefault();enablePower()}});
window.addEventListener('pointermove',movePlug);
window.addEventListener('pointerup',event=>{
  if(!draggingPlug)return;
  draggingPlug=false;plug.classList.remove('dragging');
  const plugBox=plug.getBoundingClientRect(), socketBox=socketCard.querySelector('.socket').getBoundingClientRect();
  const x=plugBox.left+plugBox.width/2,y=plugBox.top+plugBox.height/2;
  if(x>=socketBox.left-20&&x<=socketBox.right+20&&y>=socketBox.top-20&&y<=socketBox.bottom+20)enablePower();
  else socketCard.classList.remove('ready');
});
window.addEventListener('resize',updateCable);
requestAnimationFrame(updateCable);

function revealContacts(){
  if(!contactReveal.hidden)return;
  contactsUnlocked=true;
  panel.hidden=true;
  bladeTip.hidden=true;
  blades.forEach(blade=>blade.classList.remove('selected'));
  contactReveal.hidden=false;
}

function frame(time){
  const elapsed=Math.min((time-previousTime)||16,40);
  const dt=elapsed/16;
  previousTime=time;
  if(holding){
    heldFor+=elapsed;
    const windLevel=Math.min(heldFor/2800,1);
    document.body.style.setProperty('--wind-opacity',(.25+windLevel*.75).toFixed(2));
    document.body.style.setProperty('--wind-duration',`${(1.25-windLevel*.7).toFixed(2)}s`);
    if(heldFor>=2800)revealContacts();
    if(!reduceMotion.matches)velocity=Math.min(.18+.48*Math.pow(heldFor/1000,2),11.5);
  }
  if(velocity){rotation=(rotation+velocity*dt)%360;rotor.style.transform=`rotate(${rotation}deg)`}
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function stopBlowing(){holding=false;velocity=0;heldFor=0;document.body.classList.remove('blowing');document.body.style.removeProperty('--wind-opacity');document.body.style.removeProperty('--wind-duration')}
document.addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse'&&event.button!==0)return;
  if(event.target.closest('.close')||event.target.closest('.plug')||event.target.closest('.socket-card'))return;
  if(!powered){
    scene.classList.remove('needs-power');void scene.offsetWidth;scene.classList.add('needs-power');
    powerHint.textContent='请先把插头拖进插座';
    return;
  }
  holding=true;
  document.body.classList.add('blowing');
});
window.addEventListener('pointerup',stopBlowing);
window.addEventListener('pointercancel',stopBlowing);
window.addEventListener('blur',stopBlowing);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopBlowing()});

blades.forEach(blade=>{
  blade.addEventListener('pointerenter',()=>{if(!holding){bladeTip.textContent=bladeNames[blade.dataset.key];bladeTip.hidden=false}});
  blade.addEventListener('pointermove',event=>{bladeTip.style.left=`${Math.min(event.clientX+16,window.innerWidth-110)}px`;bladeTip.style.top=`${Math.min(event.clientY+18,window.innerHeight-36)}px`});
  blade.addEventListener('pointerleave',()=>bladeTip.hidden=true);
  blade.addEventListener('click',()=>{
  const item=experiences[blade.dataset.key];
  document.querySelector('#detailNumber').textContent=item.number;
  document.querySelector('#detailPeriod').textContent=item.period;
  document.querySelector('#detailTitle').textContent=item.title;
  document.querySelector('#detailDescription').textContent=item.description;
  document.querySelector('#detailTags').replaceChildren(...item.tags.map(tag=>{const span=document.createElement('span');span.textContent=tag;return span}));
  blades.forEach(other=>other.classList.toggle('selected',other===blade));
  panel.hidden=false;
  panel.dataset.key=blade.dataset.key;
  contactReveal.hidden=true;
  bladeTip.hidden=true;
  });
});

document.querySelector('#close').addEventListener('click',()=>{
  panel.hidden=true;
  blades.forEach(blade=>blade.classList.remove('selected'));
  if(contactsUnlocked)contactReveal.hidden=false;
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!panel.hidden)document.querySelector('#close').click();
});
