
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var TITLES={home:"LUSSÉ — 100% Human Hair Extensions in Dubai",collection:"Hair Extension Colours — LUSSÉ Dubai",about:"About LUSSÉ — 100% Remy Hair Atelier, Dubai",faq:"Hair Extensions FAQ — LUSSÉ Dubai",gallery:"Studio Gallery — LUSSÉ Dubai",contact:"Book a Fitting — LUSSÉ Hair Atelier, Dubai"};

  /* ---------- colour helpers ---------- */
  function clampByte(v){return Math.max(0,Math.min(255,Math.round(v)));}
  function shift(hex,amt){var n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    return "#"+[r+amt,g+amt,b+amt].map(function(v){return clampByte(v).toString(16).padStart(2,"0");}).join("");}
  function hx(h){var n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];}
  function mix(a,b,t){var A=hx(a),B=hx(b);return "#"+[0,1,2].map(function(i){return clampByte(A[i]+(B[i]-A[i])*t).toString(16).padStart(2,"0");}).join("");}

  var swatchApis=[], current="home";
  var IMG={"#1": "/img/4eea618339-470.webp", "#1B": "/img/4c307a7abe-470.webp", "#2": "/img/e347c3a1e7-470.webp", "#4": "/img/b001af331d-470.webp", "#6": "/img/43f56ff4db-470.webp", "#8": "/img/5f1004c3fd-470.webp", "#10": "/img/3ab2ec05de-470.webp", "#12": "/img/3d2c7e44c3-470.webp", "#18": "/img/0c4be1166c-470.webp", "#22": "/img/988d7f983e-470.webp", "#60": "/img/a47121c359-470.webp", "#613": "/img/a87e34c0d4-470.webp", "#30": "/img/2a2ca1e4f6-470.webp", "#33": "/img/bd8091cf30-470.webp", "#99J": "/img/6dc4b69411-470.webp", "T2/18": "/img/03cb4e541b-470.webp", "P4/27": "/img/5ea28558e2-470.webp", "R1B/60": "/img/481d694c70-470.webp", "S12": "/img/aaaec62300-470.webp", "RG": "/img/23f10a5ed1-470.webp", "LV": "/img/e27bf63765-470.webp", "BL": "/img/e18b79d33e-470.webp"};
  function startSwatches(){swatchApis.forEach(function(a){a.start();});}

  /* ---------- realistic glossy hair renderer (canvas) ---------- */
  function mkC(canvas,opts){
    var ctx=canvas.getContext("2d"),W=0,H=0,dpr=1;
    var top=opts.top,bot=opts.bottom,multi=opts.multi;
    function edge(cx,half,amp,freq,phase,yy,side){var tt=yy/H,taper=1-0.2*tt,wob=Math.sin(yy*freq+phase)*amp*(0.3+0.7*tt);return cx+wob+side*half*taper;}
    function draw(){
      ctx.clearRect(0,0,W,H);
      var bg=ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,shift(top,-50));bg.addColorStop(1,shift(bot,-68));
      ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      var ribbons=Math.max(5,Math.round(W/34)),rw=W/ribbons,i,y,y2,tm,base,lx0,rx0,lx1,rx1,g;
      for(i=0;i<ribbons;i++){
        var cx=(i+0.5)*rw,half=rw*0.72,amp=rw*(0.7+(i%3)*0.2),freq=0.007+(i%2)*0.0012,phase=i*0.9;
        var hs=multi?(i-(ribbons-1)/2)*11:((i%3)-1)*7,seg=Math.max(12,H/14);
        for(y=0;y<H;y+=seg){
          y2=Math.min(H,y+seg+1);tm=((y+y2)/2)/H;base=shift(mix(top,bot,tm),hs);
          lx0=edge(cx,half,amp,freq,phase,y,-1);rx0=edge(cx,half,amp,freq,phase,y,1);
          lx1=edge(cx,half,amp,freq,phase,y2,-1);rx1=edge(cx,half,amp,freq,phase,y2,1);
          ctx.beginPath();ctx.moveTo(lx0,y);ctx.lineTo(rx0,y);ctx.lineTo(rx1,y2);ctx.lineTo(lx1,y2);ctx.closePath();
          g=ctx.createLinearGradient(cx-half,0,cx+half,0);
          g.addColorStop(0,shift(base,-40));g.addColorStop(0.42,shift(base,-4));g.addColorStop(0.5,shift(base,54));g.addColorStop(0.6,shift(base,-2));g.addColorStop(1,shift(base,-44));
          ctx.fillStyle=g;ctx.fill();
        }
      }
      var mid=mix(top,bot,0.5),N=Math.round(W/2.6),k,x0,a,fr,ph,light,yy,xx;
      for(k=0;k<N;k++){
        x0=Math.random()*W;a=5+Math.random()*20;fr=0.007+Math.random()*0.002;ph=Math.random()*6.28;light=Math.random()<0.5;
        ctx.strokeStyle=light?shift(mid,52+Math.random()*34):shift(mid,-40);
        ctx.globalAlpha=light?0.07+Math.random()*0.11:0.05+Math.random()*0.08;ctx.lineWidth=0.5+Math.random()*1.0;ctx.beginPath();
        for(yy=0;yy<=H;yy+=10){xx=x0+Math.sin(yy*fr+ph)*a*(0.3+0.7*yy/H);if(yy===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}
        ctx.stroke();
      }
      ctx.globalAlpha=1;
      var rgd=ctx.createLinearGradient(0,0,0,H*0.24);rgd.addColorStop(0,"rgba(0,0,0,0.5)");rgd.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=rgd;ctx.fillRect(0,0,W,H*0.24);
      ctx.globalCompositeOperation="overlay";
      var sh=ctx.createLinearGradient(W*0.12,0,W*0.62,H);sh.addColorStop(0,"rgba(255,240,208,0)");sh.addColorStop(0.5,"rgba(255,240,208,0.16)");sh.addColorStop(1,"rgba(255,240,208,0)");
      ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation="source-over";
      var v=ctx.createRadialGradient(W/2,H*0.42,H*0.12,W/2,H*0.5,H*0.92);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.36)");
      ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
    }
    function size(){
      dpr=Math.min(window.devicePixelRatio||1,2);
      var r=canvas.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,r.height);
      canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+"px";canvas.style.height=H+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);if(W>2&&H>2)draw();
    }
    var to;window.addEventListener("resize",function(){clearTimeout(to);to=setTimeout(size,220);});
    return {canvas:canvas,start:function(){size();},stop:function(){}};
  }

  /* ---------- colour library ---------- */
  var COLORS=[
    {code:"#1",  name:"Jet Black",       fam:"Natural", c:"#0f0d0c"},
    {code:"#1B", name:"Natural Black",   fam:"Natural", c:"#171311"},
    {code:"#2",  name:"Darkest Brown",   fam:"Natural", c:"#2a201a"},
    {code:"#4",  name:"Chocolate",       fam:"Natural", c:"#4a3527"},
    {code:"#6",  name:"Chestnut",        fam:"Brunette",c:"#6b4a30"},
    {code:"#8",  name:"Ashy Brown",      fam:"Brunette",c:"#7d6650"},
    {code:"#10", name:"Mocha",           fam:"Brunette",c:"#8a6f55"},
    {code:"#12", name:"Golden Blonde",   fam:"Blonde",  c:"#a9824c"},
    {code:"#18", name:"Ash Blonde",      fam:"Blonde",  c:"#b7a079"},
    {code:"#22", name:"Beach Blonde",    fam:"Blonde",  c:"#cbb489"},
    {code:"#60", name:"Ice Blonde",      fam:"Blonde",  c:"#ded0b0"},
    {code:"#613",name:"Platinum",        fam:"Blonde",  c:"#e7d3a4"},
    {code:"#30", name:"Auburn",          fam:"Red",     c:"#6d3a25"},
    {code:"#33", name:"Copper",          fam:"Red",     c:"#8a3f22"},
    {code:"#99J",name:"Cherry Wine",     fam:"Red",     c:"#5a2530"},
    {code:"T2/18",name:"Bronde Ombré",   fam:"Blends",  top:"#241a15", bottom:"#c2ac82"},
    {code:"P4/27",name:"Caramel Balayage",fam:"Blends", top:"#3d2b1f", bottom:"#cf9f5c"},
    {code:"R1B/60",name:"Rooted Platinum",fam:"Blends", top:"#151110", bottom:"#ecd9ac"},
    {code:"S12",  name:"Silver Smoke",   fam:"Fashion", top:"#615e5a", bottom:"#cdcac6"},
    {code:"RG",   name:"Rose Gold",      fam:"Fashion", top:"#9a6154", bottom:"#e8bcb0"},
    {code:"LV",   name:"Dusty Lavender", fam:"Fashion", top:"#665775", bottom:"#cabcd3"},
    {code:"BL",   name:"Smoky Blue",     fam:"Fashion", top:"#39454f", bottom:"#8ea1ae"}
  ];
  var FAMS=["All","Natural","Brunette","Blonde","Red","Blends","Fashion"];

  var colorsEl=document.getElementById("colors"), filtersEl=document.getElementById("filters");
  function paintColors(fam){
    colorsEl.innerHTML="";
    COLORS.filter(function(c){return fam==="All"||c.fam===fam;}).forEach(function(c){
      var el=document.createElement("article"); el.className="color";
      var src=IMG[c.code]||"";
      el.innerHTML='<img class="chip" loading="lazy" alt="'+c.name+' '+c.code+' — 100% Remy human hair extension colour in Dubai" src="'+src+'">'+
        '<div class="cinfo"><span class="code">'+c.code+'</span><h3>'+c.name+'</h3><span class="fam">'+c.fam+'</span></div>';
      colorsEl.appendChild(el);
    });
  }
  FAMS.forEach(function(f,i){
    var b=document.createElement("button"); b.className="filter"+(i===0?" is-active":""); b.type="button"; b.textContent=f;
    b.addEventListener("click",function(){
      [].forEach.call(filtersEl.children,function(x){x.classList.remove("is-active");});
      b.classList.add("is-active"); paintColors(f);
    });
    filtersEl.appendChild(b);
  });
  paintColors("All");

  /* ---------- FAQ ---------- */
  var FAQ=[
    {q:"Are your extensions real human hair?",a:"Yes — every set is 100% Remy human hair, single-donor, with the cuticle kept intact and aligned root-to-tip. We never use synthetic fibre, or the acid-stripped and silicone-coated hair sold as \"human hair\" elsewhere."},
    {q:"What grade of human hair do you use?",a:"Every set is 100% Remy human hair — the cuticle kept intact and aligned root-to-tip, ethically single-donor sourced. It is never acid-stripped or silicone-coated, which is what lets it tone, colour and last like hair that grew on your own head."},
    {q:"How long will a set last?",a:"With our recommended care routine, a set lasts nine to twelve months. Semi-permanent fits such as tape-in and hand-tied wefts are simply moved up every six to nine weeks as your own hair grows out."},
    {q:"Which colours do you carry?",a:"Twenty-two-plus tones and blends: naturals from jet black to chocolate, full brunette and blonde ranges through to platinum, warm auburn and copper, ombré and balayage blends, and soft fashion colours like rose gold, lavender and smoky blue. Custom and rooted blends are available on request."},
    {q:"Can the hair be coloured, toned or straightened?",a:"Yes. Because it is genuine, untreated human hair, your colourist can tone, gloss and darken it, and you can heat-style it with a protectant. We advise against heavy lightening and always recommend a strand test first."},
    {q:"How much do hair extensions cost in Dubai?",a:"An eight-piece clip-in set starts from AED 990 at 14 inches and rises with length and weight to AED 2,050 at 24 inches. Bonded and hand-tied methods are quoted after your consultation, which is always complimentary."},
    {q:"Do you deliver outside Dubai?",a:"We deliver free across all seven emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah and Umm Al Quwain. Home-visit fittings are available within Dubai."},
    {q:"Will extensions damage my own hair?",a:"Fitted correctly and cared for, no. We match the weight to your density so there is no tension on the root, and every method we offer is designed to be removed and moved up without stress to your natural hair."},
    {q:"How do I book?",a:"Send us a WhatsApp message or fill in the form on the Contact page with your colour, length and preferred date. We'll confirm your complimentary colour-match appointment at the WhatsApp consultation."}
  ];
  var faqEl=document.getElementById("faqList");
  FAQ.forEach(function(f){
    var d=document.createElement("details"); d.className="faq";
    d.innerHTML="<summary>"+f.q+"</summary><div class='ans'><p>"+f.a+"</p></div>";
    faqEl.appendChild(d);
  });

  /* ---------- booking form: FormSubmit + WhatsApp mirror ---------- */
  var form=document.getElementById("bookForm"), msg=document.getElementById("formMsg");
  var waBtn=document.getElementById("waFallback");
  function buildWa(){
    var g=function(id){return (document.getElementById(id)||{}).value||""};
    var lines=[
      "Hi LUSSÉ, I'd like a colour-match consultation.",
      "Name: "+g("fName"),
      "Phone: "+g("fPhone"),
      "Location: "+g("fEmirate"),
      "Interested in: "+g("fMethod"),
      "Notes: "+g("fNote")
    ].filter(Boolean).join("\n");
    waBtn.href="https://wa.me/971542005442?text="+encodeURIComponent(lines);
  }
  ["fName","fPhone","fEmirate","fMethod","fNote"].forEach(function(id){
    var el=document.getElementById(id); if(el) el.addEventListener("input",buildWa);
    if(el) el.addEventListener("change",buildWa);
  });
  buildWa();
  form.addEventListener("submit",function(e){
    var name=document.getElementById("fName").value.trim();
    var phone=document.getElementById("fPhone").value.trim();
    if(!name||!phone){ e.preventDefault(); msg.style.color="var(--blush)"; msg.textContent="Please add your name and a number we can reach you on."; return; }
    msg.style.color="var(--accent)"; msg.textContent="Sending your request…";
    document.getElementById("submitBtn").disabled=true;
  });

  /* ---------- router ---------- */
  var views=document.querySelectorAll(".view");
  var navA=document.querySelectorAll("[data-go]");
  function go(name,push){
    name=String(name||"").replace(/^view-/,"");
    if(!TITLES[name]) name="home";
    current=name;
    views.forEach(function(v){v.classList.toggle("is-active",v.getAttribute("data-view")===name);});
    document.querySelectorAll(".view.is-active video[data-poster]").forEach(function(v){v.setAttribute("poster",v.getAttribute("data-poster"));v.removeAttribute("data-poster");});
    document.querySelectorAll(".nav-links a").forEach(function(a){a.classList.toggle("active",a.getAttribute("data-go")===name);});
    document.title=TITLES[name];
    window.scrollTo({top:0,behavior:reduce?"auto":"smooth"});
    syncStrands(name);
    closeMenu();
    if(push!==false && location.hash!=="#"+name) history.replaceState(null,"","#"+name);
  }
  navA.forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();go(a.getAttribute("data-go"));});});
  window.addEventListener("hashchange",function(){go((location.hash||"#home").slice(1),false);});

  /* ---------- mobile menu ---------- */
  var burger=document.getElementById("burger"), navLinks=document.getElementById("navLinks");
  function closeMenu(){navLinks.classList.remove("open");burger.setAttribute("aria-expanded","false");}
  burger.addEventListener("click",function(){
    var open=navLinks.classList.toggle("open");burger.setAttribute("aria-expanded",open?"true":"false");
  });

  /* ---------- generative strands ---------- */
  var PALS={
    hero:["#efe0c6","#cba766","#8a6440","#5c4128","#b98a58","#e7d3a4","#3a2a1c","#d0a98f"],
    about:["#efe0c6","#cba766","#7d5a38","#4a3527","#b98a58","#e7d3a4"],
    p1:["#efe0c6","#8a6440","#4a3527","#2a201a","#6b4a30"],
    p2:["#efe0c6","#e7d3a4","#cbb489","#b7a079","#cba766"],
    p3:["#e3b3a6","#8a3f22","#6d3a25","#c98f83","#5a2530"],
    c1:["#efe0c6","#cba766","#7d5a38","#4a3527","#b98a58","#e7d3a4"],
    a1:["#efe0c6","#cba766","#8a6440","#5c4128","#e7d3a4"]
  };
  var instances=[];
  function makeStrands(canvas,pal,dense){
    var ctx=canvas.getContext("2d"),W,H,dpr,strands,t=0,raf=null;
    function size(){
      dpr=Math.min(window.devicePixelRatio||1,2);
      var r=canvas.parentElement.getBoundingClientRect();
      W=Math.max(1,r.width);H=Math.max(1,r.height);
      canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+"px";canvas.style.height=H+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);build();
    }
    function build(){
      strands=[];var n=Math.round(W/(dense||9));
      for(var i=0;i<n;i++){strands.push({x:(i/n)*W+(Math.random()-.5)*10,amp:20+Math.random()*70,
        wl:0.0016+Math.random()*0.0022,ph:Math.random()*Math.PI*2,sp:0.15+Math.random()*0.5,
        w:0.6+Math.random()*1.7,col:pal[i%pal.length],a:0.10+Math.random()*0.28,drift:(Math.random()-.5)*0.35});}
    }
    function draw(){
      ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation="lighter";
      for(var s,i=0;i<strands.length;i++){s=strands[i];ctx.beginPath();ctx.lineWidth=s.w;ctx.strokeStyle=s.col;ctx.globalAlpha=s.a;
        for(var y=-20;y<=H+20;y+=8){var sway=Math.sin(y*s.wl+s.ph+t*s.sp)*s.amp+Math.sin(y*s.wl*2.3+s.ph*1.7+t*s.sp*0.6)*(s.amp*0.35);
          var x=s.x+sway+Math.sin(t*0.2+i)*6+s.drift*y*0.12;if(y<=-20)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
        ctx.stroke();}
      ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";
    }
    function loop(){t+=0.016;draw();raf=requestAnimationFrame(loop);}
    var to;window.addEventListener("resize",function(){clearTimeout(to);to=setTimeout(size,200);});
    var api={
      canvas:canvas,
      start:function(){size();if(reduce){draw();return;}if(!raf)loop();},
      stop:function(){if(raf){cancelAnimationFrame(raf);raf=null;}}
    };
    return api;
  }
  var TILE={
    p1:{top:"#241a12",bottom:"#7d5a38"},
    p2:{top:"#4a3527",bottom:"#e6d3a0"},
    p3:{top:"#5a2530",bottom:"#b5643f"},
    c1:{top:"#241a12",bottom:"#d3bd90",multi:true},
    a1:{top:"#241a12",bottom:"#8a6440"}
  };
  document.querySelectorAll("[data-strands]").forEach(function(cv){
    var key=cv.getAttribute("data-strands"), api;
    if(key==="hero"||key==="about"||key==="faq"){ api=makeStrands(cv,PALS[key]||PALS.hero,(key==="about"||key==="faq")?4:8); }
    else { api=mkC(cv, TILE[key]||{top:"#241a12",bottom:"#8a6440"}); }
    api.view=cv.closest(".view").getAttribute("data-view");
    instances.push(api);
  });
  function syncStrands(name){
    instances.forEach(function(a){
      if(a.view===name) a.start(); else a.stop();
    });
    if(name==="collection") requestAnimationFrame(startSwatches);
  }

  /* ---------- init ---------- */
  var start=(location.hash||"#home").slice(1);
  go(TITLES[start]?start:"home",false);
})();
