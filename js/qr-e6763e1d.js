"use strict";
const $=id=>document.getElementById(id);
const APP_URL="https://lussehair.com/qr";
const ICONS={
  instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37a4 4 0 1 1-7.88 1.15 4 4 0 0 1 7.88-1.15z"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>',
  tiktok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.7a8.16 8.16 0 0 0 4.77 1.52V6.79a4.83 4.83 0 0 1-1.84-.1z"/></svg>',
  facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99h-2.54V12h2.54V9.8c0-2.51 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/></svg>',
  snapchat:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2c-3.22 0-5.83 2.61-5.83 5.83 0 .48.03 1.24.04 1.34-.2.04-.87.36-1.05.41-.42.11-.65.47-.61.87.09.68.67 1.14 1.42 1.36-.5.79-1.75 2.17-3.03 2.56-.35.11-.57.44-.5.8.09.39.4.72 1.85.94.16.79.43 1.51.99 1.49.35-.01 1.16-.17 1.71.02.41.14 1.15 1.24 2.6 1.82.84.34 1.61.34 2.42.34.76 0 1.62 0 2.45-.34 1.45-.58 2.19-1.68 2.6-1.82.55-.19 1.36-.03 1.71-.02.56.02.83-.7.99-1.49 1.45-.22 1.76-.55 1.85-.94.07-.36-.15-.69-.5-.8-1.28-.39-2.53-1.77-3.03-2.56.75-.22 1.33-.68 1.42-1.36.04-.4-.19-.76-.61-.87-.18-.05-.85-.37-1.05-.41.01-.1.04-.86.04-1.34C17.82 4.61 15.21 2 11.99 2z"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  youtube:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  threads:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.87 11.25c-.09-.05-.19-.09-.28-.13-.17-3.11-1.87-4.89-4.72-4.91h-.04c-1.71 0-3.13.72-4.01 2.05l1.57 1.08c.65-.98 1.68-1.19 2.44-1.19h.03c.95 0 1.66.28 2.13.83.34.4.57.95.68 1.65-.85-.15-1.77-.19-2.75-.13-2.76.16-4.54 1.77-4.42 4.02.06 1.13.63 2.11 1.6 2.75.83.55 1.89.81 2.99.75 1.46-.08 2.6-.63 3.4-1.64.61-.76 1-1.75 1.16-3.01.68.42 1.19.96 1.47 1.62.48 1.11.51 2.93-.97 4.41-1.29 1.29-2.85 1.85-5.2 1.86-2.61-.02-4.58-.85-5.87-2.48C5.28 15.28 4.65 13.4 4.63 12c.02-1.4.65-3.28 1.86-4.87 1.29-1.63 3.26-2.46 5.87-2.48 2.63.02 4.64.86 5.98 2.5.65.8 1.14 1.81 1.46 2.98l1.91-.51c-.39-1.43-1-2.68-1.83-3.71-1.71-2.11-4.2-3.18-7.42-3.21h-.02c-3.21.02-5.68 1.1-7.34 3.19C3.65 7.83 2.87 10.31 2.86 12v.01c.01 1.69.79 4.16 2.24 6.01 1.65 2.09 4.13 3.16 7.34 3.19h.02c2.85-.02 4.86-.77 6.51-2.42 2.17-2.17 2.11-4.89 1.4-6.55-.51-1.19-1.48-2.16-2.5-2.99z"/></svg>',
  pinterest:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>',
  website:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
};
const LABELS={instagram:"Instagram",tiktok:"TikTok",facebook:"Facebook",snapchat:"Snapchat",x:"X",youtube:"YouTube",threads:"Threads",pinterest:"Pinterest",website:"Website"};

let SETTINGS={brand:"LUSSÉ",tagline:"Remy Human Hair · Dubai",phone:"+971 54 200 5442",whatsapp:"971542005442",email:"info@lussehair.com",address:"Dubai · UAE",social:{instagram:"https://www.instagram.com/lussehaircom",website:"https://lussehair.com"}};

function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("on");clearTimeout(t._to);t._to=setTimeout(()=>t.classList.remove("on"),2200);}

async function loadSettings(){
  try{
    const r=await fetch("/api/settings",{cache:"no-store"});
    if(r.ok){const s=await r.json();SETTINGS={...SETTINGS,...s,social:{...SETTINGS.social,...(s.social||{})}}}
  }catch(e){}
  applySettings();
}

function applySettings(){
  document.querySelector(".city").textContent=SETTINGS.address||"Dubai · UAE";
  const waNum=(SETTINGS.whatsapp||"").replace(/\D/g,"");
  const waMsg="Hi LUSSÉ! I'd love to book a colour match consultation.";
  $("waAction").href=waNum?`https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`:"#";
  const tel=(SETTINGS.phone||"").replace(/[^\d+]/g,"");
  $("telAction").href=tel?`tel:${tel}`:"#";
  $("telLabel").textContent=SETTINGS.phone||"Call";
  $("emailAction").href=SETTINGS.email?`mailto:${SETTINGS.email}`:"#";
  $("emailLabel").textContent=SETTINGS.email||"Email";
  const social=$("social");social.innerHTML="";
  Object.entries(SETTINGS.social||{}).forEach(([k,url])=>{
    if(!url||!ICONS[k])return;
    const a=document.createElement("a");
    a.href=url;a.target="_blank";a.rel="noopener";
    a.setAttribute("aria-label",LABELS[k]||k);a.title=LABELS[k]||k;
    a.innerHTML=ICONS[k];
    social.appendChild(a);
  });
}

$("saveVcard").addEventListener("click",()=>{
  const s=SETTINGS;
  const vcf=["BEGIN:VCARD","VERSION:3.0",`FN:${s.brand||"LUSSÉ"}`,`ORG:${s.brand||"LUSSÉ"} Hair Atelier`,`TITLE:100% Remy Human Hair Extensions`,s.phone?`TEL;TYPE=CELL,VOICE:${s.phone}`:"",s.whatsapp?`TEL;TYPE=CELL,VOICE:+${s.whatsapp}`:"",s.email?`EMAIL;TYPE=INTERNET:${s.email}`:"",s.address?`ADR;TYPE=WORK:;;${s.address};;;;`:"",`URL:https://lussehair.com`,(s.social&&s.social.instagram)?`X-SOCIALPROFILE;type=instagram:${s.social.instagram}`:"","END:VCARD"].filter(Boolean).join("\r\n");
  const blob=new Blob([vcf],{type:"text/vcard"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="LUSSE.vcf";document.body.appendChild(a);a.click();
  document.body.removeChild(a);URL.revokeObjectURL(url);
  toast("Contact saved · check downloads");
});

$("shareBtn").addEventListener("click",async()=>{
  if(navigator.share){try{await navigator.share({title:"LUSSÉ",text:"Save my digital card",url:APP_URL});}catch(e){}}
  else{navigator.clipboard.writeText(APP_URL);toast("Link copied");}
});
$("copyBtn").addEventListener("click",()=>{navigator.clipboard.writeText(APP_URL);toast("Link copied");});

function renderQR(){
  if(typeof QRCode==="undefined"){setTimeout(renderQR,80);return;}
  const el=$("qr"); el.innerHTML="";
  new QRCode(el,{text:APP_URL,width:180,height:180,colorDark:"#000000",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});
}

loadSettings();
if(document.readyState==="complete"){renderQR();}else{addEventListener("load",renderQR);}
