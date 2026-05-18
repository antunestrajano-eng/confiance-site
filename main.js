(function(){

  // ── Header scroll ──
  var header = document.getElementById('header');
  if(header){
    window.addEventListener('scroll', function(){
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, {passive: true});
  }

  // ── Mobile menu ──
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('navMobile');
  if(btn && nav){
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if(!('IntersectionObserver' in window)) return;

  // ── Contadores animados ──
  // Usa requestAnimationFrame para não bloquear a thread principal (fix: reflow forçado)
  function animateCounter(el){
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = 0;
    var startTime = null;
    var duration = 1800;

    function step(timestamp){
      if(!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutQuart para desacelerar no final
      var eased = 1 - Math.pow(1 - progress, 4);
      var value = Math.floor(eased * target);
      // Arredonda centenas para números grandes (ex: 1200+)
      if(target >= 1000) value = Math.floor(value / 100) * 100;
      el.textContent = value + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  var statsBar = document.querySelector('.stats-bar');
  if(statsBar){
    var counterTriggered = false;
    new IntersectionObserver(function(entries, obs){
      if(entries[0].isIntersecting && !counterTriggered){
        counterTriggered = true;
        document.querySelectorAll('.count').forEach(animateCounter);
        obs.disconnect();
      }
    }, {threshold: 0.3}).observe(statsBar);
  }

  // ── Fade-in on scroll ──
  var fadeEls = document.querySelectorAll('.stat-card,.step,.service-card,.portfolio-item,.tcard,.acs-card,.contact-card');
  // Agrupa leituras de estilo fora do loop para evitar reflow forçado
  fadeEls.forEach(function(el){
    el.style.cssText += 'opacity:0;transform:translateY(24px);transition:opacity 0.55s ease,transform 0.55s ease';
  });
  var fadeObs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  fadeEls.forEach(function(el){ fadeObs.observe(el); });

  // ── Lazy load iframes Instagram ──
  // Só carrega quando entra na tela (200px antes), reduz payload inicial
  var iframeObs = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el = entry.target;
        var src = el.getAttribute('data-src');
        if(src){ el.src = src; el.removeAttribute('data-src'); }
        obs.unobserve(el);
      }
    });
  }, {rootMargin: '200px 0px'});

  document.querySelectorAll('iframe[data-src]').forEach(function(iframe){
    iframeObs.observe(iframe);
  });

})();
