import { IoMessage, IoRequest } from './io-message';

export interface IIoHost {
  /**
   * Notifies the host of a message.
   * The caller waits until the notification completes.
   */
  notify<T>(msg: IoMessage<T>): Promise<void>;

  /**
   * Notifies the host of a message that requires a response.
   *
   * If the host does not return a response the suggested
   * default response from the input message will be used.
   */
  requestResponse<T, U>(msg: IoRequest<T, U>): Promise<U>;
}
