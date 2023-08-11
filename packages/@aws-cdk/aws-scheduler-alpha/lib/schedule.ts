import { IResource } from 'aws-cdk-lib';
import { IGroup } from './group';

/**
 * Interface representing a created or an imported `Schedule`.
 */
export interface ISchedule extends IResource {
  readonly scheduleName: string;
  readonly group?: IGroup;
  readonly scheduleArn: string;
}
