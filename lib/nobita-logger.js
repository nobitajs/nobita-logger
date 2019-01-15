const log4js = require('log4js');
const path = require('path');

const formatDateTime = is => {
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let h = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  m = m < 10 ? ('0' + m) : m;
  d = d < 10 ? ('0' + d) : d;
  h = h < 10 ? ('0' + h) : h;
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;

  if (is) {
    return `${y}-${m}-${d}T${h}:${minute}:${second}`;
  }

  return `${y}-${m}-${d}`;
}

module.exports = config => {
  const { logger = {} } = config;
  logger.level = logger.level || 'off';
  logger.path = logger.path || './logs/'
  const filename = path.join(config.cwd, logger.path);
  let type = 'dateFile';

  if (config.env == 'local') {
    type = 'console';
  };

  log4js.configure({
    appenders: {
      ruleFile: {
        type,
        filename,
        encoding: "utf-8",
        pattern: 'yyyy-MM-dd.log',
        maxLogSize: 10 * 1000 * 1000,
        numBackups: 3,
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: { appenders: ['ruleFile'], level: logger.level }
    }
  })

  return log4js.getLogger('logs');
};

