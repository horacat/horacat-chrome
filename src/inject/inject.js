var log = debug('horacat'),
    logv = debug('horacat:verbose');

// TODO: make settable in options
var verbosity = 3;
switch (verbosity) {
  case 0:
    debug.enable('horacat');
    break;
  case 1:
    debug.enable('horacat,horacat:*,-horacat:verbose,-horacat:*:verbose');
    break;
  case 2:
    debug.enable('horacat,horacat:*,-horacat:*:verbose');
    break;
  case 3:
    debug.enable('horacat,horacat:*');
    break;
}

function stripUrl() {
  return window.location.href.replace(/\#.*?$/, '');
}

function getMetaData(name) {
  return $('meta[name="octolytics-' + name + '"]').attr('content');
}

function getIssue() {
  var issue = $('input[name="thread_id"]').val();
  if (!issue) {
    return;
  } else {
    var shaObj = new jsSHA(issue, "TEXT");
    var hash = shaObj.getHash("SHA-1", "HEX");
    logv('getIssue hashing:', issue, '->', hash);
    return hash;
  }
}

function getProject() {
  var project = getMetaData('dimension-repository_id');
  if (!project) {
    return;
  } else {
    var shaObj = new jsSHA(project, "TEXT");
    var hash = shaObj.getHash("SHA-1", "HEX");
    logv('getProject hashing:', project, '->', hash);
    return hash;
  }
}

function getUser() {
  var user = getMetaData('actor-hash'); // FIXME: too insecure?
  if (!user) {
    return;
  } else {
    var shaObj = new jsSHA(user, "TEXT");
    var hash = shaObj.getHash("SHA-1", "HEX");
    logv('getUser hashing:', user, '->', hash);
    return hash;
  }
}

function formatMs(s) {

  function addZ(n) {
    return (n<10? '0':'') + n;
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs);
}

function HoracatButton(user, project, issue) {
  this.log = debug('horacat:button');
  this.logv = debug('horacat:button:verbose');

  $('.gh-header-actions').prepend('<div class="gh-header-horacat" style="float: left; display: inline-block;"><span class="minibutton with-count">Log time</span><span id="horacat-timer" class="social-count">00:00:00</span></div>');
  this.timer = document.getElementById('horacat-timer'); // timer object
  this.$ = $('.gh-header-horacat'); // jQuery object

  this.started = false;

  var _this = this;
  this.$.click(function() {
    _this.logv('clicked');
    if (_this.started) _this.stop();
    else _this.start();
  });
  this.log('initialized');
}

HoracatButton.prototype.update = function update() {
  var time = formatMs(new Date() - this.startTime);
  this.timer.innerHTML = time;
};

HoracatButton.prototype.start = function start() {
  this.started = true;

  if (!this.loggedTime) {
    this.startTime = new Date();
  } else {
    this.startTime = new Date() - this.loggedTime;
  }

  var _this = this;
  this.interval = setInterval(function () {
    _this.update();
  }, 1000);
  this.log('started:', this.startTime);
  this.update();
};

HoracatButton.prototype.stop = function stop() {
  this.started = false;

  this.loggedTime = new Date() - this.startTime;
  clearInterval(this.interval);
  this.log('stopped:', this.loggedTime);
};

function init(user, project, issue) {
  log('user:', user);
  log('project:', project);
  log('issue:', issue);
  var button = new HoracatButton(user, project, issue);
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

    var user = getUser();
    var project = getProject();
    var issue = getIssue();

    if (!user || !project || !issue) {
      log('not logged in or no issue available, disabling time tracking');
    } else {
      init(user, project, issue);
    }
	}
	}, 10);
});