// Header scroll effect
(function(){
  var header = document.getElementById('header');
  if(header){
    window.addEventListener('scroll', function(){
      if(window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, {passive: true});
  }

  // Mobile menu
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

  // Counter animation
  function animateCounters(){
    document.querySelectorAll('.count').forEach(function(el){
      var target = parseInt(el.getAttribute('data-target'), 10);
      var start = 0;
      var duration = 1800;
      var step = target / (duration / 16);
      var timer = setInterval(function(){
        start += step;
        if(start >= target){ start = target; clearInterval(timer); }
        el.textContent = Math.floor(start) + (el.parentElement.nextElementSibling && el.parentElement.nextElementSibling.textContent.includes('%') ? '' : '');
        // check suffix
        var suffix = el.getAttribute('data-suffix') || '';
        el.textContent = Math.floor(start) + suffix;
      }, 16);
    });
  }

  // Trigger counters when stats bar visible
  var statsBar = document.querySelector('.stats-bar');
  if(statsBar && 'IntersectionObserver' in window){
    var triggered = false;
    var obs = new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting && !triggered){
        triggered = true;
        animateCounters();
      }
    }, {threshold: 0.3});
    obs.observe(statsBar);
  }

  // Fade-in on scroll
  if('IntersectionObserver' in window){
    var fadeEls = document.querySelectorAll('.stat-card, .step, .service-card, .portfolio-item, .tcard, .acs-card, .contact-card');
    fadeEls.forEach(function(el){ el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'; });
    var fadeObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {threshold: 0.12});
    fadeEls.forEach(function(el){ fadeObs.observe(el); });
  }
})();
