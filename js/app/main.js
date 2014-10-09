function Main() {
  this.log = debug('horacat:main');
  this.logv = debug('horacat:main:verbose');

  this.logv('loading modules');

  this.storage = new Storage();
}

Main();

// TODO: refactor
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

function getUniqueId(user, project, issue) {
  if (!user) user = getUser();
  if (!project) project = getProject();
  if (!issue) issue = getIssue();

  var uniqueId = user + project + issue;
  var shaObj = new jsSHA(uniqueId, "TEXT");
  var hash = shaObj.getHash("SHA-1", "HEX");
  logv('getUniqueId hashing:', uniqueId, '->', hash);

  return hash;
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

  $('.gh-header-actions').prepend('<div class="gh-header-horacat" style="float: left; display: inline-block;"><span id="horacat-toggle" class="minibutton with-count">Start Timer</span><span id="horacat-timer" class="social-count">00:00:00</span></div>');
  this.timer = document.getElementById('horacat-timer'); // timer object
  this.$ = $('.gh-header-horacat'); // jQuery object

  this.started = false;

  this.user = user;
  this.project = project;
  this.issue = issue;
  this.uniqueId = getUniqueId(user, project, issue);

  var lsData = localStorage.getItem('horacat.timer.' + this.uniqueId);
  try {
    lsData = JSON.parse(lsData);
  } catch (err) {
    lsData = null;
  }
  if (lsData && lsData.loggedTime) {
    this.loggedTime = lsData.loggedTime;
    this.startTime = (new Date() - this.loggedTime);
    this.update();
  }

  var _this = this;
  this.$.click(function() {
    _this.logv('clicked');
    if (_this.started) {
      _this.stop();
    } else {
      _this.start();
    }
  });

  $(window).unload(function(){
    _this.stop();
  });

  this.log('initialized');
}

HoracatButton.prototype.update = function update() {
  var time = formatMs(new Date() - this.startTime);
  this.timer.innerHTML = time;

  if (this.started) this.$.find('#horacat-toggle').text('Stop Timer');
  else this.$.find('#horacat-toggle').text('Start Timer');
};

HoracatButton.prototype.store = function store() {
  var name = "horacat.timer." + this.uniqueId;
  var data = {
    startTime: this.startTime,
    loggedTime: this.loggedTime
  };
  localStorage.setItem(name, JSON.stringify(data));
  this.log('stored:', name, '->', data);
};

HoracatButton.prototype.start = function start() {
  this.started = true;

  if (!this.loggedTime) {
    this.startTime = new Date();
  } else {
    this.startTime = new Date() - this.loggedTime;
  }

  this.store();

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

  this.store();

  clearInterval(this.interval);
  this.logv('stopped:', this.loggedTime);
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