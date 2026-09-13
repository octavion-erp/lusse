
(async function(){
  try{
    var r=await fetch("/api/settings?t="+Date.now(),{cache:"no-store"});
    if(!r.ok)return;
    var s=await r.json();
    // Update all wa.me links
    if(s.whatsapp){
      document.querySelectorAll('a[href*="wa.me/"]').forEach(function(a){
        a.href=a.href.replace(/wa\.me\/[^?#]+/,"wa.me/"+s.whatsapp);
      });
    }
    // Update tel: links
    if(s.phone){
      var t=s.phone.replace(/[^\d+]/g,"");
      document.querySelectorAll('a[href^="tel:"]').forEach(function(a){a.href="tel:"+t});
      document.querySelectorAll('[data-phone]').forEach(function(el){el.textContent=s.phone});
    }
    // Update mailto links
    if(s.email){
      document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){a.href="mailto:"+s.email});
      document.querySelectorAll('[data-email]').forEach(function(el){el.textContent=s.email});
    }
    // Update Instagram links
    if(s.social && s.social.instagram){
      document.querySelectorAll('a[href*="instagram.com/"]').forEach(function(a){a.href=s.social.instagram});
    }
    // Attach the announcement bar phone
    if(s.phone){
      var bar=document.querySelector('.tb-msg');
      if(bar){bar.innerHTML=bar.innerHTML.replace(/\+971\s*54\s*200\s*5442/g,s.phone)}
    }
  }catch(e){}
})();
