var standardCodes = ['LKR103', 'LKR104', 'LKR105', 'LKR106', 'LKR107', 'LKR108', 'LKR109', 'LKR110', 'LKR111', 'LKR112', 'LKR113', 'LKR114', 'LKR115', 'LKR116'];
var premiumCodes = ['special', 'special'];
// store of currently available codes
var codePool = [];
/* Time at which a new set of premiumCodes will be added to the
 * codePool array.
 * Ensures that at least one hour has passed and all current codes
 * in the codePool have been used before new premiumCodes are added.
 */
var premiumCodeRefreshTime = null;

// App Screens
var welcomeScreen = document.getElementById('section-welcome');
var codeScreen = document.getElementById('section-locker-code');
var dashboard = document.getElementById('section-dashboard')

// UI Elements
var codeDismissBtn = document.getElementById('code-dismiss-btn');
var dashBtn = document.getElementById('dashboard-trigger');
var form = document.getElementById('locker-code-form');

// Dynamic Outputs
var currentLockerCode = document.getElementById('locker-code');
var codeHistory = [];


form.addEventListener('submit', function (evt) {
  evt.preventDefault();

  var email = evt.target.emailAddress.value;
  var code = getLockerCode();

  currentLockerCode.textContent = code;
  updateLocalStorage();
  updateDashboardDisplay(code, email);

  codeScreen.classList.remove('hidden');
  welcomeScreen.classList.add('hidden');
});

codeDismissBtn.addEventListener('click', function () {
  codeScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
});

dashBtn.addEventListener('click', function () {
  dashboard.classList.toggle('hidden');
});

function getLockerCode() {
  var rand = Math.floor(Math.random() * codePool.length);

  if (codePool.length === 0) {
    refreshLockerCodes();
  }

  return codePool.splice(rand, 1)[0];
}

function refreshLockerCodes() {
  var currentTime = new Date();

  codePool = standardCodes.slice();

  if (currentTime > premiumCodeRefreshTime) {
    codePool = codePool.concat(premiumCodes);
    premiumCodeRefreshTime = new Date( currentTime );
    premiumCodeRefreshTime.setHours( currentTime.getHours() + 1);
  }
}

function updateDashboardDisplay(code, email) {
  codeHistory.unshift({ code: code, email: email });
  console.log(JSON.stringify(codeHistory));
}

function updateLocalStorage() {

}
