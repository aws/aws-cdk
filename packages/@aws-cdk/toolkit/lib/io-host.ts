import { MessageLevel, ToolkitAction } from './types';

export interface IoMessage<T> {
  time: string;
  level: MessageLevel;
  action: ToolkitAction;
  code: string;
  message: string;
  data?: T;
}

export interface IoRequest<T, U> extends IoMessage<T> {
  defaultResponse: U;
}

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
  requestResponse<T, U>(msg: IoRequest<T, U>): Promise<U | undefined>;
}
