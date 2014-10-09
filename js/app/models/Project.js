/**
 * Represents a (GitHub) project
 * 
 * @class
 * @param {string} hash Project hash/id
 * @param {object} config The data in the project, see Project.set() for more information
 */
function Project(hash, config) {
  this.hash = hash;
  this.issues = [];

  this.set(config);
}

/**
 * Add issue to the project
 * @param {Issue} issue Issue object
 */
Project.prototype.addIssue = function addIssue(issue) {
  if (!issue instanceof Issue) {
    issue = new Issue(issue);
  }

  this.issues.push(issue);
};

/**
 * Set issues of the project
 * @param {array} issues Array of Issue objects
 */
Project.prototype.setIssues = function setIssues(issues) {
  if (!issues instanceof Array) {
    throw new Error('Invalid type of argument \'issues\'. Expected: Array');
  }

  for (var i=0; i < issues.length; i++) {
    if (!issues[i] instanceof Issue) {
      issues[i] = new Issue(issues[i]);
    }

    this.addIssue(issues[i]);
  }
};

/**
 * Get issues of the project
 * @param {boolean} raw Return raw issue data (e.g. for JSON exports)
 * @param {array} issues Array of Issue objects (or array of issue data, if raw was specified)
 */
Project.prototype.getIssues = function getIssues(raw) {
  if (raw) {
    var rawIssues = [];
    for (var i=0; i < this.issues.length; i++) {
      rawIssues.push(this.issues[i].get());
    }
    return rawIssues;
  } else {
    return this.issues;
  }
};

/**
 * Set multiple values of the project
 *
 * Values:
 *  - issues: see setIssues()
 * 
 * @param {object} config Configuration Object
 */
Project.prototype.set = function set(config) {
  if (config) {
    if (config.issues) this.setIssues(config.issues);
  }
};

/**
 * Get data from the project
 * @return {object} project data (e.g. for JSON exports)
 */
Project.prototype.get = function get() {
  return {
    issues: this.getIssues(true)
  };
};

/**
 * Get key of the project (id)
 * @return {string} Project hash/id
 */
Project.prototype.getKey = function getKey() {
  return this.hash;
};