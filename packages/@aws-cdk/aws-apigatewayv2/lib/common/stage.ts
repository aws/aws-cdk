import { IResource } from '@aws-cdk/core';

/**
 * Represents a Stage.
 */
export interface IStage extends IResource {
  /**
   * The name of the stage; its primary identifier.
   * @attribute
   */
  readonly stageName: string;
}

/**
 * Options required to create a new stage.
 * Options that are common between HTTP and Websocket APIs.
 */
export interface CommonStageOptions {
  /**
   * The name of the stage. See `StageName` class for more details.
   * @default '$default' the default stage of the API. This stage will have the URL at the root of the API endpoint.
   */
  readonly stageName?: string;

  /**
   * Whether updates to an API automatically trigger a new deployment.
   * @default false
   */
  readonly autoDeploy?: boolean;
}
