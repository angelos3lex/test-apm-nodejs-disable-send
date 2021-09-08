import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
// @ts-ignore
import ecsFormat from "@elastic/ecs-winston-format";

export default class Logger {
    private static instance?: winston.Logger;

    private static init() {
        this.instance = winston.createLogger({
            format: this.logsFormat(),
            level: this.logsLevel(),
            transports: this.logsTransports(),
        });
    }

    private static dailyRotateFileConfig(): DailyRotateFile {
        return new DailyRotateFile({
            filename: "logger-%DATE%",
            datePattern: "YYYY-MM-DD",
            extension: ".log",
            maxSize: "100m",
            maxFiles: "31d",
            dirname: "logs",
        });
    }

    public static logsLevel(): string {
        return "info";
    }

    public static logsFormat(): winston.Logform.Format | undefined {
        return ecsFormat({ convertReqRes: true });
    }

    public static logsTransports(): Array<winston.transport> {
        return [this.dailyRotateFileConfig()];
    }

    public static debug(message: any, ...meta: any[]): void {
        if (!this.instance) {
            this.init();
        }
        this.instance!.debug(message, meta);
    }

    public static info(message: any, ...meta: any[]): void {
        if (!this.instance) {
            this.init();
        }
        this.instance!.info(message, meta);
    }

    public static warn(message: any, ...meta: any[]): void {
        if (!this.instance) {
            this.init();
        }
        this.instance!.warn(message, meta);
    }

    public static error(message: any, ...meta: any[]): void {
        if (!this.instance) {
            this.init();
        }
        this.instance!.error(message, meta);
    }
}
