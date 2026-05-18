// ── Executa após o DOM estar pronto (script tem defer) ──
(function(){

  // ── Header scroll effect ──
  var header = document.getElementById('header');
  if(header){
    window.addEventListener('scroll', function(){
      if(window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, {passive: true});
  }

  // ── Mobile menu ──
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('navMobile');
  if(btn && nav){
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Counter animation (acionada por IntersectionObserver) ──
  function animateCounters(){
    document.querySelectorAll('.count').forEach(function(el){
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0;
      var duration = 1800;
      var step = target / (duration / 16);
      var timer = setInterval(function(){
        start += step;
        if(start >= target){ start = target; clearInterval(timer); }
        el.textContent = (start >= 1000 ? Math.floor(start/100)*100 : Math.floor(start)) + suffix;
      }, 16);
    });
  }

  if('IntersectionObserver' in window){

    // Contadores
    var statsBar = document.querySelector('.stats-bar');
    if(statsBar){
      var triggered = false;
      new IntersectionObserver(function(entries, obs){
        if(entries[0].isIntersecting && !triggered){
          triggered = true;
          animateCounters();
          obs.disconnect();
        }
      }, {threshold: 0.3}).observe(statsBar);
    }

    // ── Fade-in on scroll ──
    var fadeEls = document.querySelectorAll('.stat-card, .step, .service-card, .portfolio-item, .tcard, .acs-card, .contact-card');
    fadeEls.forEach(function(el){
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });
    var fadeObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObs.unobserve(entry.target); // para de observar após animar
        }
      });
    }, {threshold: 0.12});
    fadeEls.forEach(function(el){ fadeObs.observe(el); });

    // ── Lazy load Instagram iframes ──
    // Substitui data-src pelo src real apenas quando o iframe entra na tela,
    // reduzindo significativamente o payload de rede inicial.
    var iframeObs = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el = entry.target;
          var lazySrc = el.getAttribute('data-src');
          if(lazySrc){
            el.src = lazySrc;
            el.removeAttribute('data-src');
          }
          obs.unobserve(el);
        }
      });
    }, {rootMargin: '200px'});

    document.querySelectorAll('iframe[data-src]').forEach(function(iframe){
      iframeObs.observe(iframe);
    });
  }

})();
