import { IResource, Resource } from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * Interface representing a created or an imported `Pipe`.
 */
export interface IPipe extends IResource {
}

/**
 * Construction properties for `Pipe`.
 */
export interface PipeProps {
  /**
   * The name of the pipe.
   */
  readonly pipeName: string

}

/**
 * An EventBridge Pipe
 */
export class Pipe extends Resource implements IPipe {
  constructor(scope: Construct, id: string, props: PipeProps) {
    super(scope, id, {
      physicalName: props.pipeName,
    });
  }
}
