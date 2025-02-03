import { ICloudFormationClient } from '../../lib/api';
import { CloudFormationStack, Template } from '../../lib/api/deployments';
import { StackStatus } from '../../lib/api/util/cloudformation/stack-status';
import { MockSdk } from '../util/mock-sdk';

export interface FakeCloudFormationStackProps {
  readonly stackName: string;
  readonly stackId?: string;
  readonly stackStatus?: string;
}

const client = new MockSdk().cloudFormation();
export class FakeCloudformationStack extends CloudFormationStack {
  public readonly client: ICloudFormationClient;
  private readonly props: FakeCloudFormationStackProps;
  private __template: Template;

  public constructor(props: FakeCloudFormationStackProps) {
    super(client, props.stackName);
    this.client = client;
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
