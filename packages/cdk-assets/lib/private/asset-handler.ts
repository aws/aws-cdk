import { DockerFactory } from './docker';
import { IAws } from '../aws';
import { EventType } from '../progress';

/**
 * Handler for asset building and publishing.
 */
export interface IAssetHandler {
  /**
   * Build the asset.
   */
  build(): Promise<void>;

  /**
   * Publish the asset.
   */
  publish(): Promise<void>;
}

export interface IHandlerHost {
  readonly aws: IAws;
  readonly aborted: boolean;
  readonly dockerFactory: DockerFactory;

  emitMessage(type: EventType, m: string): void;
}