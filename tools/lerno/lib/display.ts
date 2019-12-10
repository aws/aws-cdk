import colors = require('colors');

export function log(x: string) {
  // tslint:disable-next-line:no-console
  console.error(x);
}

export class Progress {
  private readonly inProgress: string[] = [];
  private lastLength = 0;

  public start(message: string) {
    this.output(false, message, true);
  }

  public end() {
    this.message('');
  }

  public add(el: string) {
    this.inProgress.push(el);
    this.printStatus();
  }

  public remove(el: string) {
    this.inProgress.splice(0, this.inProgress.length, ...this.inProgress.filter(x => x !== el));
    this.printStatus();
  }

  public message(m: string) {
    this.output(true, m, true);
    this.printStatus();
  }

  public async withElement<A>(el: string, message: string, block: () => Promise<A>): Promise<A> {
    this.message(message);
    this.add(el);
    try {
      return await block();
    } finally {
      this.remove(el);
    }
  }

  private statusLine() {
    const msgs = this.inProgress.slice(0, 4);
    const more = this.inProgress.length - msgs.length;
    if (more > 0) {
      msgs.push(`${more} more...`);
    }

    return msgs.map(x => `[ ${colors.green(x)} ]`).join('');
  }

  private printStatus() {
    this.output(true, this.statusLine(), false);
  }

  private output(rewrite: boolean, message: string, newline: boolean) {
    const write = message + ' '.repeat(Math.max(0, this.lastLength - message.length));
    this.lastLength = newline ? 0 : message.length;
    process.stderr.write(`${rewrite ? '\r' : ''}${write}${newline ? '\n' : ''}`);
  }
}