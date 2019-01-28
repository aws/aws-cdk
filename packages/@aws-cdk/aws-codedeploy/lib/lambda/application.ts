import cdk = require("@aws-cdk/cdk");
import { CfnApplication } from "../codedeploy.generated";
import { ComputePlatform } from "../config";
import { applicationNameToArn } from "../utils";

export interface ILambdaAppliction {
  readonly applicationArn: string;
  readonly applicationName: string;
  readonly computePlatform: ComputePlatform.Lambda;

  export(): LambdaApplicationImportProps;
}

export interface LambdaApplicationProps {
  applicationName?: string;
}

export class LambdaApplication extends cdk.Construct implements ILambdaAppliction {
  public static import(scope: cdk.Construct, id: string, props: LambdaApplicationImportProps): ILambdaAppliction {
    return new ImportedLambdaApplication(scope, id, props);
  }
  public readonly applicationArn: string;
  public readonly applicationName: string;

  public readonly computePlatform: ComputePlatform.Lambda;

  constructor(scope: cdk.Construct, id: string, props: LambdaApplicationProps = {}) {
    super(scope, id);
    const resource = new CfnApplication(this, 'Resource', {
      applicationName: props.applicationName,
      computePlatform: ComputePlatform.Lambda,
    });

    this.computePlatform = ComputePlatform.Lambda;
    this.applicationName = resource.ref;
    this.applicationArn = applicationNameToArn(this.applicationName, this);
  }

  public export(): LambdaApplicationImportProps {
    return {
      applicationName: new cdk.Output(this, 'ApplicationName', { value: this.applicationName }).makeImportValue().toString(),
      computePlatform: this.computePlatform
    };
  }
}

/**
 * Properties of a reference to a CodeDeploy Application.
 *
 * @see Application#import
 * @see Application#export
 */
export interface LambdaApplicationImportProps {
  /**
   * The physical, human-readable name of the CodeDeploy EC2/on-premise Application we're referencing.
   * The Application must be in the same account and region as the root Stack.
   */
  applicationName: string;

  /**
   * The compute platform of the Server application, is always Server.
   */
  computePlatform: ComputePlatform.Lambda;
}

class ImportedLambdaApplication extends cdk.Construct implements ILambdaAppliction {
  public readonly applicationArn: string;
  public readonly applicationName: string;
  public readonly computePlatform: any;
  constructor(scope: cdk.Construct, id: string, private readonly props: LambdaApplicationImportProps) {
    super(scope, id);
    this.applicationName = props.applicationName;
    this.applicationArn = applicationNameToArn(props.applicationName, this);
    this.computePlatform = ComputePlatform.Lambda;
  }
  public export(): LambdaApplicationImportProps {
    return this.props;
  }
}
