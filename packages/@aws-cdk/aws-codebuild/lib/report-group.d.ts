import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * The interface representing the ReportGroup resource -
 * either an existing one, imported using the
 * `ReportGroup.fromReportGroupName` method,
 * or a new one, created with the `ReportGroup` class.
 */
export interface IReportGroup extends cdk.IResource {
    /**
     * The ARN of the ReportGroup.
     *
     * @attribute
     */
    readonly reportGroupArn: string;
    /**
     * The name of the ReportGroup.
     *
     * @attribute
     */
    readonly reportGroupName: string;
    /**
     * Grants the given entity permissions to write
     * (that is, upload reports to)
     * this report group.
     */
    grantWrite(identity: iam.IGrantable): iam.Grant;
}
declare abstract class ReportGroupBase extends cdk.Resource implements IReportGroup {
    abstract readonly reportGroupArn: string;
    abstract readonly reportGroupName: string;
    protected abstract readonly exportBucket?: s3.IBucket;
    protected abstract readonly type?: ReportGroupType;
    grantWrite(identity: iam.IGrantable): iam.Grant;
}
/**
 * The type of reports in the report group.
 */
export declare enum ReportGroupType {
    /**
     * The report group contains test reports.
     */
    TEST = "TEST",
    /**
     * The report group contains code coverage reports.
     */
    CODE_COVERAGE = "CODE_COVERAGE"
}
/**
 * Construction properties for `ReportGroup`.
 */
export interface ReportGroupProps {
    /**
     * The physical name of the report group.
     *
     * @default - CloudFormation-generated name
     */
    readonly reportGroupName?: string;
    /**
     * An optional S3 bucket to export the reports to.
     *
     * @default - the reports will not be exported
     */
    readonly exportBucket?: s3.IBucket;
    /**
     * Whether to output the report files into the export bucket as-is,
     * or create a ZIP from them before doing the export.
     * Ignored if `exportBucket` has not been provided.
     *
     * @default - false (the files will not be ZIPped)
     */
    readonly zipExport?: boolean;
    /**
     * What to do when this resource is deleted from a stack.
     * As CodeBuild does not allow deleting a ResourceGroup that has reports inside of it,
     * this is set to retain the resource by default.
     *
     * @default RemovalPolicy.RETAIN
     */
    readonly removalPolicy?: cdk.RemovalPolicy;
    /**
     * The type of report group. This can be one of the following values:
     *
     * - **TEST** - The report group contains test reports.
     * - **CODE_COVERAGE** - The report group contains code coverage reports.
     *
     * @default TEST
     */
    readonly type?: ReportGroupType;
}
/**
 * The ReportGroup resource class.
 */
export declare class ReportGroup extends ReportGroupBase {
    /**
     * Reference an existing ReportGroup,
     * defined outside of the CDK code,
     * by name.
     */
    static fromReportGroupName(scope: Construct, id: string, reportGroupName: string): IReportGroup;
    readonly reportGroupArn: string;
    readonly reportGroupName: string;
    protected readonly exportBucket?: s3.IBucket;
    protected readonly type?: ReportGroupType;
    constructor(scope: Construct, id: string, props?: ReportGroupProps);
}
export {};
