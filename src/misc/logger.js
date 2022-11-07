const winston = require('winston');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

winston.addColors( {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'green',
});

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} SERVER: ${info.message}`,
      )
    )
  }),
  new winston.transports.File({
    filename: 'logs/server.log',
    maxsize:'1024000',
    maxFiles:'10',
    level: 'warn',
  }),
  // new winston.transports.File({
  //   filename: 'logs/server_all.log',
  //   maxsize:'1000000',
  //   maxFiles:'10',
  // }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

const clientTransports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} CLIENT: ${info.message}`,
      )
    )
  }),
  new winston.transports.File({
    filename: 'logs/client.log',
    maxsize:'1024000',
    maxFiles:'10',
    level: 'warn',
  }),
  // new winston.transports.File({
  //   filename: 'logs/client_all.log',
  //   maxsize:'1000000',
  //   maxFiles:'10',
  // }),
]

const clientLogger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: clientTransports,
});

module.exports = {
  logger,
  clientLogger
}
