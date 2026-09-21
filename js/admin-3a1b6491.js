
"use strict";
const PW_KEY="lusse-pw", SESSION_KEY="lusse-session";
const DEFAULT_PW="lusse2026";

const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
function toast(msg,kind){const t=$("toast");t.className="toast on "+(kind||"");t.textContent=msg;clearTimeout(t._to);t._to=setTimeout(()=>t.className="toast "+(kind||""),3000)}
function getPw(){return sessionStorage.getItem(PW_KEY)||DEFAULT_PW}

$("loginBtn").onclick=login;
$("pw").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
async function login(){
  const p=$("pw").value.trim();
  if(!p) return $("loginErr").textContent="أدخلي كلمة السر";
  sessionStorage.setItem(PW_KEY,p);
  sessionStorage.setItem(SESSION_KEY,"1");
  enterApp();
}
$("logoutBtn").onclick=()=>{sessionStorage.clear();location.reload()};
if(sessionStorage.getItem(SESSION_KEY)) enterApp();

async function enterApp(){
  $("loginPage").classList.add("hide");
  $("app").classList.add("on");
  await checkSetup();
  await loadProducts();
}

async function checkSetup(){
  try{
    const r=await fetch("/api/status",{cache:"no-store"});
    const j=await r.json();
    $("setupBanner").classList.toggle("on",!j.ready);
    $("infoBanner").classList.toggle("on",j.ready);
  }catch(e){}
}

let data={products:[],currency:"AED",whatsapp:"971542005442",updated:""};
let editingId=null;
let currentMedia=[];
let hasPending=false;

function setPending(v){
  hasPending=v;
  $("pendingBadge").classList.toggle("on",v);
}

async function loadProducts(){
  try{
    const r=await fetch("/api/products?t="+Date.now(),{cache:"no-store"});
    data=await r.json();
    data.products=data.products||[];
    setPending(false);
    render();
  }catch(e){toast("فشل تحميل المنتجات","err")}
}
$("reloadBtn").onclick=async()=>{
  if(hasPending && !confirm("لديك تغييرات غير محفوظة. هل تريدين حقاً التحديث وفقدانها؟")) return;
  await loadProducts();
  toast("تم التحديث من السيرفر","ok");
};

function render(){
  const p=data.products;
  const priced=p.filter(x=>x.priceFrom);
  const avg=priced.length?Math.round(priced.reduce((a,x)=>a+x.priceFrom,0)/priced.length):0;
  const withMedia=p.filter(x=>(x.media&&x.media.length)||x.image).length;
  $("stats").innerHTML=`
    <div class="stat"><div class="stat-k">إجمالي المنتجات</div><div class="stat-v">${p.length}</div><div class="stat-d">معروضة على الموقع</div></div>
    <div class="stat"><div class="stat-k">متوسط السعر</div><div class="stat-v">${avg?"د.إ "+avg:"—"}<small>من</small></div><div class="stat-d">لجميع المنتجات</div></div>
    <div class="stat"><div class="stat-k">فيها وسائط</div><div class="stat-v">${withMedia}<small>/ ${p.length}</small></div><div class="stat-d">لها صور أو فيديو</div></div>
    <div class="stat"><div class="stat-k">آخر تحديث</div><div class="stat-v" style="font-size:16px">${data.updated||"لا يوجد"}</div><div class="stat-d">آخر نشر مباشر</div></div>`;

  const q=($("q").value||"").toLowerCase().trim();
  const shown=q?p.filter(x=>((x.name||"")+" "+(x.method||"")+" "+(x.sku||"")).toLowerCase().includes(q)):p;
  const tbl=$("tbl");
  if(!shown.length){
    tbl.innerHTML=`<div class="empty"><h3>${p.length?"لا توجد نتائج":"لا توجد منتجات بعد"}</h3><p>${p.length?"جرّبي بحثاً مختلفاً.":"اضغطي <b>إضافة منتج</b> لإنشاء أول منتج."}</p></div>`;
    return;
  }
  tbl.innerHTML=`<table><thead><tr>
    <th style="width:60px"></th><th>المنتج</th><th>الطريقة</th><th>السعر</th><th>الحالة</th><th></th>
  </tr></thead><tbody>${shown.map(x=>{
    const media=(x.media&&x.media[0])||(x.image?{type:/\.(mp4|webm|mov)$/i.test(x.image)?"video":"image",url:x.image}:null);
    const thumb=media
      ? (media.type==="video"?`<video class="p-thumb" muted src="${esc(media.url)}"></video>`:`<img class="p-thumb" src="${esc(media.url)}" alt="" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div class=&quot;p-thumb p-thumb-empty&quot;>L</div>')">`)
      : `<div class="p-thumb p-thumb-empty">L</div>`;
    const price=x.priceTo?`د.إ ${x.priceFrom} – ${x.priceTo}`:`د.إ ${x.priceFrom||0}`;
    return `<tr>
      <td class="c-thumb">${thumb}</td>
      <td class="c-name"><div class="p-name">${esc(x.name)}</div><div class="p-sku">${esc(x.sku||x.id)}</div><div class="m-meta">${esc(x.method||"—")} · ${price}</div></td>
      <td class="c-method">${esc(x.method||"—")}</td>
      <td class="c-price price">${price}</td>
      <td class="c-status"><span class="chip live">مباشر</span></td>
      <td class="act-cell">
        <button class="btn btn-secondary btn-sm" onclick="edit('${esc(x.id)}')">تعديل</button>
        <button class="btn btn-danger btn-sm" onclick="del('${esc(x.id)}')">حذف</button>
      </td>
    </tr>`;
  }).join("")}</tbody></table>`;
}
$("q").addEventListener("input",render);

function openDrawer(){$("drawerScrim").classList.add("on");$("drawer").classList.add("on")}
function closeDrawer(){$("drawerScrim").classList.remove("on");$("drawer").classList.remove("on")}
$("drClose").onclick=closeDrawer;
$("drCancel").onclick=closeDrawer;
$("drawerScrim").onclick=closeDrawer;
$("addBtn").onclick=()=>openEditor(null);
window.edit=id=>openEditor(data.products.find(p=>p.id===id));
window.del=async id=>{
  if(!confirm("هل تريدين حقاً حذف هذا المنتج؟ سيتم النشر مباشرة."))return;
  data.products=data.products.filter(p=>p.id!==id);
  render();setPending(true);
  await publishNow(true);
};

function openEditor(p){
  editingId=p?p.id:null;
  $("drTitle").textContent=p?"تعديل منتج":"منتج جديد";
  const set=(f,v="")=>$(("f_"+f)).value=v;
  set("id",p?p.id:"");
  set("name",p?.name);
  set("method",p?.method);
  set("sku",p?.sku);
  set("priceFrom",p?.priceFrom);
  set("priceTo",p?.priceTo);
  set("fitTime",p?.fitTime);
  set("wearTime",p?.wearTime);
  set("shortDesc",p?.shortDesc);
  set("longDesc",p?.longDesc);
  set("lengths",p?.lengths?.join(", "));
  currentMedia=p&&Array.isArray(p.media)?[...p.media]:(p?.image?[{type:/\.(mp4|webm|mov)$/i.test(p.image)?"video":"image",url:p.image}]:[]);
  renderMedia();
  openDrawer();
}

function renderMedia(){
  $("mediaGrid").innerHTML=currentMedia.map((m,i)=>`
    <div class="media-tile">${m.type==="video"?`<video muted src="${esc(m.url)}"></video>`:`<img src="${esc(m.url)}" alt="">`}
    <button class="x" onclick="rmMedia(${i})" title="حذف">×</button></div>`).join("");
}
window.rmMedia=i=>{currentMedia.splice(i,1);renderMedia()};

$("drSave").onclick=async()=>{
  const val=k=>$(("f_"+k)).value.trim();
  const name=val("name");
  if(!name){toast("الاسم مطلوب","err");return}
  const id=editingId||name.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/gi,"-").replace(/^-+|-+$/g,"")||("p-"+Date.now());
  const p={
    id,name,
    method:val("method"),
    sku:val("sku"),
    priceFrom:+val("priceFrom")||0,
    priceTo:+val("priceTo")||undefined,
    fitTime:val("fitTime"),
    wearTime:val("wearTime"),
    shortDesc:val("shortDesc"),
    longDesc:val("longDesc"),
    lengths:val("lengths").split(",").map(s=>s.trim()).filter(Boolean),
    media:currentMedia,
    image:currentMedia[0]?.url||""
  };
  if(!p.priceTo)delete p.priceTo;
  const i=data.products.findIndex(x=>x.id===id);
  if(i>=0)data.products[i]=p; else data.products.push(p);
  render();
  setPending(true);
  closeDrawer();
  await publishNow(true);
};

// ---------- UPLOAD ----------
const dz=$("dz"),fp=$("fp");
dz.onclick=()=>fp.click();
fp.onchange=e=>{upload([...e.target.files]);fp.value=""};
["dragenter","dragover"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add("over")}));
["dragleave","drop"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove("over")}));
dz.addEventListener("drop",e=>upload([...e.dataTransfer.files]));

async function upload(files){
  if(!files.length)return;
  dz.classList.add("busy");
  const orig=dz.querySelector("b").textContent;
  let ok=0;
  for(let i=0;i<files.length;i++){
    const f=files[i];
    dz.querySelector("b").textContent=`جاري الرفع ${i+1}/${files.length}: ${f.name}`;
    try{
      const r=await fetch(`/api/upload?filename=${encodeURIComponent(f.name)}`,{
        method:"POST",
        headers:{"x-admin-password":getPw(),"content-type":f.type||"application/octet-stream"},
        body:f
      });
      const j=await r.json();
      if(!r.ok){toast(j.error||"فشل الرفع","err");continue}
      currentMedia.push({type:f.type.startsWith("video")?"video":"image",url:j.url,name:f.name});
      renderMedia();
      ok++;
    }catch(e){toast("خطأ في الرفع: "+e.message,"err")}
  }
  dz.classList.remove("busy");
  dz.querySelector("b").textContent=orig;
  if(ok)toast(`تم رفع ${ok} ملف${ok>1?"ات":""}`,"ok");
}

// ---------- PUBLISH ----------
$("publishBtn").onclick=openPublish;
$("pubClose").onclick=closePublish;
$("pubCancel").onclick=closePublish;
function openPublish(){
  $("pubCount").textContent=`${data.products.length} منتج${data.products.length===1?"":""}`;
  $("pubGo").disabled=false;
  $("pubGo").innerHTML='<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v14"/><path d="M6 9l6-6 6 6"/></svg> نشر الآن';
  $("pubScrim").classList.add("on");
}
function closePublish(){$("pubScrim").classList.remove("on")}
$("pubGo").onclick=()=>{closePublish();publishNow(false)};

async function publishNow(silent){
  const btn=$("publishBtn");btn.disabled=true;
  if(!silent){toast("جاري النشر…","ok");}
  try{
    const r=await fetch("/api/publish",{
      method:"POST",
      headers:{"content-type":"application/json","x-admin-password":getPw()},
      body:JSON.stringify(data)
    });
    const j=await r.json();
    btn.disabled=false;
    if(!r.ok){
      toast(j.error||"فشل النشر","err");
      if(j.setup){$("setupBanner").classList.add("on")}
      return false;
    }
    data.updated=j.updated;
    setPending(false);
    render();
    toast("تم النشر على lussehair.com ✓","ok");
    return true;
  }catch(e){
    btn.disabled=false;
    toast("خطأ في الشبكة: "+e.message,"err");
    return false;
  }
}


// ---------- VIEW SWITCHING ----------
const sbItems=document.querySelectorAll('.sb-item[data-view]');
const pageViews={products:$("page-products"),contact:$("page-contact"),brand:$("page-brand")};
sbItems.forEach(b=>b.onclick=()=>{
  const v=b.dataset.view;
  sbItems.forEach(x=>x.classList.toggle("active",x===b));
  Object.entries(pageViews).forEach(([k,el])=>{if(el)el.hidden=k!==v});
  $("sb").classList.remove("open");$("sbScrim").classList.remove("on");
  if(v==="contact") loadSettings();
});

// ---------- SETTINGS ----------
async function loadSettings(){
  try{
    const r=await fetch("/api/settings?t="+Date.now(),{cache:"no-store"});
    const s=await r.json();
    $("s_phone").value=s.phone||"";
    $("s_whatsapp").value=s.whatsapp||"";
    $("s_email").value=s.email||"";
    $("s_address").value=s.address||"";
    $("s_hours").value=s.hours||"";
    const soc=s.social||{};
    ["instagram","tiktok","facebook","snapchat","x","youtube","threads","pinterest"].forEach(k=>{
      const el=$(("s_"+k)); if(el)el.value=soc[k]||"";
    });
  }catch(e){toast("فشل تحميل الإعدادات","err")}
}

$("saveContactBtn").onclick=async()=>{
  const btn=$("saveContactBtn"); btn.disabled=true; btn.textContent="جاري الحفظ…";
  const body={
    phone:$("s_phone").value.trim(),
    whatsapp:$("s_whatsapp").value.trim(),
    email:$("s_email").value.trim(),
    address:$("s_address").value.trim(),
    hours:$("s_hours").value.trim(),
    social:{
      instagram:$("s_instagram").value.trim(),
      tiktok:$("s_tiktok").value.trim(),
      facebook:$("s_facebook").value.trim(),
      snapchat:$("s_snapchat").value.trim(),
      x:$("s_x").value.trim(),
      youtube:$("s_youtube").value.trim(),
      threads:$("s_threads").value.trim(),
      pinterest:$("s_pinterest").value.trim()
    }
  };
  try{
    const r=await fetch("/api/settings",{method:"POST",headers:{"content-type":"application/json","x-admin-password":getPw()},body:JSON.stringify(body)});
    const j=await r.json();
    btn.disabled=false; btn.innerHTML='<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> حفظ ونشر';
    if(!r.ok){toast(j.error||"فشل الحفظ","err");return}
    toast("تم حفظ إعدادات الاتصال ✓","ok");
  }catch(e){
    btn.disabled=false; btn.textContent="حفظ ونشر";
    toast("خطأ في الشبكة: "+e.message,"err");
  }
};


// ---------- SIDEBAR MOBILE ----------
$("tbMenu").onclick=()=>{$("sb").classList.add("open");$("sbScrim").classList.add("on")};
$("sbClose").onclick=()=>{$("sb").classList.remove("open");$("sbScrim").classList.remove("on")};
$("sbScrim").onclick=()=>{$("sb").classList.remove("open");$("sbScrim").classList.remove("on")};

// warn before leaving with unpublished changes
addEventListener("beforeunload",e=>{if(hasPending){e.preventDefault();e.returnValue=""}});
