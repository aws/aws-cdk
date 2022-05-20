import { IAws } from '../aws';
import { EventType } from '../progress';
import { DockerFactory } from './docker';

export interface IAssetHandler {
  publish(): Promise<void>;
}

export interface IHandlerHost {
  readonly aws: IAws;
  readonly aborted: boolean;
  readonly dockerFactory: DockerFactory;

  emitMessage(type: EventType, m: string): void;
}