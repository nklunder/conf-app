// App Screens
var appShell = document.getElementById('shell');
var welcomeScreen = document.getElementById('section-welcome');
var codeScreen = document.getElementById('section-locker-code');
var adminPanel = document.getElementById('section-admin')

// UI Elements
  // global
  var adminBtn = document.getElementById('admin-toggle');
  var fullscreenBtn = document.getElementById('fullscreen-toggle');
  var loader = document.getElementById('loader');
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
   * codePool array. Delay is set inside of updateRefreshTime
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

    clearData: function () {
      localStorage.clear();
      emailsArray = [];
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
      var currentTime = new Date().getTime();
      var refreshTime = data.getPremiumRefreshTime().getTime();

      if (currentTime > refreshTime) {
        this.refillAllCodes();
      } else {
        this.refillStandardCodes();
      }
    },

    refillStandardCodes: function () {
      codePool = standardCodes.slice();
    },

    refillAllCodes: function () {
      /* Add an extra copy of the standard codes with the premium codes.
       * This is to decrease the probability that premium codes will be
       * picked too quickly.
       */
      codePool = codePool.concat(standardCodes, standardCodes, premiumCodes);
      data.updateRefreshTime();
      console.log(codePool);
    }
  };
}());

form.addEventListener('submit', formHandler);
codeDismissBtn.addEventListener('click', transitionToWelcomeScreen);
adminBtn.addEventListener('click', toggleAdminPanel);
wipeDataBtn.addEventListener('click', wipeData);
fullscreenBtn.addEventListener('click', toggleFullscreen);
refillCodesBtn.addEventListener('click', function () {
  locker.refillAllCodes();
  refreshAdminDisplay();
});
sendMailBtn.addEventListener('click', function (e) {
  var emailBody = data.getEmails().join('%0D%0A');
  e.target.href = 'mailto:?subject=Trade%20In%20Emails&body=' + emailBody;
})

function formHandler(evt) {
  evt.preventDefault();

  var email = evt.target.emailAddress.value;
  var isNewAddress = true;

  // only update emails array if address was entered and not already in the list
  if (email && data.getEmails().indexOf(email) === -1) {
    data.addEmail(email);
    currentCode.textContent = locker.getRandom();
  } else {
    isNewAddress = false;
  }

  evt.target.emailAddress.value = '';

  transitionToCodeScreen(isNewAddress);
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

function transitionToCodeScreen(isNewAddress) {
  var loadTime = Math.floor(Math.random() * (700 - 300)) + 300;
  var nextScreen = undefined;

  loader.classList.remove('hidden');
  welcomeScreen.classList.add('hidden');

  if (isNewAddress) {
    setTimeout(showCodeScreen, loadTime);
  } else {
    setTimeout(showErrorScreen, loadTime);
  }


  function showCodeScreen() {
    loader.classList.add('hidden');
    codeScreen.classList.remove('hidden');
  }

  function showErrorScreen() {
    loader.classList.add('hidden');
    errorScreen.classList.remove('hidden');
  }
}

function transitionToWelcomeScreen() {
  // clear code value to ensure nothing shows on code screen if invalid address was entered
  currentCode.textContent = '';
  errorScreen.classList.add('hidden');
  codeScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
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
    data.clearData();
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
