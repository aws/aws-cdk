import { IAws } from '../aws';
import { EventType } from '../progress';

export interface IAssetHandler {
  publish(): Promise<void>;
}

export interface IHandlerHost {
  readonly aws: IAws;
  readonly aborted: boolean;

  emitMessage(type: EventType, m: string): void;
}