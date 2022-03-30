import { IPublishProgressListener, EventType, IPublishProgress } from '../lib/progress';

export class FakeListener implements IPublishProgressListener {
  public readonly types = new Array<EventType>();
  public readonly messages = new Array<string>();

  constructor(private readonly doAbort = false) {
  }

  public onPublishEvent(_type: EventType, event: IPublishProgress): void {
    this.messages.push(event.message);

    if (this.doAbort) {
      event.abort();
    }
  }
}