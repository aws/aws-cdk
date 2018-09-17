import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { cloudformation, ListenerArn } from './elasticloadbalancingv2.generated';
import { ListenerRef } from './listener-ref';
import { LoadBalancerRef } from './load-balancer-ref';
import { TargetGroupRef } from './target-group-ref';
import { Protocol } from './types';
import { determineProtocolAndPort } from './util';

/**
 * Properties for a listener on a load balancer
 */
export interface BaseListenerProps {
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
}

/**
 * Properties for defining a listener
 */
export interface ListenerProps extends BaseListenerProps {
    /**
     * The load balancer to attach this listener to
     */
    loadBalancer: LoadBalancerRef;
}

/**
 * Define a listener
 */
export class Listener extends ListenerRef {
    public readonly connections: ec2.Connections;
    public readonly listenerArn: ListenerArn;
    private readonly defaultActions: any[] = [];

    constructor(parent: cdk.Construct, id: string, props: ListenerProps) {
        super(parent, id);

        const [protocol, port] = determineProtocolAndPort(props.protocol, props.port);

        const resource = new cloudformation.ListenerResource(this, 'Resource', {
            loadBalancerArn: props.loadBalancer.loadBalancerArn,
            certificates: props.certificateArns,
            protocol,
            port,
            sslPolicy: props.sslPolicy,
            defaultActions: new cdk.Token(() => this.renderActions())
        });

        // This listener edits the securitygroup of the load balancer,
        // but adds its own default port.
        this.connections = new ec2.Connections({
            securityGroup: props.loadBalancer.connections.securityGroup,
            defaultPortRange: new ec2.TcpPort(port),
        });

        this.listenerArn = resource.ref;
    }

    /**
     * Add a TargetGroup to load balance to
     */
    public addDefaultTargetGroup(targetGroup: TargetGroupRef) {
        this.defaultActions.push({
            targetGroupArn: targetGroup.targetGroupArn,
            type: 'forward'
        });
        this.registerTargetGroup(targetGroup);
        return targetGroup;
    }

    private renderActions() {
        if (this.defaultActions.length === 0) {
            throw new Error('Listener needs at least one default action');
        }
        return this.defaultActions;
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