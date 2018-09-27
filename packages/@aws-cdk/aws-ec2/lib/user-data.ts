import cdk = require('@aws-cdk/cdk');
import { CloudFormationInit } from './cloudformation-init';
import { OperatingSystem, UserDataOptions } from './machine-image';

/**
 * Properties for creating a UserData
 */
export interface UserDataProps extends UserDataOptions {
    /**
     * Operating system to generate UserData for
     */
    os: OperatingSystem;

    /**
     * Default resource to generate signals for
     */
    defaultResource?: cdk.Resource;
}

/**
 * Class that represents user data
 */
export class UserData extends cdk.Construct {
    private readonly lines = new Array<string>();
    private readonly os: OperatingSystem;

    constructor(parent: cdk.Construct, id: string, private readonly props: UserDataProps ) {
        super(parent, id);
        this.os = props.os;
    }

    /**
     * Add a literal command to the userdata
     */
    public addCommand(...lines: string[]) {
        this.lines.push(...lines);
    }

    /**
     * Add a command to signal a resource
     */
    public addResourceSignalCommand(options: ResourceSignalOptions = {}) {
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-signal.html
        const resource = options.resource || this.props.defaultResource;
        if (!resource) {
            throw new Error('UserData does not have a default resource; please provide an explicit resource to signal');
        }

        const parts = ['cfn-signal',
            `--region ${new cdk.AwsRegion()}`,
            `--stack ${new cdk.AwsStackId()}`,
            `--resource ${resource.logicalId}`
        ];

        if (options.success === undefined) {
            // Use most recent command's exit code
            parts.push('--exit-code $?');
        } else {
            // Rely on stringification of booleans here
            parts.push(`--success ${options.success}`);
        }

        if (options.data) {
            parts.push(`--data "${options.data}"`);
        }
        if (options.reason) {
            parts.push(`--reason "${options.reason}"`);
        }

        this.addCommand(parts.join(' '));
    }

    /**
     * Add a command to apply CloudFormation Init
     */
    public addInitCommand(options: InitCommandOptions) {
        const configSets = options.configSets || ['default'];

        const parts = ['cfn-init',
            '-v',
            `--region ${new cdk.AwsRegion()}`,
            `--stack ${new cdk.AwsStackId()}`,
            `--resource ${options.init.initResourceId}`,
            `--configsets ${configSets.join(',')}`
        ];

        this.addCommand(parts.join(' '));
        this.addResourceSignalCommand();
    }

    /**
     * Return the UserData for the instance or AutoScalingGroup
     */
    public render() {
        return this.os.createUserData(this.lines, this.props);
    }
}

/**
 * What resource to signal
 */
export interface ResourceSignalOptions {
    /**
     * Whether to signal success
     *
     * @default Use exit code of most recent command
     */
    success?: boolean;

    /**
     * Resource to send signal for
     *
     * @default Current Instance or AutoScalingGroup
     */
    resource?: cdk.Resource;

    /**
     * Data to include in the signal
     */
    data?: string;

    /**
     * Reason for the signal
     */
    reason?: string;
}

/**
 * What Init configuration to apply
 */
export interface InitCommandOptions {
    /**
     * The CloudFormation Init object to read configurations from
     */
    init: CloudFormationInit;

    /**
     * Names of config sets to run
     *
     * @default ['default']
     */
    configSets?: string[];
}