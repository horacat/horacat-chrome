function HoracatStorage(user, project, issue) {
  this.log = debug('horacat:storage');
  this.logv = debug('horacat:storage:verbose');

  this.data = {};
}

HoracatStorage.prototype.load = function load() {
  var data = localStorage.getItem('horacat');
  data = JSON.parse(data);
  this.data = data;
  this.log('loaded:', this.data);
};

HoracatStorage.prototype.store = function store() {
  var data = {};
  data[this.project] = {};
  data[this.project][this.issue] = {
    active: {
      logged: 100,
      start: 1231283
    },
    logs: [
      { "user": "user_hash", "start": 1231283, "stop": 1231383 }
    ]
  };
  localStorage.setItem('horacat', JSON.stringify(data));
  this.log('stored:', data);
};