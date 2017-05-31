var assert = require('assert')
  , rewire = require('rewire')
  , createSystemd = rewire('../../lib/systemd')

describe('Systemd', function () {
  describe('status', function () {
    it('should return true if process is running', function (done) {
      var output = '● node-bba-site-staging-admin.service - admin\n   ' +
        'Loaded: loaded (/lib/systemd/system/node-bba-site-staging-admin.service;' +
        ' enabled; vendor preset: enabled)\n   Active: active (running) ' +
        'since Wed 2017-05-31 09:50:48 UTC; 6min ago\n'

      createSystemd.__set__('exec', function (c, cb) {
        assert.equal(c, 'sudo systemctl --no-pager status node-bba-site-staging-admin')
        cb(null, output)
      })

      var systemd = createSystemd()
      systemd.status('node-bba-site-staging-admin', function (error, isRunning) {
        if (error) return done(error)
        assert.equal(isRunning, true, 'should be running')
        done()
      })
    })

    it('should return false if process is not running', function (done) {
      var output = '● node-bba-site-staging-admin.service - admin\n   ' +
        'Loaded: loaded (/lib/systemd/system/node-bba-site-staging-admin.service;' +
        ' enabled; vendor preset: enabled)\n   Active: inactive (dead) since ' +
        'Wed 2017-05-31 09:50:30 UTC; 9s ago\n'

      createSystemd.__set__('exec', function (c, cb) {
        assert.equal(c, 'sudo systemctl --no-pager status node-bba-site-staging-admin')
        cb(null, output)
      })

      var systemd = createSystemd()
      systemd.status('node-bba-site-staging-admin', function (error, isRunning) {
        if (error) return done(error)
        assert.equal(isRunning, false, 'should not be running')
        done()
      })
    })
  })
})
