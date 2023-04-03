import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Manages a bunch of singleton-y statements on the policy of an IAM Role.
 * Dedicated methods can be used to add specific permissions to the role policy
 * using as few statements as possible (adding resources to existing compatible
 * statements instead of adding new statements whenever possible).
 *
 * Statements created outside of this class are not considered when adding new
 * permissions.
 */
export declare class SingletonPolicy extends Construct implements iam.IGrantable {
    private readonly role;
    /**
     * Obtain a SingletonPolicy for a given role.
     * @param role the Role this policy is bound to.
     * @returns the SingletonPolicy for this role.
     */
    static forRole(role: iam.IRole): SingletonPolicy;
    private static readonly UUID;
    readonly grantPrincipal: iam.IPrincipal;
    private statements;
    private constructor();
    grantExecuteChangeSet(props: {
        stackName: string;
        changeSetName: string;
        region?: string;
    }): void;
    grantCreateReplaceChangeSet(props: {
        stackName: string;
        changeSetName: string;
        region?: string;
    }): void;
    grantCreateUpdateStack(props: {
        stackName: string;
        replaceOnFailure?: boolean;
        region?: string;
    }): void;
    grantCreateUpdateStackSet(props: {
        stackSetName: string;
        region?: string;
    }): void;
    grantDeleteStack(props: {
        stackName: string;
        region?: string;
    }): void;
    grantPassRole(role: iam.IRole | string): void;
    private statementFor;
    private stackArnFromProps;
    private stackSetArnFromProps;
}
export interface StatementTemplate {
    actions: string[];
    conditions?: StatementCondition;
}
export declare type StatementCondition = {
    [op: string]: {
        [attribute: string]: string;
    };
};
export declare function parseCapabilities(capabilities: cdk.CfnCapabilities[] | undefined): string | undefined;
