var createRestart = require('./lib/restart')
  , systemd = require('./lib/systemd')()
  , restart = createRestart(systemd)

module.exports = function clockRestart() {

  var steps =
  { init: init
  , restart: restart
  }

  function getSteps() {
    return steps
  }

  function getStepList() {
    return Object.keys(steps)
  }

  function init(context, callback) {
    var data =
          { environment: context.environment
          , forceStart: context.orderArgs[0] === 'force'
          , services: context.appData.services
          }

    callback(null, data)
  }

  return {
    getSteps: getSteps
  , getStepList: getStepList
  }

}
