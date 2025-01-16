import { IIoHost, IoMessage, IoRequest } from '../../lib';

/**
 * A test implementation of IIoHost that does nothing but can by spied on.
 */
export class TestIoHost implements IIoHost {
  public async notify<T>(_msg: IoMessage<T>): Promise<void> {
    // do nothing
  }
  public async requestResponse<T, U>(msg: IoRequest<T, U>): Promise<U> {
    return msg.defaultResponse;
  }
}
