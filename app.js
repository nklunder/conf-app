var standardCodes = ['LKR103', 'LKR104', 'LKR105', 'LKR106', 'LKR107', 'LKR108', 'LKR109', 'LKR110', 'LKR111', 'LKR112', 'LKR113', 'LKR114', 'LKR115', 'LKR116'];
var premiumCodes = ['LKR101', 'LKR102'];

var welcomeScreen = document.getElementById('section-welcome');
var codeScreen = document.getElementById('section-locker-code');
var dashboard = document.getElementById('section-dashboard');

var form = document.getElementById('locker-code-form');
var codeDismissBtn = document.getElementById('code-dismiss-btn');
var dashBtn = document.getElementById('dashboard-trigger');

form.addEventListener('submit', function (evt) {
  evt.preventDefault();
  var email = evt.target.emailAddress.value;
  console.log(email);

  welcomeScreen.style.display = 'none';
  codeScreen.style.display = 'block';
});

codeDismissBtn.addEventListener('click', function () {
  codeScreen.style.display = 'none';
  welcomeScreen.style.display = 'block';
});

dashBtn.addEventListener('click', function () {
  dashboard.style.display = 'block';
});
