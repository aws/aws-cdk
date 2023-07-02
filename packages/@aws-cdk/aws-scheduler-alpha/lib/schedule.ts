import { IResource, Resource } from 'aws-cdk-lib';
import { IGroup } from './group';

/**
 * Interface representing a created or an imported `Schedule`.
 */
export interface ISchedule extends IResource {
  group?: IGroup;
}

export class Schedule extends Resource implements ISchedule {
  group?: IGroup;
}
