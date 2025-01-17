import { IIoHost, IoMessage, IoMessageLevel, IoRequest, isMessageRelevantForLevel } from '../../lib';

/**
 * A test implementation of IIoHost that does nothing but can by spied on.
 * Optional set a level to filter out all irrelevant messages.
 */
export class TestIoHost implements IIoHost {
  public readonly spy: jest.Mock<any, any, any>;

  constructor(public level: IoMessageLevel = 'info') {
    this.spy = jest.fn();
  }

  public async notify<T>(msg: IoMessage<T>): Promise<void> {
    if (isMessageRelevantForLevel(msg, this.level)) {
      this.spy(msg);
    }
  }

  public async requestResponse<T, U>(msg: IoRequest<T, U>): Promise<U> {
    await this.notify(msg);
    return msg.defaultResponse;
  }
}
