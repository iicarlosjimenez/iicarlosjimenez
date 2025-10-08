import winston from "winston";

class Logger {
  private static instance: winston.Logger;

  private constructor() {}

  public static getInstance(): winston.Logger {
    if (!Logger.instance) {
      const transports: winston.transport[] = [
        new winston.transports.Console()
      ];

      if (process.env.NODE_ENV !== "production") {
        transports.push(
          new winston.transports.File({ filename: "logs/app.log" })
        );
      }

      Logger.instance = winston.createLogger({
        level: "info",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
          })
        ),
        transports
      });
    }
    return Logger.instance;
  }
}

export default Logger;
