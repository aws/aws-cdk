import cdk = require('@aws-cdk/cdk');
import { cloudformation, RepositoryArn, RepositoryName } from './ecr.generated';
import { Action, CountType, CountUnit, LifecycleRule, TagStatus } from './lifecycle';
import { RepositoryRef } from "./repository-ref";

export interface RepositoryProps {
    /**
     * Name for this repository
     *
     * @default Automatically generated name.
     */
    repositoryName?: string;

    /**
     * Life cycle rules to apply to this registry
     *
     * @default No life cycle rules
     */
    lifecycleRules?: LifecycleRule[];

    /**
     * The AWS account ID associated with the registry that contains the repository.
     *
     * @default The default registry is assumed.
     */
    lifecycleRegistryId?: string;

    /**
     * Retain the registry on stack deletion
     *
     * If you don't set this to true, the registry must be empty, otherwise
     * your stack deletion will fail.
     *
     * @default false
     */
    retain?: boolean;
}

/**
 * Define an ECR repository
 */
export class Repository extends RepositoryRef {
    public readonly repositoryName: RepositoryName;
    public readonly repositoryArn: RepositoryArn;
    private readonly lifecycleRules = new Array<LifecycleRule>();
    private readonly registryId?: string;
    private policyDocument?: cdk.PolicyDocument;

    constructor(parent: cdk.Construct, id: string, props: RepositoryProps = {}) {
        super(parent, id);

        const resource = new cloudformation.RepositoryResource(this, 'Resource', {
            repositoryName: props.repositoryName,
            // It says "Text", but they actually mean "Object".
            repositoryPolicyText: this.policyDocument,
            lifecyclePolicy: new cdk.Token(() => cdk.resolve(this.renderLifecyclePolicy())),
        });

        if (props.retain) {
            resource.options.deletionPolicy = cdk.DeletionPolicy.Retain;
        }

        this.registryId = props.lifecycleRegistryId;
        if (props.lifecycleRules) {
            props.lifecycleRules.forEach(this.addLifecycleRule.bind(this));
        }

        this.repositoryName = resource.ref;
        this.repositoryArn = resource.repositoryArn;
    }

    public addToResourcePolicy(statement: cdk.PolicyStatement) {
        if (this.policyDocument === undefined) {
            this.policyDocument = new cdk.PolicyDocument();
        }
        this.policyDocument.addStatement(statement);
    }

    public addLifecycleRule(rule: LifecycleRule) {
        this.lifecycleRules.push(rule);
    }

    private renderLifecyclePolicy(): cloudformation.RepositoryResource.LifecyclePolicyProperty | undefined {
        let lifecyclePolicyText: any;

        if (this.lifecycleRules.length === 0 && !this.registryId) { return undefined; }

        if (this.lifecycleRules.length > 0) {
            lifecyclePolicyText = JSON.stringify({
                rules: this.lifecycleRules.map(renderLifecycleRule),
            });
        }

        return {
            lifecyclePolicyText,
            registryId: this.registryId,
        };
    }
}

/**
 * Render the lifecycle rule to JSON
 */
function renderLifecycleRule(rule: LifecycleRule) {
    if (rule.tagStatus === TagStatus.Tagged && (rule.tagPrefixList === undefined || rule.tagPrefixList.length === 0)) {
        throw new Error('TagStatus.Tagged requires the specification of a tagPrefixList');
    }
    if (rule.tagStatus !== TagStatus.Tagged && rule.tagPrefixList !== undefined) {
        throw new Error('tagPrefixList can only be specified when tagStatus is set to Tagged');
    }

    if (rule.countType !== CountType.SinceImagePushed && rule.countUnit !== undefined) {
        throw new Error('countUnit can only be specified when countType is set to SinceImagePushed');
    }

    if (rule.countUnit === CountUnit._) {
        throw new Error('Do not use CountUnit._');
    }

    if (rule.action === Action._) {
        throw new Error('Do not use Action._');
    }

    return {
        rulePriority: rule.rulePriority,
        description: rule.description,
        selection: {
            tagStatus: rule.tagStatus || TagStatus.Any,
            tagPrefixList: rule.tagPrefixList,
            countType: rule.countType,
            countNumber: rule.countNumber,
            countUnit: rule.countType === CountType.SinceImagePushed ? (rule.countUnit || CountUnit.Days) : undefined,
        },
        action: {
            type: rule.action || Action.Expire
        }
    };
}
