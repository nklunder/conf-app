// App Screens
var appShell = document.getElementById('shell');
var welcomeScreen = document.getElementById('section-welcome');
var codeScreen = document.getElementById('section-locker-code');
var adminPanel = document.getElementById('section-admin')

// UI Elements
  // global
  var adminBtn = document.getElementById('admin-toggle');
  var fullscreenBtn = document.getElementById('fullscreen-toggle');
  // welcome screen
  var form = document.getElementById('locker-code-form');
  // locker code screen
  var codeDismissBtn = document.getElementById('code-dismiss-btn');
  // admin panel
  var sendMailBtn = document.getElementById('send-mail-btn');
  var refillCodesBtn = document.getElementById('refill-codes-btn');
  var wipeDataBtn = document.getElementById('clear-storage-btn');

// UI Outputs
  // locker code screen
  var currentCode = document.getElementById('locker-code');
  // admin panel
  var timeUntilRefresh = document.getElementById('time-until-refresh');
  var totalEmails = document.getElementById('total-emails');


var data = (function () {
  /* Time at which a new set of premiumCodes will be added to the
   * codePool array. Delay is set inside of locker.refillPremiumCodes
   */
  var premiumRefreshTime = verifyDate(localStorage.getItem('refillTime')) || new Date();
  var emailsArray = JSON.parse(localStorage.getItem('emails')) || [];

  return {
    getEmails: function () {
      return emailsArray;
    },

    addEmail: function (emailAddress) {
      emailsArray.push(emailAddress);
      localStorage.setItem('emails', JSON.stringify(emailsArray));
    },

    getPremiumRefreshTime: function () {
      return premiumRefreshTime;
    },

    getTimeUntilRefresh: function () {
      return Math.floor(((premiumRefreshTime.getTime() - Date.now()) / 1000) / 60);
    },

    updateRefreshTime: function () {
      premiumRefreshTime = new Date();
      premiumRefreshTime.setHours(premiumRefreshTime.getHours() + 1);
      localStorage.setItem('refillTime', premiumRefreshTime);
    },

    resetAll: function () {
      localStorage.clear();
      emailsArray = [];
      premiumRefreshTime = null;
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
      if (codePool.length === 0) { this.refillStandardCodes(); }
      var rand = Math.floor(Math.random() * codePool.length);
      return codePool.splice(rand, 1)[0];
    },

    refillStandardCodes: function () {
      var currentTime = new Date().getTime();
      var refreshTime = data.getPremiumRefreshTime().getTime();

      codePool = standardCodes.slice();

      if (currentTime > refreshTime) {
        this.refillPremiumCodes();
      }
    },

    refillPremiumCodes: function () {
      codePool = codePool.concat(premiumCodes);
      data.updateRefreshTime()
    },

    refillAllCodes: function () {
      this.refillStandardCodes();
      this.refillPremiumCodes();
    }
  };
}());

form.addEventListener('submit', formHandler);
adminBtn.addEventListener('click', toggleAdminPanel);
wipeDataBtn.addEventListener('click', wipeData);
fullscreenBtn.addEventListener('click', toggleFullscreen);
refillCodesBtn.addEventListener('click', function () {
  locker.refillPremiumCodes;
  refreshAdminDisplay();
});
sendMailBtn.addEventListener('click', function (e) {
  var emailBody = emailsArray.join('%0D%0A');
  e.target.href = 'mailto:?subject=Trade%20In%20Emails&body=' + emailBody;
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

  // only update emails array if address was entered
  if (email) {
    data.addEmail(email);
  }

  welcomeScreen.classList.add('hidden');
  codeScreen.classList.remove('hidden');

  evt.target.emailAddress.value = '';

  // refreshAdminDisplay();
}

function refreshAdminDisplay() {
  var emailList = document.getElementById('stored-emails');
  var emailArray = data.getEmails();
  var listHTML = emailArray.map(function(email) {
    return '<li>' + email + '</li>';
  }).join('');

  timeUntilRefresh.textContent = 'in ' + data.getTimeUntilRefresh() + ' minutes';
  totalEmails.textContent = 'total: ' + emailArray.length;
  emailList.innerHTML = listHTML;
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

function verifyDate(storedDate) {
  var time = Date.parse(storedDate)

  if (!isNaN(time)) {
    return new Date(time);
  }

  return false;
}
