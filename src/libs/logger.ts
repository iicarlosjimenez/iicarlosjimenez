import winston from "winston";

class Logger {
  private static instance: winston.Logger;

  private constructor() {} // Evita crear instancias con `new`

  public static getInstance(): winston.Logger {
    if (!Logger.instance) {
      Logger.instance = winston.createLogger({
        level: "info",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
          })
        ),
        transports: [
          new winston.transports.Console(),
          // Opcional: guardar en archivo
          new winston.transports.File({ filename: "logs/app.log" }),
        ],
      });
    }
    return Logger.instance;
  }
}

export default Logger;
