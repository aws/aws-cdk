/**
 * The deployment environment for a stack.
 */
export interface Environment {
    /**
     * The AWS account ID for this environment.
     *
     * This can be either a concrete value such as `585191031104` or `Aws.ACCOUNT_ID` which
     * indicates that account ID will only be determined during deployment (it
     * will resolve to the CloudFormation intrinsic `{"Ref":"AWS::AccountId"}`).
     * Note that certain features, such as cross-stack references and
     * environmental context providers require concrete region information and
     * will cause this stack to emit synthesis errors.
     *
     * @default Aws.ACCOUNT_ID which means that the stack will be account-agnostic.
     */
    readonly account?: string;
    /**
     * The AWS region for this environment.
     *
     * This can be either a concrete value such as `eu-west-2` or `Aws.REGION`
     * which indicates that account ID will only be determined during deployment
     * (it will resolve to the CloudFormation intrinsic `{"Ref":"AWS::Region"}`).
     * Note that certain features, such as cross-stack references and
     * environmental context providers require concrete region information and
     * will cause this stack to emit synthesis errors.
     *
     * @default Aws.REGION which means that the stack will be region-agnostic.
     */
    readonly region?: string;
}
