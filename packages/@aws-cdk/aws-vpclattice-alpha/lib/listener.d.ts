import * as core from 'aws-cdk-lib';
import { aws_vpclattice, aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FixedResponse, PathMatch, HeaderMatch, WeightedTargetGroup, Protocol, HTTPMethods } from './index';
/**
 * Props for AddListener
 */
export interface AddListenerProps {
    /**
     *  The default action that will be taken if no rules match.
     * @default The default action will be to return 404 not found
    */
    readonly defaultAction?: aws_vpclattice.CfnListener.DefaultActionProperty | undefined;
    /**
    * protocol that the listener will listen on
    * @default HTTPS
    * @see vpclattice.Protocol
    */
    readonly protocol?: Protocol | undefined;
    /**
    * Optional port number for the listener. If not supplied, will default to 80 or 443, depending on the Protocol
    * @default 80 or 443 depending on the Protocol
    */
    readonly port?: number | undefined;
    /**
    * The Id of the service that this will be added to.
    */
    readonly name?: string;
}
/**
 * Propertys to Create a Lattice Listener
 */
export interface ListenerProps {
    /**
     *  * A default action that will be taken if no rules match.
     *  @default 404 NOT Found
    */
    readonly defaultAction?: aws_vpclattice.CfnListener.DefaultActionProperty | undefined;
    /**
    * protocol that the listener will listen on
    */
    readonly protocol: Protocol;
    /**
    * Optional port number for the listener. If not supplied, will default to 80 or 443, depending on the Protocol
    * @default 80 or 443 depending on the Protocol
  
    */
    readonly port?: number | undefined;
    /**
    * The Name of the service.
    * @default CloudFormation provided name.
    */
    readonly name?: string;
    /**
     * The service
     */
    readonly serviceId: string;
    /**
     * the authpolicy for the service this listener is associated with
     * @default none.
     */
    readonly serviceAuthPolicy?: iam.PolicyDocument | undefined;
}
/**
 * Create a vpcLattice Listener.
 * Implemented by `Listener`.
 */
export interface IListener extends core.IResource {
    /**
    * The Amazon Resource Name (ARN) of the service.
    */
    readonly listenerArn: string;
    /**
    * The Id of the Service Network
    */
    readonly listenerId: string;
    /**
     * Add A Listener Rule to the Listener
     */
    addListenerRule(props: AddRuleProps): void;
}
/**
 * Properties to add rules to to a listener
 * One of headerMatch, PathMatch, or methodMatch can be supplied,
 * the Rule can not match multiple Types
 */
export interface AddRuleProps {
    /**
    * A name for the the Rule
    */
    readonly name: string;
    /**
    * the action for the rule, is either a fixed Reponse, or a being sent to  Weighted TargetGroup
    */
    readonly action: FixedResponse | WeightedTargetGroup[];
    /**
    * the priority of this rule, a lower priority will be processed first
    */
    readonly priority: number;
    /** Properties for a header match
    * A header match can search for multiple headers
    * @default none
    */
    readonly headerMatchs?: HeaderMatch[] | undefined;
    /**
    * Properties for a Path Match
    * @default none
    */
    readonly pathMatch?: PathMatch | undefined;
    /**
    * Properties for a method Match
    * @default none
    */
    readonly methodMatch?: HTTPMethods | undefined;
    /**
     * AuthPolicy for rule
     * @default none
    */
    readonly allowedPrincipals?: iam.IPrincipal[] | undefined;
}
/**
 *  This class should not be called directly.
 *  Use the .addListener() Method on an instance of LatticeService
 *  Creates a vpcLattice Listener
 */
export declare class Listener extends core.Resource implements IListener {
    /**
     *  The Id of the Listener
     */
    readonly listenerId: string;
    /**
     * THe Arn of the Listener
     */
    readonly listenerArn: string;
    /**
     * A list of prioritys, to check for duplicates
     */
    listenerPrioritys: number[];
    /**
     * The Id of the service this listener is attached to
     */
    readonly serviceId: string;
    /**
     * Service auth Policy
     * @default none.
     */
    readonly serviceAuthPolicy?: iam.PolicyDocument | undefined;
    constructor(scope: Construct, id: string, props: ListenerProps);
    /**
     * add a rule to the listener
     * @param props AddRuleProps
     */
    addListenerRule(props: AddRuleProps): void;
}
