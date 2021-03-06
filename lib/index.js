var Promise = require('bluebird')
var log = require('jm-log4js')
var mqtt = require('mqtt')
var logger = log.getLogger('jm-pay-mqtt')

module.exports = function (opts, app) {

  ['mqtt'].forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  var o = {
    ready: false,

    onReady: function () {
      var self = this
      return new Promise(function (resolve, reject) {
        if (self.ready) return resolve(self.ready)
        self.on('ready', function () {
          resolve()
        })
      })
    }
  }

  if (!app.modules.pay) {
    logger.warn('no pay module found. so I can not work.')
    return o
  }
  if (!opts.mqtt) {
    logger.warn('no config mqtt. so I can not work.')
    return o
  }

  var pay = app.modules.pay

  var mq = mqtt.connect(opts.mqtt)

  mq.on('connect', function (connack) {
    logger.info('connected')
    o.ready = true
  })
  mq.on('reconnect', function () {
    logger.info('reconnect')
  })
  mq.on('close', function () {
    logger.info('close')
    o.ready = false
  })
  mq.on('offline', function () {
    logger.info('offline')
    o.ready = false
  })
  mq.on('error', function (err) {
    logger.error(err.stack)
  })

  var publish = function (channel, obj) {
    o.onReady()
      .then(function () {
        mq.publish(channel, JSON.stringify(obj), {qos: 1})
      })
  }
  pay.on('pay.update', function (opts) {
    opts && (publish('pay/update', opts))
  })
  pay.on('pay.remove', function (opts) {
    opts && (publish('pay/remove', opts))
  })
}