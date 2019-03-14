import cdk = require('@aws-cdk/cdk');
import { CfnApplication } from '../codedeploy.generated';
import { applicationNameToArn } from '../utils';

/**
 * Represents a reference to a CodeDeploy Application deploying to EC2/on-premise instances.
 *
 * If you're managing the Application alongside the rest of your CDK resources,
 * use the {@link ServerApplication} class.
 *
 * If you want to reference an already existing Application,
 * or one defined in a different CDK Stack,
 * use the {@link #import} method.
 */
export interface IServerApplication extends cdk.IConstruct {
  readonly applicationArn: string;
  readonly applicationName: string;

  export(): ServerApplicationImportProps;
}

/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Application.
 *
 * @see ServerApplication#import
 * @see ServerApplication#export
 */
export interface ServerApplicationImportProps {
  /**
   * The physical, human-readable name of the CodeDeploy EC2/on-premise Application we're referencing.
   * The Application must be in the same account and region as the root Stack.
   */
  applicationName: string;
}

class ImportedServerApplication extends cdk.Construct implements IServerApplication {
  public readonly applicationArn: string;
  public readonly applicationName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: ServerApplicationImportProps) {
    super(scope, id);

    this.applicationName = props.applicationName;
    this.applicationArn = applicationNameToArn(this.applicationName, this);
  }

  public export(): ServerApplicationImportProps {
    return this.props;
  }
}

/**
 * Construction properties for {@link ServerApplication}.
 */
export interface ServerApplicationProps {
  /**
   * The physical, human-readable name of the CodeDeploy Application.
   *
   * @default an auto-generated name will be used
   */
  applicationName?: string;
}

/**
 * A CodeDeploy Application that deploys to EC2/on-premise instances.
 */
export class ServerApplication extends cdk.Construct implements IServerApplication {
  /**
   * Import an Application defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced Application
   * @returns a Construct representing a reference to an existing Application
   */
  public static import(scope: cdk.Construct, id: string, props: ServerApplicationImportProps): IServerApplication {
    return new ImportedServerApplication(scope, id, props);
  }

  public readonly applicationArn: string;
  public readonly applicationName: string;

  constructor(scope: cdk.Construct, id: string, props: ServerApplicationProps = {}) {
    super(scope, id);

    const resource = new CfnApplication(this, 'Resource', {
      applicationName: props.applicationName,
      computePlatform: 'Server',
    });

    this.applicationName = resource.ref;
    this.applicationArn = applicationNameToArn(this.applicationName, this);
  }

  public export(): ServerApplicationImportProps {
    return {
      applicationName: new cdk.CfnOutput(this, 'ApplicationName', { value: this.applicationName }).makeImportValue().toString()
    };
  }
}
