/**
 * A single timer
 */
export class Timer {
  public timeMs?: number;
  private startTime: number;

  constructor(public readonly label: string) {
    this.startTime = Date.now();
  }

  public start() {
    this.startTime = Date.now();
  }

  public end() {
    this.timeMs = (Date.now() - this.startTime) / 1000;
  }

  public isSet() {
    return this.timeMs !== undefined;
  }

  public humanTime() {
    if (!this.timeMs) { return '???'; }

    const parts = [];

    let time = this.timeMs;
    if (time > 60) {
      const mins = Math.floor(time / 60);
      parts.push(mins + 'm');
      time -= mins * 60;
    }
    parts.push(time.toFixed(1) + 's');

    return parts.join('');
  }
}

/**
 * A collection of Timers
 */
export class Timers {
  private readonly timers: Timer[] = [];

  public record<T>(label: string, operation: () => T): T {
    const timer = this.start(label);
    try {
      const x = operation();
      timer.end();
      return x;
    } catch (e) {
      timer.end();
      throw e;
    }
  }

  public async recordAsync<T>(label: string, operation: () => Promise<T>) {
    const timer = this.start(label);
    try {
      const x = await operation();
      timer.end();
      return x;
    } catch (e) {
      timer.end();
      throw e;
    }
  }

  public start(label: string) {
    const timer = new Timer(label);
    this.timers.push(timer);
    return timer;
  }

  public display(): string {
    const timers = this.timers.filter(t => t.isSet());
    timers.sort((a: Timer, b: Timer) => b.timeMs! - a.timeMs!);
    return timers.map(t => `${t.label} (${t.humanTime()})`).join(' | ');
  }
}
