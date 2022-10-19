import { CloudFormation } from 'aws-sdk';
import { CloudFormationStack, Template } from '../../lib/api/util/cloudformation';
import { instanceMockFrom } from '../util';

export interface FakeCloudFormationStackProps {
  readonly stackName: string;
  readonly stackId: string;
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

  public get stackId(): string {
    return this.props.stackId;
  }
}
