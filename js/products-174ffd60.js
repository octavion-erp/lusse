
(async function(){
  try{
    var r=await fetch("/api/products?t="+Date.now(),{cache:"no-store"});
    if(!r.ok) return;
    var d=await r.json();
    var wa=d.whatsapp||"971542005442", cur=d.currency||"AED";
    var grid=document.getElementById("productsGrid");
    if(!grid || !d.products || !d.products.length){ document.getElementById("products")&&(document.getElementById("products").style.display="none"); return; }
    var html="", schema=[];
    d.products.forEach(function(p){
      var price=p.priceTo?(cur+" "+p.priceFrom+"–"+p.priceTo):(cur+" "+p.priceFrom);
      var text=encodeURIComponent("Hi LUSSÉ, I'd like to order "+p.name+" ("+price+"). Please advise on colour match & delivery.");
      var mediaArr = (p.media && p.media.length) ? p.media : (p.image ? [{type: /\.(mp4|webm|mov|m4v)(\?|$)/i.test(p.image)?"video":"image", url:p.image}] : []);
      var mediaHtml = mediaArr.length ? '<div class="pmedia">' + mediaArr.slice(0,4).map(function(m){
        return m.type==="video"
          ? '<video muted loop playsinline preload="none" src="'+m.url+'"></video>'
          : '<img loading="lazy" alt="'+esc(p.name)+' — LUSSÉ Remy human hair" src="'+m.url+'">';
      }).join("") + '</div>' : "";
      var img = mediaArr[0] ? mediaArr[0].url : "";
      var lens=(p.lengths||[]).map(function(l){return '<span>'+esc(l)+'</span>'}).join("");
      html+='<article class="pcard" id="p-'+p.id+'">'+ mediaHtml +
        '<div class="method">'+esc(p.method||"Hair extensions")+'</div>'+
        '<h3>'+esc(p.name)+'</h3>'+
        '<div class="price">'+esc(price)+' <small>from</small></div>'+
        '<p class="desc">'+esc(p.shortDesc||"")+'</p>'+
        (lens?'<div class="lengths">'+lens+'</div>':'')+
        (p.fitTime||p.wearTime?'<dl>'+(p.fitTime?'<dt>Fitting</dt><dd>'+esc(p.fitTime)+'</dd>':'')+(p.wearTime?'<dt>Wear</dt><dd>'+esc(p.wearTime)+'</dd>':'')+'</dl>':'')+
        '<a class="buy" href="https://wa.me/'+wa+'?text='+text+'" target="_blank" rel="noopener">Order via WhatsApp →</a>'+
      '</article>';
      // JSON-LD Product schema
      var offer={"@type":"Offer","priceCurrency":cur,"price":p.priceFrom,"availability":"https://schema.org/InStock","url":"https://lussehair.com/#p-"+p.id,"areaServed":["AE","SA"]};
      if(p.priceTo){ offer={"@type":"AggregateOffer","priceCurrency":cur,"lowPrice":p.priceFrom,"highPrice":p.priceTo,"availability":"https://schema.org/InStock","url":"https://lussehair.com/#p-"+p.id,"areaServed":["AE","SA"]}; }
      var prod={"@context":"https://schema.org","@type":"Product","name":p.name,"sku":p.sku||p.id,"description":p.longDesc||p.shortDesc||"","brand":{"@type":"Brand","name":"LUSSÉ"},"category":"Hair extensions","offers":offer}; if(img) prod.image=img; schema.push(prod);
    });
    grid.innerHTML=html;
    var s=document.getElementById("productsSchema");
    if(s) s.textContent=JSON.stringify(schema);
  }catch(e){ console.warn("products load failed",e); }
  function esc(s){return String(s||"").replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
})();
