import cdk = require("@aws-cdk/cdk");
import { CfnApplication } from "../codedeploy.generated";
import { arnForApplication } from "../utils";

/**
 * Represents a reference to a CodeDeploy Application deploying to AWS Lambda.
 *
 * If you're managing the Application alongside the rest of your CDK resources,
 * use the {@link LambdaApplication} class.
 *
 * If you want to reference an already existing Application,
 * or one defined in a different CDK Stack,
 * use the {@link LambdaApplication#import} method.
 */
export interface ILambdaApplication extends cdk.IConstruct {
  readonly applicationArn: string;
  readonly applicationName: string;

  export(): LambdaApplicationImportProps;
}

/**
 * Construction properties for {@link LambdaApplication}.
 */
export interface LambdaApplicationProps {
  /**
   * The physical, human-readable name of the CodeDeploy Application.
   *
   * @default an auto-generated name will be used
   */
  readonly applicationName?: string;
}

/**
 * A CodeDeploy Application that deploys to an AWS Lambda function.
 */
export class LambdaApplication extends cdk.Construct implements ILambdaApplication {
  /**
   * Import an Application defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link ILambdaApplication#export} method.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced Application
   * @returns a Construct representing a reference to an existing Application
   */
  public static import(scope: cdk.Construct, id: string, props: LambdaApplicationImportProps): ILambdaApplication {
    return new ImportedLambdaApplication(scope, id, props);
  }

  public readonly applicationArn: string;
  public readonly applicationName: string;

  constructor(scope: cdk.Construct, id: string, props: LambdaApplicationProps = {}) {
    super(scope, id);

    const resource = new CfnApplication(this, 'Resource', {
      applicationName: props.applicationName,
      computePlatform: 'Lambda'
    });

    this.applicationName = resource.ref;
    this.applicationArn = arnForApplication(this.applicationName);
  }

  public export(): LambdaApplicationImportProps {
    return {
      applicationName: new cdk.CfnOutput(this, 'ApplicationName', { value: this.applicationName }).makeImportValue().toString()
    };
  }
}

/**
 * Properties of a reference to a CodeDeploy Application.
 *
 * @see LambdaApplication#import
 * @see ILambdaApplication#export
 */
export interface LambdaApplicationImportProps {
  /**
   * The physical, human-readable name of the Lambda Application we're referencing.
   * The Application must be in the same account and region as the root Stack.
   */
  readonly applicationName: string;
}

class ImportedLambdaApplication extends cdk.Construct implements ILambdaApplication {
  public readonly applicationArn: string;
  public readonly applicationName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: LambdaApplicationImportProps) {
    super(scope, id);

    this.applicationName = props.applicationName;
    this.applicationArn = arnForApplication(props.applicationName);
  }

  public export(): LambdaApplicationImportProps {
    return this.props;
  }
}
