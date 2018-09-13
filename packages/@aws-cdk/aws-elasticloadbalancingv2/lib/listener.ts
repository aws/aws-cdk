import cdk = require('@aws-cdk/cdk');
import { cloudformation, ListenerArn } from './elasticloadbalancingv2.generated';
import { ListenerRef } from './listener-ref';
import { LoadBalancerRef } from './load-balancer-ref';
import { TargetGroupRef } from './target-group-ref';
import { Protocol } from './types';
import { determineProtocolAndPort } from './util';

/**
 * Properties for defining a listener
 */
export interface ListenerProps {
    /**
     * The load balancer to attach this listener to
     */
    loadBalancer: LoadBalancerRef;

    /**
     * The protocol to use
     *
     * @default Determined from port if known
     */
    protocol?: Protocol;

    /**
     * The port on which the listener listens for requests.
     *
     * @default Determined from protocol if known
     */
    port?: number;

    /**
     * The certificates to use on this listener
     */
    certificateArns?: cdk.Arn[];

    /**
     * The security policy that defines which ciphers and protocols are supported.
     *
     * @default the current predefined security policy.
     */
    sslPolicy?: SslPolicy;

    /**
     * Default target groups, which will be automatically 'forward'ed to.
     */
    defaultTargets: TargetGroupRef[];
}

/**
 * Define a listener
 */
export class Listener extends ListenerRef {
    public readonly listenerArn: ListenerArn;

    constructor(parent: cdk.Construct, id: string, props: ListenerProps) {
        super(parent, id);

        const [protocol, port] = determineProtocolAndPort(props.protocol, props.port);

        const resource = new cloudformation.ListenerResource(this, 'Resource', {
            loadBalancerArn: props.loadBalancer.loadBalancerArn,
            certificates: props.certificateArns,
            protocol,
            port,
            sslPolicy: props.sslPolicy,
            defaultActions: props.defaultTargets.map(target => ({
                targetGroupArn: target.targetGroupArn,
                // The full spectrum of Actions is not supported via CloudFormation;
                // only 'forward's currently.
                type: 'forward'
            }))
        });

        this.listenerArn = resource.ref;
    }
}

/**
 * Elastic Load Balancing provides the following security policies for Application Load Balancers
 *
 * We recommend the Recommended policy for general use. You can
 * use the ForwardSecrecy policy if you require Forward Secrecy
 * (FS).
 *
 * You can use one of the TLS policies to meet compliance and security
 * standards that require disabling certain TLS protocol versions, or to
 * support legacy clients that require deprecated ciphers.
 *
 * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html
 */
export enum SslPolicy {
    /**
     * The recommended security policy
     */
    Recommended = 'ELBSecurityPolicy-2016-08',

    /**
     * Forward secrecy ciphers only
     */
    ForwardSecrecy = 'ELBSecurityPolicy-FS-2018-06',

    /**
     * TLS1.2 only and no SHA ciphers
     */
    TLS12 = 'ELBSecurityPolicy-TLS-1-2-2017-01',

    /**
     * TLS1.2 only with all ciphers
     */
    TLS12Ext = 'ELBSecurityPolicy-TLS-1-2-Ext-2018-06',

    /**
     * TLS1.1 and higher with all ciphers
     */
    TLS11 = 'ELBSecurityPolicy-TLS-1-1-2017-01',

    /**
     * Support for DES-CBC3-SHA
     *
     * Do not use this security policy unless you must support a legacy client
     * that requires the DES-CBC3-SHA cipher, which is a weak cipher.
     */
    Legacy = 'ELBSecurityPolicy-TLS-1-0-2015-04',
}

/**
 *
 */
export interface Action {
    targetGroup: TargetGroupRef;
}