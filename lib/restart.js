var async = require('async')

module.exports = function createRestart(systemd) {

  function restart(context, data, callback) {
    context.emit('Restarting services...')
    async.each(
      Object.keys(data.services)
    , function (service, eachCallback) {
        var serviceName =  'node-' + context.appId + '-' + data.environment + '-' + service
        restartSingleService(serviceName, context, data.forceStart, eachCallback)
      }
    , function () {
        callback(null, data)
      }
    )
  }

  function restartSingleService(service, context, force, callback) {
    async.waterfall
    ( [ function (waterCallback) {
          systemd.status(service, waterCallback)
        }
      , function (isRunning, waterCallback) {
          if (isRunning) {
            context.emit(service + ' is currrently running. Restarting...')
            systemd.stop(service, function () {
              systemd.start(service, function () {
                context.emit(service + ' has restarted')
                waterCallback()
              })
            })
          } else if (force) {
            context.emit(service + ' is not currrently running. Force starting...')
            systemd.start(service, function () {
              context.emit(service + ' has started')
              waterCallback()
            })
          } else {
            context.emit(service + ' is not currrently running. Not restarting')
            waterCallback()
          }
        }
      ]
    , callback
    )
  }

  return restart
}
