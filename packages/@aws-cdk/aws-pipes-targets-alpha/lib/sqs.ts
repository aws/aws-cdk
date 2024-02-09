import { IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';

export class SqsTarget implements ITarget {
  public readonly targetArn: string = '';
  constructor() {
  }
  grantPush(_grantee: IRole): void {
    throw new Error('Method not implemented.');
  }
  bind(_pipe: IPipe): TargetConfig {
    throw new Error('Method not implemented.');
  }
  grantWrite(_pipeRole: IRole): void {
    throw new Error('Method not implemented.');
  }
}