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
var clearStorageBtn = document.getElementById('clear-storage-btn');
var form = document.getElementById('locker-code-form');

// UI Outputs
var currentCode = document.getElementById('locker-code');
var emailsArray = JSON.parse(localStorage.getItem('emails')) || [];


var locker = (function () {
  var standardCodes = ['LKR101', 'LKR102', 'LKR103', 'LKR104', 'LKR105', 'LKR106', 'LKR107', 'LKR108', 'LKR109', 'LKR110', 'LKR111', 'LKR112', 'LKR113', 'LKR114'];
  var premiumCodes = ['LKR115', 'LKR116'];
  // store of currently available codes
  var codePool = [];
  /* Time at which a new set of premiumCodes will be added to the
  * codePool array. Interval is set inside of refillPremiumCodes
  */
  var premiumRefillTime =
    Date.parse(localStorage.getItem('refillTime')) || new Date();

  return {
    getRandom: function () {
      if (codePool.length === 0) { this.refillCodes(); }
      var rand = Math.floor(Math.random() * codePool.length);
      return codePool.splice(rand, 1)[0];
    },

    refillCodes: function () {
      var currentTime = new Date();
      codePool = standardCodes.slice();
      if (currentTime > premiumRefillTime) {
        this.refillPremiumCodes();
      }
    },

    refillPremiumCodes: function () {
      codePool = codePool.concat(premiumCodes);
      premiumRefillTime = new Date();
      premiumRefillTime.setHours( new Date().getHours() + 1);

      localStorage.setItem('refillTime', JSON.stringify(premiumRefillTime));
    },

    getPremiumRefillTime: function () {
      return premiumRefillTime;
    },

    getPremiumRefillTimeLeft: function () {

    }
  };
}());

form.addEventListener('submit', function (evt) {
  evt.preventDefault();

  var email = evt.target.emailAddress.value;
  var code = locker.getRandom();

  currentCode.textContent = code;

  emailsArray.push(email);
  localStorage.setItem('emails', JSON.stringify(emailsArray));

  welcomeScreen.classList.add('hidden');
  codeScreen.classList.remove('hidden');

  updateAdminPanel();
});

codeDismissBtn.addEventListener('click', function () {
  codeScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
});

adminBtn.addEventListener('click', toggleAdminPanel);

clearStorageBtn.addEventListener('click', clearData);

fullscreenBtn.addEventListener('click', toggleFullscreen);

sendMailBtn.addEventListener('click', function (e) {
  var emailBody = emailsArray.join('%0D%0A');
  e.target.href = "mailto:?subject=Trade%20In%20Emails&body=" + emailBody;
})

function updateAdminPanel() {
  var output = document.getElementById('email-test');

  output.textContent = emailsArray.join(' ');
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
  fullscreenBtn.classList.toggle('hidden');
  adminPanel.classList.toggle('hidden');
  adminBtn.classList.toggle('admin-panel-open');
}

function clearData() {
  var confirmDelete = confirm('Are you sure you want to permanently delete the stored data?');

  if (confirmDelete) {
    localStorage.clear();
    emailsArray = [];
    premiumRefillTime = null;

    updateAdminPanel();
  }
}

updateAdminPanel();
