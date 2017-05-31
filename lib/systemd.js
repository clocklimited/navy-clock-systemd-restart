var cp = require('child_process')
  , exec = cp.exec

module.exports = function createSystemd() {

  function status(service, cb) {
    runExec('status', service, function (error, output) {
      var running = false
        , parts = output.split('\n')
      parts.some(function (line) {
        if (line.trim().indexOf('Active: active (running)') === 0) {
          running = true
          return true
        }
      })
      cb(null, running)
    })
  }

  function start(service, callback) {
    runExec('start', service, callback)
  }

  function stop(service, callback) {
    runExec('stop', service, callback)
  }

  function restart(service, callback) {
    runExec('restart', service, callback)
  }

  function runExec(cmd, service, cb) {
    exec('sudo systemctl ' + cmd + ' ' + service, cb)
  }

  return {
    status: status
  , start: start
  , stop: stop
  , restart: restart
  }

}
