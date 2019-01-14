import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import { CfnVpcLink } from './apigateway.generated';

/**
 * Properties for a VpcLink
 */
export interface VpcLinkProps {
    /**
     * The name used to label and identify the VPC link.
     */
    name: string;

    /**
     * The description of the VPC link.
     */
    description?: string;

    /**
     * The network load balancers of the VPC targeted by the VPC link.
     * The network load balancers must be owned by the same AWS account of the API owner.
     */
    targets: elbv2.NetworkLoadBalancer[];
}

/**
 * Define a new VPC Link
 * Specifies an API Gateway VPC link for a RestApi to access resources in an Amazon Virtual Private Cloud (VPC).
 */
export class VpcLink extends cdk.Construct {

    private readonly cfnResource: CfnVpcLink;

    constructor(scope: cdk.Construct, id: string, props: VpcLinkProps) {
        super(scope, id);

        this.cfnResource = new CfnVpcLink(this, 'Resource', {
            name: props.name,
            description: props.description,
            targetArns: props.targets.map(nlb => nlb.loadBalancerArn)
        });
    }

    public get vpcLinkId() {
        return this.cfnResource.vpcLinkId;
    }

}