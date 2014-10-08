/**
 * Represents a single time log
 * @class
 * @param {object} config The data in the log, see Log.set() for more information
 */
function Log(config) {
  this.set(config);
}

/**
 * Assign user to the log
 * @method
 * @param {string} user User Hash
 */
Log.prototype.setUser = function setUser(user) {
  this.user = user;
};

/**
 * Get user assigned to the log
 * @method
 * @return {string} User Hash
 */
Log.prototype.getUser = function getUser() {
  return this.user;
};

/**
 * Set starting point of the log
 * @method
 * @param {number} timestamp Timestamp when the log was started
 */
Log.prototype.setStart = function setStart(timestamp) {
  this.start = timestamp;
};

/**
 * Get starting point of the log
 * @method
 * @return {number} Timestamp when the log was started
 */
Log.prototype.getStart = function getStart() {
  return this.start;
};

/**
 * Set ending point of the log
 * @method
 * @param {number} timestamp Timestamp when the log was stopped
 */
Log.prototype.setStop = function setStop(timestamp) {
  this.stop = timestamp;
};

/**
 * Get ending point of the log
 * @method
 * @return {number} Timestamp when the log was stopped
 */
Log.prototype.getStop = function getStop() {
  return this.stop;
};

/**
 * Set multiple values of the log
 *
 * Values:
 *  - user: see setUser()
 *  - start: see setStart()
 *  - stop: see setStop()
 * 
 * @param {object} config Configuration Object
 */
Log.prototype.set = function set(config) {
  if (config) {
    if (config.user) this.user = user;
    if (config.start) this.start = start;
    if (config.stop) this.stop = stop;
  }
};

/**
 * Get data from the log
 * @return {object} log data (e.g. for JSON exports)
 */
Log.prototype.get = function get() {
  return {
    user: user,
    start: start,
    stop: stop
  };
};