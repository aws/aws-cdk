import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { Construct } from 'constructs';
import { Action } from './action';
/**
 * Construction properties of the `ManualApprovalAction`.
 */
export interface ManualApprovalActionProps extends codepipeline.CommonAwsActionProps {
    /**
     * Optional SNS topic to send notifications to when an approval is pending.
     */
    readonly notificationTopic?: sns.ITopic;
    /**
     * A list of email addresses to subscribe to notifications when this Action is pending approval.
     * If this has been provided, but not `notificationTopic`,
     * a new Topic will be created.
     */
    readonly notifyEmails?: string[];
    /**
     * Any additional information that you want to include in the notification email message.
     */
    readonly additionalInformation?: string;
    /**
     * URL you want to provide to the reviewer as part of the approval request.
     *
     * @default - the approval request will not have an external link
     */
    readonly externalEntityLink?: string;
}
/**
 * Manual approval action.
 */
export declare class ManualApprovalAction extends Action {
    /**
     * The SNS Topic passed when constructing the Action.
     * If no Topic was passed, but `notifyEmails` were provided,
     * a new Topic will be created.
     */
    private _notificationTopic?;
    private readonly props;
    private stage?;
    constructor(props: ManualApprovalActionProps);
    get notificationTopic(): sns.ITopic | undefined;
    /**
     * grant the provided principal the permissions to approve or reject this manual approval action
     *
     * For more info see:
     * https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals-iam-permissions.html
     *
     * @param grantable the grantable to attach the permissions to
     */
    grantManualApproval(grantable: iam.IGrantable): void;
    protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
