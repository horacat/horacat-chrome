/**
 * Represents an active timer
 * 
 * This is only used locally, so we don't need to store the user
 * 
 * @class
 * @param {object} config The data in the timer, see Timer.set() for more information
 */
function Timer(config) {
  this.set(config);
}

/**
 * Set starting point of the timer
 * @method
 * @param {number} timestamp Timestamp when the timer was started
 */
Timer.prototype.setStart = function setStart(timestamp) {
  this.start = timestamp;
};

/**
 * Get starting point of the timer
 * @method
 * @return {number} Timestamp when the timer was started
 */
Timer.prototype.getStart = function getStart() {
  return this.start;
};

/**
 * Set ending point of the timer
 * @method
 * @param {number} timestamp Timestamp when the timer was stopped
 */
Timer.prototype.setStop = function setStop(timestamp) {
  this.stop = timestamp;
};

/**
 * Get ending point of the timer
 * @method
 * @return {number} Timestamp when the log was stopped
 */
Timer.prototype.getStop = function getStop() {
  return this.stop;
};

/**
 * Set multiple values of the timer
 *
 * Values:
 *  - start: see setStart()
 *  - stop: see setStop()
 * 
 * @param {object} config Configuration Object
 */
Timer.prototype.set = function set(config) {
  if (config) {
    if (config.start) this.setStart(config.start);
    if (config.stop) this.setStop(config.stop);
  }
};

/**
 * Get data from the timer
 * @return {object} timer data (e.g. for JSON exports)
 */
Timer.prototype.get = function get() {
  return {
    start: start,
    stop: stop
  };
};