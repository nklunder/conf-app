// App Screens
var appShell = document.getElementById('shell');
var welcomeScreen = document.getElementById('section-welcome');
var codeScreen = document.getElementById('section-locker-code');
var adminPanel = document.getElementById('section-admin')

// UI Elements
var codeDismissBtn = document.getElementById('code-dismiss-btn');
var fullscreenBtn = document.getElementById('fullscreen-toggle');
var adminBtn = document.getElementById('admin-toggle');
var sendMailBtn = document.getElementById('send-mail-btn');
var wipeDataBtn = document.getElementById('clear-storage-btn');
var form = document.getElementById('locker-code-form');

// UI Outputs
var currentCode = document.getElementById('locker-code');

// Persistent Data
var data = (function () {
  /* Time at which a new set of premiumCodes will be added to the
   * codePool array. Delay is set inside of locker.refillPremiumCodes
   */
  var premiumRefillTime = Date.parse(localStorage.getItem('refillTime')) || new Date();
  var emailsArray = JSON.parse(localStorage.getItem('emails')) || [];

  return {
    getEmails: function () {
      return emailsArray;
    },

    addEmail: function (emailAddress) {
      emailsArray.push(emailAddress);
      localStorage.setItem('emails', JSON.stringify(emailsArray));
    },

    getRefreshTime: function () {
      return premiumRefillTime;
    },

    updateRefreshTime: function (delay) {
      delay = delay || 60;
      premiumRefillTime = new Date();
      premiumRefillTime.setMinutes( new Date().getMinutes() + delay);
      localStorage.setItem('refillTime', JSON.stringify(premiumRefillTime));
    },

    resetAll: function () {
      localStorage.clear();
      emailsArray = [];
      premiumRefillTime = null;
    }
  }
}());

var locker = (function () {
  var standardCodes = ['LKR101', 'LKR102', 'LKR103', 'LKR104', 'LKR105', 'LKR106', 'LKR107', 'LKR108', 'LKR109', 'LKR110', 'LKR111', 'LKR112', 'LKR113', 'LKR114'];
  var premiumCodes = ['LKR115', 'LKR116'];
  // store of currently available codes
  var codePool = [];


  return {
    getRandom: function () {
      if (codePool.length === 0) { this.refillCodes(); }
      var rand = Math.floor(Math.random() * codePool.length);
      return codePool.splice(rand, 1)[0];
    },

    refillCodes: function () {
      var currentTime = new Date();
      var refreshTime = data.getRefreshTime()

      codePool = standardCodes.slice();
      if (currentTime > refreshTime) {
        this.refillPremiumCodes();
      }
    },

    refillPremiumCodes: function () {
      codePool = codePool.concat(premiumCodes);
      data.updateRefreshTime()
    },

    getPremiumRefillTime: function () {
      return premiumRefillTime;
    },

    getPremiumRefillTimeLeft: function () {

    }
  };
}());

form.addEventListener('submit', formHandler);
adminBtn.addEventListener('click', toggleAdminPanel);
wipeDataBtn.addEventListener('click', wipeData);
fullscreenBtn.addEventListener('click', toggleFullscreen);

sendMailBtn.addEventListener('click', function (e) {
  var emailBody = emailsArray.join('%0D%0A');
  e.target.href = "mailto:?subject=Trade%20In%20Emails&body=" + emailBody;
})

codeDismissBtn.addEventListener('click', function () {
  codeScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
});

function formHandler(evt) {
  evt.preventDefault();

  var email = evt.target.emailAddress.value;
  var code = locker.getRandom();

  currentCode.textContent = code;

  data.addEmail(email);

  welcomeScreen.classList.add('hidden');
  codeScreen.classList.remove('hidden');

  evt.target.emailAddress.value = '';

  // refreshAdminDisplay();
}

function refreshAdminDisplay() {
  var output = document.getElementById('email-test');

  output.textContent = data.getEmails().join(' ');
}

function toggleFullscreen() {
  fullscreenBtn.classList.toggle('fullscreen-active');
  adminBtn.classList.toggle('hidden');

  if (document.webkitFullscreenElement) {
    document.webkitExitFullscreen();
  } else {
    appShell.webkitRequestFullscreen();
  }
}

function toggleAdminPanel() {
  // only refresh data on admin panel open
  if (adminPanel.classList.contains('hidden')) {
    refreshAdminDisplay();
  }

  fullscreenBtn.classList.toggle('hidden');
  adminPanel.classList.toggle('hidden');
  adminBtn.classList.toggle('admin-panel-open');
}

function wipeData() {
  var confirmed = confirm('Are you sure you want to permanently delete the stored data?');

  if (confirmed) {
    data.resetAll();
    refreshAdminDisplay();
  }
}
