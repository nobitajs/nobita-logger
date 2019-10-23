const log4js = require('log4js');
const path = require('path');
const fs = require('fs');
const index = fs.readFileSync(path.join(__dirname, '../template/index.nj'), 'utf-8');

module.exports = app => {
  const { config, router } = app;
  const { logger = {} } = config;
  logger.level = logger.level ? logger.level : 'off';
  logger.path = logger.path || './logs/'
  const filename = path.join(config.cwd, logger.path);
  let type = 'dateFile';

  if (config.env == 'local') {
    type = 'console';
  };

  logger.router && router.get(logger.router, async (ctx) => {
    const dirPath = path.resolve(config.cwd, logger.path);
    const isDirPath = fs.existsSync(dirPath);
    if (isDirPath) {
      let dir = fs.readdirSync(dirPath);
      if (dir && dir.length) {
        dir = dir.filter(e => /\w+.log$/.test(e)).map(e => {
          return {
            title: logger.path + e,
            cont: (fs.readFileSync(path.join(dirPath, e), 'utf-8'))
          }
        });
        return ctx.body = ctx.nunjucks.renderString(index, {
          dir
        })
      }
    }
    return ctx.body = ctx.nunjucks.renderString(index, {
      dir: [{ title: '暂无日志' }]
    })
  });

  log4js.configure({
    appenders: {
      logs: {
        type,
        filename,
        encoding: "utf-8",
        pattern: 'yyyy-MM-dd.log',
        maxLogSize: 10 * 1000 * 1000,
        numBackups: 3,
        alwaysIncludePattern: true,
      },
    },
    categories: {
      default: { appenders: ['logs'], level: logger.level }
    },
    pm2: true,
    disableClustering: true
  })

  return log4js.getLogger('[nobita-logs]');

  
};

