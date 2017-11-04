var config = {
  development: {
    port: 3000,
    lng: 'zh_CN',
    mqtt: 'mqtt://root:123@api.h5.jamma.cn',
    modules: {
      'pay': {
        module: 'jm-pay'
      },
      'jm-pay-mqtt': {
        module: process.cwd() + '/lib'
      }
    }
  },
  production: {
    port: 80,
    lng: 'zh_CN',
    db: 'mongodb://mongo.db/pay',
    modules: {
      'pay': {
        module: 'jm-pay'
      },
      'jm-pay-mqtt': {
        module: process.cwd() + '/lib'
      }
    }
  }
}

var env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env

module.exports = config