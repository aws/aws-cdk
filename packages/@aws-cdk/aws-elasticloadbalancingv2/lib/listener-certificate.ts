import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './elasticloadbalancingv2.generated';
import { ListenerRef } from './listener-ref';

/**
 * Properties for adding a set of certificates to a listener
 */
export interface ListenerCertificateProps {
    /**
     * The listener to attach the rule to
     */
    listener: ListenerRef;

    /**
     * ARNs of certificates to attach
     *
     * Duplicates are not allowed.
     */
    certificateArns: cdk.Arn[];
}

/**
 * Add certificates to a listener
 */
export class ListenerCertificate extends cdk.Construct implements cdk.IDependable {
    /**
     * The elements of this resou rce to add ordering dependencies on
     */
    public readonly dependencyElements: cdk.IDependable[] = [];

    constructor(parent: cdk.Construct, id: string, props: ListenerCertificateProps) {
        super(parent, id);

        const resource = new cloudformation.ListenerCertificateResource(this, 'Resource', {
            listenerArn: props.listener.listenerArn,
            certificates: props.certificateArns,
        });

        this.dependencyElements.push(resource);
    }
}