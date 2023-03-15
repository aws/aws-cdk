import { ISDK, ToolkitInfo, DEFAULT_BOOTSTRAP_VARIANT } from '../../lib/api';
import { CloudFormationStack } from '../../lib/api/util/cloudformation';

export interface MockToolkitInfoProps {
  readonly bucketName?: string;
  readonly bucketUrl?: string;
  readonly version?: number;
  readonly bootstrapStack?: CloudFormationStack;
}

function mockLike<A extends (...args: any) => any>(): jest.Mock<ReturnType<A>, Parameters<A>> {
  return jest.fn();
}

export class MockToolkitInfo extends ToolkitInfo {
  public readonly found = true;
  public readonly bucketUrl: string;
  public readonly bucketName: string;
  public readonly version: number;
  public readonly variant: string;
  public readonly prepareEcrRepository = mockLike<typeof ToolkitInfo.prototype.prepareEcrRepository>();

  private readonly _bootstrapStack?: CloudFormationStack;

  constructor(sdk: ISDK, props: MockToolkitInfoProps = {}) {
    super(sdk);

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

  public async validateVersion(expectedVersion: number, ssmParameterName: string | undefined): Promise<void> {
    const version = ssmParameterName !== undefined ? await ToolkitInfo.versionFromSsmParameter(this.sdk, ssmParameterName) : this.version;

    if (expectedVersion > version) {
      throw new Error(`This CDK deployment requires bootstrap stack version '${expectedVersion}', found '${version}'. Please run 'cdk bootstrap' with a newer CLI version.`);
    }
  }
}
