import { Resource, ResourceProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AuthorizationType } from './method';
import { IRestApi } from './restapi';
/**
 * Base class for all custom authorizers
 */
export declare abstract class Authorizer extends Resource implements IAuthorizer {
    /**
     * Return whether the given object is an Authorizer.
     */
    static isAuthorizer(x: any): x is Authorizer;
    abstract readonly authorizerId: string;
    readonly authorizationType?: AuthorizationType;
    constructor(scope: Construct, id: string, props?: ResourceProps);
    /**
     * Called when the authorizer is used from a specific REST API.
     * @internal
     */
    abstract _attachToApi(restApi: IRestApi): void;
}
/**
 * Represents an API Gateway authorizer.
 */
export interface IAuthorizer {
    /**
     * The authorizer ID.
     * @attribute
     */
    readonly authorizerId: string;
    /**
     * The authorization type of this authorizer.
     */
    readonly authorizationType?: AuthorizationType;
}
