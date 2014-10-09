function Storage() {
  this.log = debug('horacat:storage');
  this.logv = debug('horacat:storage:verbose');

  this.logv('loaded storage module');

  this.projects = {};
}

Storage.prototype.get = function get() {
  var data = {};
  for (var id in this.projects) {
    if (Object.prototype.hasOwnProperty.call(this.projects, id)) {
      data[id] = this.projects[id].get();
    }
  }
  return data;
};

Storage.prototype.parse = function parse() {
  var data = {};
  for (var id in this.projects) {
    if (Object.prototype.hasOwnProperty.call(this.projects, id)) {
      data[id] = this.projects[id].get();
    }
  }
  return data;
};

Storage.prototype.load = function load() {
  var data = localStorage.getItem('horacat');
  data = JSON.parse(data);
  this.log('loaded:', data);

  this.parse(data);
};

Storage.prototype.save = function save() {
  var data = this.get();

  localStorage.setItem('horacat', JSON.stringify(data));
  this.log('stored:', data);
};