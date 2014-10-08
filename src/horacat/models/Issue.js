/*
{
  "project_hash": {
    "issue_hash": {
      "active": {
        "logged": 100,
        "start": 1231283
      },
      "logs": [
        { "user": "user_hash", "start": 1231283, "stop": 1231383 }
      ]
    }
  }
}
 */

// start and logged are per-user
function Timer(start, logged, logs) {
  if (logged) this.logged = logged;
  else this.logged = 0;
  if (start) this.start = start;
  else this.start = 0;
  if (logs) this.logs = logs;
}

Timer.prototype.addLog = function addLog(log) {
  if (!log instanceof Log) {
    throw new Exception("Invalid log.");
  }

  this.logs.push(log);
};