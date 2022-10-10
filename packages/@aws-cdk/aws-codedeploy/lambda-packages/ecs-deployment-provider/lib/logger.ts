type LogAttributes = { [key: string]: string | boolean | Error | undefined };

export class Logger {
  persistentAttributes: LogAttributes = {};

  info(message: string, ...attributes: LogAttributes[]): void {
    process.stdout.write(this.formatMessage(message, {level: 'INFO'}, ...attributes)+'\n');
  }
  warn(message: string, ...attributes: LogAttributes[]): void {
    process.stdout.write(this.formatMessage(message, {level: 'WARN'}, ...attributes)+'\n');
    //console.log(this.formatMessage(message, {level: 'WARN'}, ...attributes));
  }
  error(message: string, ...attributes: LogAttributes[]): void {
    process.stdout.write(this.formatMessage(message, {level: 'ERROR'}, ...attributes)+'\n');
    //console.log(this.formatMessage(message, {level: 'ERROR'}, ...attributes));
  }
  appendKeys(attributes: LogAttributes): void {
    this.persistentAttributes = {...this.persistentAttributes, ...attributes};
  }
  formatMessage(message: string, ...attributes: LogAttributes[]): string {
    const formattedMessage = [this.persistentAttributes, ...attributes].reduce((combined: LogAttributes, current: LogAttributes) => {
      return {...combined, ...current};
    }, {message});
    return JSON.stringify(formattedMessage);
  }
}