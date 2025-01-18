import { IIoHost, IoMessage, IoMessageLevel, IoRequest, isMessageRelevantForLevel } from '../../lib';

/**
 * A test implementation of IIoHost that does nothing but can by spied on.
 * Optional set a level to filter out all irrelevant messages.
 */
export class TestIoHost implements IIoHost {
  public readonly notifySpy: jest.Mock<any, any, any>;
  public readonly requestSpy: jest.Mock<any, any, any>;

  constructor(public level: IoMessageLevel = 'info') {
    this.notifySpy = jest.fn();
    this.requestSpy = jest.fn();
  }

  public async notify<T>(msg: IoMessage<T>): Promise<void> {
    if (isMessageRelevantForLevel(msg, this.level)) {
      this.notifySpy(msg);
    }
  }

  public async requestResponse<T, U>(msg: IoRequest<T, U>): Promise<U> {
    if (isMessageRelevantForLevel(msg, this.level)) {
      this.requestSpy(msg);
    }
    return msg.defaultResponse;
  }
}
