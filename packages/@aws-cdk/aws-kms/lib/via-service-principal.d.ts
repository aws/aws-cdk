import * as iam from '@aws-cdk/aws-iam';
/**
 * A principal to allow access to a key if it's being used through another AWS service
 */
export declare class ViaServicePrincipal extends iam.PrincipalBase {
    private readonly serviceName;
    private readonly basePrincipal;
    constructor(serviceName: string, basePrincipal?: iam.IPrincipal);
    get policyFragment(): iam.PrincipalPolicyFragment;
    dedupeString(): string | undefined;
}
