/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 1.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Code also contributed by Greg Holt
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF)
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xFFFF)
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt))
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function cmn(q, a, b, x, s, t)
{
  return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t)
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t)
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t)
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t)
}

/*
 * Calculate the MD5 of an array of little-endian words, producing an array
 * of little-endian words.
 */
function coreMD5(x)
{
  var a =  1732584193
  var b = -271733879
  var c = -1732584194
  var d =  271733878

  for(i = 0; i < x.length; i += 16)
  {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936)
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586)
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819)
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330)
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897)
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426)
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341)
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983)
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416)
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417)
    c = ff(c, d, a, b, x[i+10], 17, -42063)
    b = ff(b, c, d, a, x[i+11], 22, -1990404162)
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682)
    d = ff(d, a, b, c, x[i+13], 12, -40341101)
    c = ff(c, d, a, b, x[i+14], 17, -1502002290)
    b = ff(b, c, d, a, x[i+15], 22,  1236535329)

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510)
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632)
    c = gg(c, d, a, b, x[i+11], 14,  643717713)
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302)
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691)
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083)
    c = gg(c, d, a, b, x[i+15], 14, -660478335)
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848)
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438)
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690)
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961)
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501)
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467)
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784)
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473)
    b = gg(b, c, d, a, x[i+12], 20, -1926607734)

    a = hh(a, b, c, d, x[i+ 5], 4 , -378558)
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463)
    c = hh(c, d, a, b, x[i+11], 16,  1839030562)
    b = hh(b, c, d, a, x[i+14], 23, -35309556)
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060)
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353)
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632)
    b = hh(b, c, d, a, x[i+10], 23, -1094730640)
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174)
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222)
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979)
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189)
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487)
    d = hh(d, a, b, c, x[i+12], 11, -421815835)
    c = hh(c, d, a, b, x[i+15], 16,  530742520)
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651)

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844)
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415)
    c = ii(c, d, a, b, x[i+14], 15, -1416354905)
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055)
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571)
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606)
    c = ii(c, d, a, b, x[i+10], 15, -1051523)
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799)
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359)
    d = ii(d, a, b, c, x[i+15], 10, -30611744)
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380)
    b = ii(b, c, d, a, x[i+13], 21,  1309151649)
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070)
    d = ii(d, a, b, c, x[i+11], 10, -1120210379)
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259)
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551)

    a = safe_add(a, olda)
    b = safe_add(b, oldb)
    c = safe_add(c, oldc)
    d = safe_add(d, oldd)
  }
  return [a, b, c, d]
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = "0123456789abcdef"
  var str = ""
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8)) & 0xF)
  }
  return str
}

/*
 * Convert an array of little-endian words to a base64 encoded string.
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  var str = ""
  for(var i = 0; i < binarray.length * 32; i += 6)
  {
    str += tab.charAt(((binarray[i>>5] << (i%32)) & 0x3F) |
                      ((binarray[i>>5+1] >> (32-i%32)) & 0x3F))
  }
  return str
}

/*
 * Convert an 8-bit character string to a sequence of 16-word blocks, stored
 * as an array, and append appropriate padding for MD4/5 calculation.
 * If any of the characters are >255, the high byte is silently ignored.
 */
function str2binl(str)
{
  var nblk = ((str.length + 8) >> 6) + 1 // number of 16-word blocks
  var blks = new Array(nblk * 16)
  for(var i = 0; i < nblk * 16; i++) blks[i] = 0
  for(var i = 0; i < str.length; i++)
    blks[i>>2] |= (str.charCodeAt(i) & 0xFF) << ((i%4) * 8)
  blks[i>>2] |= 0x80 << ((i%4) * 8)
  blks[nblk*16-2] = str.length * 8
  return blks
}

/*
 * Convert a wide-character string to a sequence of 16-word blocks, stored as
 * an array, and append appropriate padding for MD4/5 calculation.
 */
function strw2binl(str)
{
  var nblk = ((str.length + 4) >> 5) + 1 // number of 16-word blocks
  var blks = new Array(nblk * 16)
  for(var i = 0; i < nblk * 16; i++) blks[i] = 0
  for(var i = 0; i < str.length; i++)
    blks[i>>1] |= str.charCodeAt(i) << ((i%2) * 16)
  blks[i>>1] |= 0x80 << ((i%2) * 16)
  blks[nblk*16-2] = str.length * 16
  return blks
}

/*
 * External interface
 */
function hexMD5 (str) { return binl2hex(coreMD5( str2binl(str))) }
function hexMD5w(str) { return binl2hex(coreMD5(strw2binl(str))) }
function b64MD5 (str) { return binl2b64(coreMD5( str2binl(str))) }
function b64MD5w(str) { return binl2b64(coreMD5(strw2binl(str))) }
/* Backward compatibility */
function calcMD5(str) { return binl2hex(coreMD5( str2binl(str))) }

  // Ajoutez ce code dans la section <script>
  document.getElementById('notificationBtn').addEventListener('click', function() {
    const panel = document.getElementById('notificationPanel');
    if (!panel) {
        createNotificationPanel();
    } else {
        panel.classList.toggle('active');
    }
});

function createNotificationPanel() {
    const panel = document.createElement('div');
    panel.id = 'notificationPanel';
    panel.className = 'notification-panel';
    
    // Exemple de notifications (à remplacer par des données réelles)
    panel.innerHTML = `
        <div class="notification-item unread">
            <div class="notification-title">Maintenance du systeme en cour</div>
            <div class="notification-message">Une maintenance du systeme de payment est en cours Merci de contactez l'asitanc et l'aisser les messages de payement momo deja effectuer .</div>
            <div class="notification-time">Il y a 2 heures</div>
        </div>
        <div class="notification-item">
            <div class="notification-title">Nouveau forfait disponible</div>
            <div class="notification-message">Découvrez notre nouveau forfait 1 mois avec compte Netflix !</div>
            <div class="notification-time">Hier</div>
        </div>
        <div class="notification-item">
            <div class="notification-title">Bienvenue sur notre réseau</div>
            <div class="notification-message">Merci d'utiliser nos services WiFi.</div>
            <div class="notification-time">3 jours</div>
        </div>
    `;
    
    document.body.appendChild(panel);
    setTimeout(() => {
        panel.classList.add('active');
    }, 10);
    
    // Mettre à jour le badge
    updateNotificationBadge(2);
}

function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}
// Ajoutez dans la section <script>
    document.addEventListener('DOMContentLoaded', function() {
    // Afficher le modal au chargement
    setTimeout(() => {
        document.getElementById('companyModal').style.display = 'flex';
    }, 500);

    // Fermer le modal
    document.querySelector('.close-company-modal').addEventListener('click', function() {
        document.getElementById('companyModal').style.display = 'none';
    });
});

// Dans le header, remplacez le h1 par un bouton pour réafficher le modal
document.querySelector('.logo-title h1').outerHTML = `
    <button id="showCompanyName" style="background: none; border: none; cursor: pointer;">
        <span style="font-family: 'Blacksword', cursive; font-size: 1.2rem; color: var(--primary-dark)">J+ Wifi Zone</span>
    </button>
`;

document.getElementById('showCompanyName').addEventListener('click', function() {
    document.getElementById('companyModal').style.display = 'flex';
});

// Fermer le panel quand on clique ailleurs
document.addEventListener('click', function(e) {
    const panel = document.getElementById('notificationPanel');
    if (panel && !e.target.closest('#notificationBtn') && !e.target.closest('#notificationPanel')) {
        panel.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function() {
  // Détection de la langue
  setLanguage();
  
  // Dark Mode amélioré
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const icon = darkModeToggle.querySelector('i');
  
  // Vérifier la préférence système
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Vérifier le localStorage ou la préférence système
  if (localStorage.getItem('darkMode') === 'dark' || (!localStorage.getItem('darkMode') && prefersDark)) {
      body.classList.add('dark-mode');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
  }
  
  darkModeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      const isDarkMode = body.classList.contains('dark-mode');
      
      if (isDarkMode) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
      } else {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
      }
      
      localStorage.setItem('darkMode', isDarkMode ? 'dark' : 'light');
  });
  
  // Onglets avec animation
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');
  
  authTabs.forEach(tab => {
      tab.addEventListener('click', function() {
          authTabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          
          const tabType = this.dataset.tab;
          authForms.forEach(form => {
              if (form.dataset.type === tabType) {
                  form.classList.remove('hidden');
                  form.style.opacity = 0;
                  form.style.transform = 'translateY(10px)';
                  setTimeout(() => {
                      form.style.opacity = 1;
                      form.style.transform = 'translateY(0)';
                  }, 10);
              } else {
                  form.classList.add('hidden');
              }
          });
      });
  });
  
  // Auto-remplissage mot de passe
  document.querySelector('#code-input')?.addEventListener('input', function() {
      document.getElementById('password').value = this.value;
  });
  
  // Gestion des erreurs avec redirection
  const errorMap = {
      'already logged in': 'Vous êtes déjà connecté',
      'invalid credentials': 'Identifiants incorrects',
      'session limit reached': 'Limite de session atteinte',
      'atteint le délai': 'Temps de connexion expiré',
      'limite de circulation': 'Quota de données atteint'
  };

  const error = "$(error)";
  if(error) {
      const friendlyError = errorMap[error.toLowerCase()] || error;
      showErrorNotification(friendlyError);
      
      if(error.includes("atteint le délai")) {
          window.location.href = "./isolir.html";
      } else if(error.includes("limite de circulation")) {
          window.location.href = "./isolir-kuota.html";
      }
  }
  
  // Animation au chargement
  setTimeout(() => {
      document.querySelector('.login-container').style.opacity = 1;
      document.getElementById('feedbackBtn').classList.remove('hidden');
  }, 50);
  
  // Amélioration mobile - empêcher le zoom sur les inputs
  document.addEventListener('touchstart', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
          window.scrollTo(0, 0);
          document.body.style.zoom = '1.0';
      }
  }, false);
  
  // Gestion des modals
  document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
          document.querySelectorAll('.modal').forEach(m => {
              m.classList.add('hidden');
              m.style.opacity = 0;
          });
      });
  });

  // Système de notation
  document.querySelectorAll('[data-rating]').forEach(star => {
      star.addEventListener('click', function() {
          const rating = parseInt(this.dataset.rating);
          const stars = document.querySelectorAll('[data-rating]');
          
          stars.forEach((s, index) => {
              if(index < rating) {
                  s.classList.add('active');
                  s.classList.remove('far');
                  s.classList.add('fas');
              } else {
                  s.classList.remove('active');
                  s.classList.add('far');
                  s.classList.remove('fas');
              }
          });
      });
  });

  // Bouton d'achat
  document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', function() {
          const plan = this.closest('.ticket-card').querySelector('.ticket-header').textContent;
          document.getElementById('selectedPlan').textContent = plan;
          const modal = document.getElementById('paymentModal');
          modal.classList.remove('hidden');
          modal.style.opacity = 1;
      });
  });

  // Méthodes de paiement
  document.querySelectorAll('.payment-method').forEach(method => {
      method.addEventListener('click', function() {
          alert(`Paiement pour ${document.getElementById('selectedPlan').textContent} via ${this.dataset.method} sera implémenté ici`);
      });
  });

  // Feedback
  document.getElementById('feedbackBtn').addEventListener('click', function() {
      const modal = document.getElementById('feedbackModal');
      modal.classList.remove('hidden');
      modal.style.opacity = 1;
  });

  document.querySelector('.submit-feedback').addEventListener('click', function() {
      const feedback = document.getElementById('feedbackText').value;
      const rating = document.querySelectorAll('[data-rating].active').length;
      
      if(rating > 0) {
          alert(`Merci pour votre feedback! Note: ${rating}/5`);
          document.getElementById('feedbackModal').classList.add('hidden');
      } else {
          alert('Veuillez donner une note');
      }
  });

  // Redirection intelligente après connexion
  const dst = new URLSearchParams(window.location.search).get('dst');
  if(dst && dst !== '$(link-orig)') {
      window.location.href = dst;
  }

  // Démarrer le timer de session si connecté
  if("$(logged-in)" === "yes") {
      const remainingTime = parseInt("$(uptime)") || 3600; // 1h par défaut
      updateSessionTimer(remainingTime);
  }
});

// Détection de la langue du navigateur
function setLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  const lang = userLang.split('-')[0];
  const supportedLangs = ['fr', 'en'];
  
  if(supportedLangs.includes(lang)) {
      document.documentElement.lang = lang;
  }
}

// Suivi des connexions
function trackLogin(method) {
  const data = {
      method: method,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenRes: `${window.screen.width}x${window.screen.height}`
  };
  
  // Envoyer ces données à votre backend
  fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  }).catch(() => {});
}

// Compte à rebours de session
function updateSessionTimer(seconds) {
  const timerElement = document.createElement('div');
  timerElement.id = 'session-timer';
  timerElement.style.position = 'fixed';
  timerElement.style.bottom = '20px';
  timerElement.style.right = '20px';
  timerElement.style.background = 'var(--primary)';
  timerElement.style.color = 'white';
  timerElement.style.padding = '10px 15px';
  timerElement.style.borderRadius = '20px';
  timerElement.style.zIndex = '1000';
  timerElement.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  
  document.body.appendChild(timerElement);
  
  const interval = setInterval(() => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerElement.textContent = `Temps restant: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
      
      if(seconds <= 300) { // 5 minutes restantes
          timerElement.style.background = 'var(--danger)';
      }
      
      if(seconds <= 0) {
          clearInterval(interval);
          timerElement.textContent = 'Session expirée!';
          setTimeout(() => {
              window.location.reload();
          }, 2000);
      }
      seconds--;
  }, 1000);
}

function showErrorNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'error-notification';
  notification.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
      notification.remove();
  }, 5000);
}

// Demande la permission pour les notifications
function requestNotificationPermission() {
  if('Notification' in window) {
      Notification.requestPermission().then(permission => {
          if(permission === 'granted') {
              console.log('Permission accordée');
          }
      });
  }
}

// Exemple d'utilisation
function showNotification(title, message) {
  if('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
  }
}
// Auto-scroll du carousel
setInterval(() => {
const carousel = document.getElementById('productCarousel');
if (carousel) {
const scrollAmount = 260; // largeur d'une carte + marge
carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });

if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5) {
  setTimeout(() => {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
  }, 2000);
}
}
}, 3000);