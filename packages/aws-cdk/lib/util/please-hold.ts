import colors = require('colors/safe');
import { print } from "../logging";

/**
 * Print a message to the logger in case the operation takes a long time
 */
export class PleaseHold {
  private handle?: NodeJS.Timer;

  constructor(private readonly message: string, private readonly timeoutSec = 10) {
  }

  public start() {
    this.handle = setTimeout(this.printMessage.bind(this), this.timeoutSec * 1000);
  }

  public stop() {
    if (this.handle) {
      clearTimeout(this.handle);
    }
  }

  private printMessage() {
    print(colors.yellow(this.message));
  }
}
