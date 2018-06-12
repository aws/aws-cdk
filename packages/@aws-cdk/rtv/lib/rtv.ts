import { Arn, AwsStackName, Construct, FnConcat, PolicyStatement } from '@aws-cdk/core';
import { IIdentityResource } from '@aws-cdk/iam';
import { ssm } from '@aws-cdk/resources';

export interface RuntimeValueProps {
    package: string;
    value: any;
}

export class RuntimeValue extends Construct {
    public static readonly ENV_NAME = 'RTV_STACK_NAME';
    public static readonly ENV_VALUE = new AwsStackName();

    private static readonly SSM_READ_ACTIONS = [
        'ssm:DescribeParameters',
        'ssm:GetParameters',
        'ssm:GetParameter'
    ];

    public readonly parameterName: any;

    constructor(parent: Construct, name: string, props: RuntimeValueProps) {
        super(parent, name);

        this.parameterName = new FnConcat('/rtv/', new AwsStackName(), '/', props.package, '@', name);

        new ssm.ParameterResource(this, 'Parameter', {
            parameterName: this.parameterName,
            type: 'String',
            value: props.value,
        });
    }

    get arn() {
        return Arn.fromComponents({
            service: 'ssm',
            resource: 'parameter',
            resourceName: this.parameterName
        });
    }

    public grantReadPermissions(principal: IIdentityResource) {
        principal.addToPolicy(new PolicyStatement()
            .addResource(this.arn)
            .addActions(...RuntimeValue.SSM_READ_ACTIONS));
    }
}
