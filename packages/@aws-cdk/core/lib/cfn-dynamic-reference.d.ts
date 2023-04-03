import { Intrinsic } from './private/intrinsic';
/**
 * Properties for a Dynamic Reference
 */
export interface CfnDynamicReferenceProps {
    /**
     * The service to retrieve the dynamic reference from
     */
    readonly service: CfnDynamicReferenceService;
    /**
     * The reference key of the dynamic reference
     */
    readonly referenceKey: string;
}
/**
 * References a dynamically retrieved value
 *
 * This is a Construct so that subclasses will (eventually) be able to attach
 * metadata to themselves without having to change call signatures.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
 */
export declare class CfnDynamicReference extends Intrinsic {
    constructor(service: CfnDynamicReferenceService, key: string);
}
/**
 * The service to retrieve the dynamic reference from
 */
export declare enum CfnDynamicReferenceService {
    /**
     * Plaintext value stored in AWS Systems Manager Parameter Store
     */
    SSM = "ssm",
    /**
     * Secure string stored in AWS Systems Manager Parameter Store
     */
    SSM_SECURE = "ssm-secure",
    /**
     * Secret stored in AWS Secrets Manager
     */
    SECRETS_MANAGER = "secretsmanager"
}
