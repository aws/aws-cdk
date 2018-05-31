import { Token } from '../core/tokens';
import { FnConcat } from './fn';
import { AwsAccountId, AwsPartition } from './pseudo';

export class PolicyDocument extends Token {
    private statements = new Array<PolicyStatement>();

    /**
     * Creates a new IAM policy document.
     * @param defaultDocument An IAM policy document to use as an initial
     * policy. All statements of this document will be copied in.
     */
    constructor(private readonly baseDocument?: any) {
        super();
    }

    public resolve(): any {
        if (this.isEmpty) {
            return undefined;
        }

        const doc = this.baseDocument || { };
        doc.Statement = doc.Statement || [ ];
        doc.Version = doc.Version || '2012-10-17';
        doc.Statement = doc.Statement.concat(this.statements);
        return doc;
    }

    get isEmpty(): boolean {
        return this.statements.length === 0;
    }

    public addStatement(statement: PolicyStatement): PolicyDocument {
        this.statements.push(statement);
        return this;
    }
}

/**
 * Represents an IAM principal.
 */
export abstract class PolicyPrincipal {
    public abstract toJson(): any;
}

export class ArnPrincipal extends PolicyPrincipal {
    constructor(public readonly arn: any) {
        super();
    }

    public toJson(): any {
        return { AWS: this.arn };
    }
}

export class AccountPrincipal extends ArnPrincipal {
    constructor(public readonly accountId: any) {
        super(new FnConcat('arn:', new AwsPartition(), ':iam::', accountId, ':root'));
    }
}

/**
 * An IAM principal that represents an AWS service (i.e. sqs.amazonaws.com).
 */
export class ServicePrincipal extends PolicyPrincipal {
    constructor(public readonly service: any) {
        super();
    }

    public toJson(): any {
        return { Service: this.service };
    }
}

/**
 * A policy prinicipal for canonicalUserIds - useful for S3 bucket policies that use
 * Origin Access identities.
 *
 * See https://docs.aws.amazon.com/general/latest/gr/acct-identifiers.html
 *
 * and
 *
 * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
 *
 * for more details.
 *
 */
export class CanonicalUserPrincipal extends PolicyPrincipal {
    constructor(public readonly canonicalUserId: any) {
        super();
    }

    public toJson(): any {
        return { CanonicalUser: this.canonicalUserId };
    }
}

export class FederatedPrincipal extends PolicyPrincipal {
    constructor(public readonly federated: any) {
        super();
    }

    public toJson(): any {
        return { Federated: this.federated };
    }
}

export class AccountRootPrincipal extends AccountPrincipal {
    constructor() {
        super(new AwsAccountId());
    }
}

/**
 * A principal representing all identities in all accounts
 */
export class Anyone extends PolicyPrincipal {
    /**
     * Interface compatibility with AccountPrincipal for the purposes of the Lambda library
     *
     * The Lambda's addPermission() call works differently from regular
     * statements, and will use the value of this property directly if present
     * (which leads to the correct statement ultimately).
     */
    public readonly accountId = '*';

    public toJson() {
        return '*';
    }
}

/**
 * Represents a statement in an IAM policy document.
 */
export class PolicyStatement extends Token {
    private action = new Array<any>();
    private principal = new Array<any>();
    private resource = new Array<any>();
    private condition: { [key: string]: any } = { };
    private effect?: PolicyStatement.Effect;
    private sid?: string;

    constructor(effect: PolicyStatement.Effect = PolicyStatement.Effect.Allow) {
        super();
        this.effect = effect;
    }

    //
    // Actions
    //

    public addAction(action: string): PolicyStatement {
        this.action.push(action);
        return this;
    }

    public addActions(...actions: string[]): PolicyStatement {
        actions.forEach(action => this.addAction(action));
        return this;
    }

    //
    // Principal
    //

    /**
     * Indicates if this permission has a "Principal" section.
     */
    public get hasPrincipal() {
        return this.principal && this.principal.length > 0;
    }

    public addPrincipal(principal: PolicyPrincipal): PolicyStatement {
        this.principal.push(principal.toJson());
        return this;
    }

    public addAwsPrincipal(arn: any): PolicyStatement {
        return this.addPrincipal(new ArnPrincipal(arn));
    }

    public addAwsAccountPrincipal(accountId: any): PolicyStatement {
        return this.addPrincipal(new AccountPrincipal(accountId));
    }

    public addServicePrincipal(service: any): PolicyStatement {
        return this.addPrincipal(new ServicePrincipal(service));
    }

    public addFederatedPrincipal(federated: any): PolicyStatement {
        return this.addPrincipal(new FederatedPrincipal(federated));
    }

    public addAccountRootPrincipal(): PolicyStatement {
        return this.addPrincipal(new AccountRootPrincipal());
    }

    //
    // Resources
    //

    public addResource(resource: any): PolicyStatement {
        this.resource.push(resource);
        return this;
    }

    /**
     * Adds a ``"*"`` resource to this statement.
     */
    public addAllResources(): PolicyStatement {
        return this.addResource('*');
    }

    public addResources(...resources: any[]): PolicyStatement {
        resources.forEach(r => this.addResource(r));
        return this;
    }

    /**
     * Indicates if this permission as at least one resource associated with it.
     */
    public get hasResource() {
        return this.resource && this.resource.length > 0;
    }

    /**
     * Indicates if this permission has only a ``"*"`` resource associated with it.
     */
    public get isOnlyStarResource() {
        return this.resource && this.resource.length === 1 && this.resource[0] === '*';
    }

    public describe(sid: string): PolicyStatement {
        this.sid = sid;
        return this;
    }

    //
    // Effect
    //

    /**
     * Sets the permission effect to deny access to resources.
     */
    public allow(): PolicyStatement {
        this.effect = PolicyStatement.Effect.Allow;
        return this;
    }

    /**
     * Sets the permission effect to allow access to resources.
     */
    public deny(): PolicyStatement {
        this.effect = PolicyStatement.Effect.Deny;
        return this;
    }

    //
    // Condition
    //

    public setCondition(key: string, value: any): PolicyStatement {
        this.condition[key] = value;
        return this;
    }

    public limitToAccount(accountId: any): PolicyStatement {
        return this.setCondition('StringEquals', new Token(() => {
            return { 'sts:ExternalId': accountId };
        }));
    }

    //
    // Serialization
    //

    public resolve(): any {
        return this.toJson();
    }

    public toJson(): any {
        return {
            Action: _norm(this.action),
            Condition: _norm(this.condition),
            Effect: _norm(this.effect),
            Principal: _norm(this.principal),
            Resource: _norm(this.resource),
            Sid: _norm(this.sid),
        };

        function _norm(values: any) {

            if (typeof(values) === 'undefined') {
                return undefined;
            }

            if (Array.isArray(values)) {
                if (!values || values.length === 0) {
                    return undefined;
                }

                if (values.length === 1) {
                    return values[0];
                }
            }

            if (typeof(values) === 'object') {
                if (Object.keys(values).length === 0) {
                    return undefined;
                }
            }

            return values;
        }
    }
}

export namespace PolicyStatement {
    export enum Effect {
        Allow = 'Allow',
        Deny = 'Deny',
    }
}
