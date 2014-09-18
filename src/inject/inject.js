var log = debug('horacat'),
    logv = debug('horacat:verbose');

debug.enable('horacat,horacat:*'); // TODO: make settable in options

function stripUrl() {
  return window.location.href.replace(/\#.*?$/, '');
}

function getIssue() {
  var issue_url = /github.com\/(.*?)\/(issues|pull)\/(\d+)$/.exec(stripUrl());
  if (!issue_url) {
    return;
  } else {
    var issue_string = issue_url[1] + '#' + issue_url[3];
    var shaObj = new jsSHA(issue_string, "TEXT");
    var hash = shaObj.getHash("SHA-1", "HEX");
    logv('getIssue hashing:', issue_string, '->', hash);
    return hash;
  }
}

function getProject() {
  var project_url = /github.com\/(.*?)\/(issues|pull)\/(\d+)$/.exec(stripUrl());
  if (!project_url) {
    return;
  } else {
    var shaObj = new jsSHA(project_url[1], "TEXT");
    var hash = shaObj.getHash("SHA-1", "HEX");
    logv('getProject hashing:', project_url[1], '->', hash);
    return hash;
  }
}

function getUser() {
  var user = $('.name').find('img').attr('data-user'); // FIXME: too insecure?
  if (!user) {
    return;
  } else {
    var shaObj = new jsSHA(user, "TEXT");
    var hash = shaObj.getHash("SHA-1", "HEX");
    logv('getUser hashing:', user, '->', hash);
    return hash;
  }
}

function init(user, project, issue) {
  log('user:', user);
  log('project:', project);
  log('issue:', issue);
  $('.gh-header-actions').prepend('<a href="/caffeinery/coffea/issues/new" class="minibutton primary" data-hotkey="t">Start timer</a>');
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