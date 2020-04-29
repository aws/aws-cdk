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
 * A type to be used while specifying the stage name for a new Stage.
 */
export class StageName {
  /**
   * The default stage of the API.
   * This stage will have the URL at the root of the API endpoint.
   */
  public static readonly DEFAULT = new StageName('$default');

  /**
   * The name of this stage.
   * This will be used to both the primary identifier of this stage, as well as,
   * the path component of the API endpoint - 'https://<api-id>.execute-api.<region>.amazonaws.com/<stage name>'.
   */
  public static of(stageName: string) {
    return new StageName(stageName);
  }

  /**
   * The name of this stage as a string, as recognized by the API Gateway service.
   */
  public readonly stageName: string;

  private constructor(stageName: string) {
    this.stageName = stageName;
  }
}

/**
 * Options required to create a new stage.
 * Options that are common between HTTP and Websocket APIs.
 */
export interface CommonStageOptions {
  /**
   * The name of the stage. See `StageName` class for more details.
   * @default StageName.DEFAULT
   */
  readonly stageName?: StageName;

  /**
   * Whether updates to an API automatically trigger a new deployment.
   * @default false
   */
  readonly autoDeploy?: boolean;
}
