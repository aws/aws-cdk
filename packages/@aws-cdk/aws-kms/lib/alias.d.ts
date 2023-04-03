import * as iam from '@aws-cdk/aws-iam';
import { RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IKey } from './key';
/**
 * A KMS Key alias.
 * An alias can be used in all places that expect a key.
 */
export interface IAlias extends IKey {
    /**
     * The name of the alias.
     *
     * @attribute
     */
    readonly aliasName: string;
    /**
     * The Key to which the Alias refers.
     *
     * @attribute
     */
    readonly aliasTargetKey: IKey;
}
/**
 * Construction properties for a KMS Key Alias object.
 */
export interface AliasProps {
    /**
     * The name of the alias. The name must start with alias followed by a
     * forward slash, such as alias/. You can't specify aliases that begin with
     * alias/AWS. These aliases are reserved.
     */
    readonly aliasName: string;
    /**
     * The ID of the key for which you are creating the alias. Specify the key's
     * globally unique identifier or Amazon Resource Name (ARN). You can't
     * specify another alias.
     */
    readonly targetKey: IKey;
    /**
     * Policy to apply when the alias is removed from this stack.
     *
     * @default - The alias will be deleted
     */
    readonly removalPolicy?: RemovalPolicy;
}
declare abstract class AliasBase extends Resource implements IAlias {
    abstract readonly aliasName: string;
    abstract readonly aliasTargetKey: IKey;
    get keyArn(): string;
    get keyId(): string;
    addAlias(alias: string): Alias;
    addToResourcePolicy(statement: iam.PolicyStatement, allowNoOp?: boolean): iam.AddToResourcePolicyResult;
    grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
    grantDecrypt(grantee: iam.IGrantable): iam.Grant;
    grantEncrypt(grantee: iam.IGrantable): iam.Grant;
    grantEncryptDecrypt(grantee: iam.IGrantable): iam.Grant;
}
/**
 * Properties of a reference to an existing KMS Alias
 */
export interface AliasAttributes {
    /**
     * Specifies the alias name. This value must begin with alias/ followed by a name (i.e. alias/ExampleAlias)
     */
    readonly aliasName: string;
    /**
     * The customer master key (CMK) to which the Alias refers.
     */
    readonly aliasTargetKey: IKey;
}
/**
 * Defines a display name for a customer master key (CMK) in AWS Key Management
 * Service (AWS KMS). Using an alias to refer to a key can help you simplify key
 * management. For example, when rotating keys, you can just update the alias
 * mapping instead of tracking and changing key IDs. For more information, see
 * Working with Aliases in the AWS Key Management Service Developer Guide.
 *
 * You can also add an alias for a key by calling `key.addAlias(alias)`.
 *
 * @resource AWS::KMS::Alias
 */
export declare class Alias extends AliasBase {
    /**
     * Import an existing KMS Alias defined outside the CDK app.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param attrs the properties of the referenced KMS Alias
     */
    static fromAliasAttributes(scope: Construct, id: string, attrs: AliasAttributes): IAlias;
    /**
     * Import an existing KMS Alias defined outside the CDK app, by the alias name. This method should be used
     * instead of 'fromAliasAttributes' when the underlying KMS Key ARN is not available.
     * This Alias will not have a direct reference to the KMS Key, so addAlias and grant* methods are not supported.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param aliasName The full name of the KMS Alias (e.g., 'alias/aws/s3', 'alias/myKeyAlias').
     */
    static fromAliasName(scope: Construct, id: string, aliasName: string): IAlias;
    readonly aliasName: string;
    readonly aliasTargetKey: IKey;
    constructor(scope: Construct, id: string, props: AliasProps);
    protected generatePhysicalName(): string;
}
export {};
