/**
 * Represents a (GitHub) issue
 * 
 * @class
 * @param {object} config The data in the issue, see Issue.set() for more information
 */
function Issue(config) {
  this.logs = [];

  this.set(config);
}

/**
 * Set active timer of the issue
 * @param {Timer} timer Active Timer object
 */
Issue.prototype.setTimer = function setTimer(timer) {
  if (!timer instanceof Timer) {
    throw new Error('Invalid type of argument \'timer\'. Expected: Timer');
  }

  this.timer = timer;
};

/**
 * Get active timer of the issue
 * @param {boolean} raw Return raw timer data (e.g. for JSON exports)
 * @return {Timer|object} Active Timer object (or data, if raw was specified)
 */
Issue.prototype.getTimer = function getTimer(raw) {
  if (raw) {
    return this.timer.get();
  } else {
    return this.timer;
  }
};

/**
 * Add log to the issue
 * @param {Log} log Log object
 */
Issue.prototype.addLog = function addLog(log) {
  if (!log instanceof Log) {
    throw new Error('Invalid type of argument \'log\'. Expected: Log');
  }

  this.logs.push(log);
};

/**
 * Set logs of the issue
 * @param {array} logs Array of Log objects
 */
Issue.prototype.setLogs = function setLogs(logs) {
  if (!logs instanceof Array) {
    throw new Error('Invalid type of argument \'logs\'. Expected: Array');
  }

  for (var i=0; i < logs.length; i++) {
    if (!logs[i] instanceof Log) {
      throw new Error('Invalid type of argument \'logs[' + i + ']\'. Expected: Log');
    }

    this.addLog(logs[i]);
  }
};

/**
 * Get logs of the issue
 * @param {boolean} raw Return raw log data (e.g. for JSON exports)
 * @param {array} logs Array of Log objects (or array of log data, if raw was specified)
 */
Issue.prototype.getLogs = function getLogs(raw) {
  if (raw) {
    var rawLogs = [];
    for (var i=0; i < this.logs.length; i++) {
      rawLogs.push(this.logs[i].get());
    }
    return rawLogs;
  } else {
    return this.logs;
  }
};

/**
 * Get active timer of the issue
 * @param {boolean} raw Return raw timer data (e.g. for JSON exports)
 * @return {Timer|object} Active Timer object (or data, if raw was specified)
 */
Issue.prototype.getTimer = function getTimer(raw) {
  if (raw) {
    return this.timer.get();
  } else {
    return this.timer;
  }
};

/**
 * Set multiple values of the issue
 *
 * Values:
 *  - timer: see setTimer()
 *  - logs: see setLogs()
 * 
 * @param {object} config Configuration Object
 */
Issue.prototype.set = function set(config) {
  if (config) {
    if (config.timer) this.setTimer(config.timer);
    if (config.logs) this.setLogs(config.logs);
  }
};

/**
 * Get data from the issue
 * @return {object} issue data (e.g. for JSON exports)
 */
Issue.prototype.get = function get() {
  return {
    timer: this.getTimer(true),
    logs: this.getLogs(true)
  };
};