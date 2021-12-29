import { IEventPrinter, CloudWatchLogEvent } from '../../../lib/api/hotswap/monitor/logs-monitor';

export class FakePrinter implements IEventPrinter {
  public readonly events: CloudWatchLogEvent[] = [];

  public print(e: CloudWatchLogEvent): void {
    this.events.push(e);
  }

  public get eventMessages() {
    return this.events.map(a => a.message);
  }

  public start(): void { }
  public stop(): void { }
}
