/* eslint-disable import/order */
import { CloudFormation } from 'aws-sdk';
import { CloudFormationStack, Template } from '../../lib/api/util/cloudformation';
import { instanceMockFrom } from '../util';
import { StackStatus } from '../../lib/api/util/cloudformation/stack-status';

export interface FakeCloudFormationStackProps {
  readonly stackName: string;
  readonly stackId?: string;
  readonly stackStatus?: string;
}

export class FakeCloudformationStack extends CloudFormationStack {
  public readonly cfnMock: jest.Mocked<CloudFormation>;
  private readonly props: FakeCloudFormationStackProps;
  private __template: Template;

  public constructor(props: FakeCloudFormationStackProps) {
    const cfnMock = instanceMockFrom(CloudFormation);
    super(cfnMock, props.stackName);
    this.cfnMock = cfnMock;
    this.props = props;
    this.__template = {};
  }

  public setTemplate(template: Template): void {
    this.__template = template;
  }

  public async template(): Promise<Template> {
    return Promise.resolve(this.__template);
  }

  public get exists() {
    return this.props.stackId !== undefined;
  }

  public get stackStatus() {
    const status = this.props.stackStatus ?? 'UPDATE_COMPLETE';
    return new StackStatus(status, 'The test said so');
  }

  public get stackId() {
    if (!this.props.stackId) {
      throw new Error('Cannot retrieve stackId from a non-existent stack');
    }
    return this.props.stackId;
  }

  public get outputs(): Record<string, string> {
    return {};
  }
}
