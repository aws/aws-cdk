/* eslint-disable import/order */
import { ToolkitInfo, DEFAULT_BOOTSTRAP_VARIANT } from '../../lib/api';
import { CloudFormationStack } from '../../lib/api/util/cloudformation';

export interface MockToolkitInfoProps {
  readonly bucketName?: string;
  readonly bucketUrl?: string;
  readonly version?: number;
  readonly bootstrapStack?: CloudFormationStack;
}

export class MockToolkitInfo extends ToolkitInfo {
  public static setup(toolkitInfo?: ToolkitInfo) {
    toolkitInfo = toolkitInfo ?? new MockToolkitInfo();
    const orig = ToolkitInfo.lookup;
    ToolkitInfo.lookup = jest.fn().mockResolvedValue(toolkitInfo);

    return {
      toolkitInfo,
      dispose: () => {
        ToolkitInfo.lookup = orig;
      },
    };
  }

  public readonly found = true;
  public readonly bucketUrl: string;
  public readonly bucketName: string;
  public readonly version: number;
  public readonly variant: string;
  public readonly stackName = 'MockBootstrapStack';

  private readonly _bootstrapStack?: CloudFormationStack;

  constructor(props: MockToolkitInfoProps = {}) {
    super();

    this.bucketName = props.bucketName ?? 'MockToolkitBucketName';
    this.bucketUrl = props.bucketUrl ?? `https://${this.bucketName}.s3.amazonaws.com/`;
    this.version = props.version ?? 1;
    this.variant = DEFAULT_BOOTSTRAP_VARIANT;
    this._bootstrapStack = props.bootstrapStack;
  }

  public get bootstrapStack(): CloudFormationStack {
    if (!this._bootstrapStack) {
      throw new Error('Bootstrap stack object expected but not supplied to MockToolkitInfo');
    }
    return this._bootstrapStack;
  }
}
