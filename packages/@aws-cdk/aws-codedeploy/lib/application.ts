import cdk = require('@aws-cdk/cdk');
import { ApplicationName, cloudformation } from './codedeploy.generated';

export class ApplicationArn extends cdk.Arn {}

/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Application.
 *
 * @see ServerApplicationRef#import
 * @see ServerApplicationRef#export
 */
export interface ServerApplicationRefProps {
    /**
     * The physical, human-readable name of the CodeDeploy EC2/on-premise Application we're referencing.
     * The Application must be in the same account and region as the root Stack.
     */
    applicationName: ApplicationName;
}

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
export abstract class ServerApplicationRef extends cdk.Construct {
    /**
     * Import an Application defined either outside the CDK,
     * or in a different CDK Stack and exported using the {@link #export} method.
     *
     * @param parent the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param props the properties of the referenced Application
     * @returns a Construct representing a reference to an existing Application
     */
    public static import(parent: cdk.Construct, id: string, props: ServerApplicationRefProps): ServerApplicationRef {
        return new ImportedServerApplicationRef(parent, id, props);
    }

    public abstract readonly applicationArn: ApplicationArn;

    public abstract readonly applicationName: ApplicationName;

    public export(): ServerApplicationRefProps {
        return {
            applicationName: new ApplicationName(new cdk.Output(this, 'ApplicationName', { value: this.applicationName }).makeImportValue()),
        };
    }
}

class ImportedServerApplicationRef extends ServerApplicationRef {
    public readonly applicationArn: ApplicationArn;
    public readonly applicationName: ApplicationName;

    constructor(parent: cdk.Construct, id: string, props: ServerApplicationRefProps) {
        super(parent, id);

        this.applicationName = props.applicationName;
        this.applicationArn = applicationName2Arn(this.applicationName);
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
export class ServerApplication extends ServerApplicationRef {
    public readonly applicationArn: ApplicationArn;
    public readonly applicationName: ApplicationName;

    constructor(parent: cdk.Construct, id: string, props?: ServerApplicationProps) {
        super(parent, id);

        const resource = new cloudformation.ApplicationResource(this, 'Resource', {
            applicationName: props && props.applicationName,
            computePlatform: 'Server',
        });

        this.applicationName = resource.ref;
        this.applicationArn = applicationName2Arn(this.applicationName);
    }
}

function applicationName2Arn(applicationName: ApplicationName): ApplicationArn {
    return cdk.Arn.fromComponents({
        service: 'codedeploy',
        resource: 'application',
        resourceName: applicationName,
        sep: ':',
    });
}
