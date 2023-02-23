import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnReportGroup } from './codebuild.generated';
import { renderReportGroupArn, reportGroupArnComponents } from './report-group-utils';

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

abstract class ReportGroupBase extends cdk.Resource implements IReportGroup {
  public abstract readonly reportGroupArn: string;
  public abstract readonly reportGroupName: string;
  protected abstract readonly exportBucket?: s3.IBucket;
  protected abstract readonly type?: ReportGroupType;

  public grantWrite(identity: iam.IGrantable): iam.Grant {
    const typeAction = this.type === ReportGroupType.CODE_COVERAGE ? 'codebuild:BatchPutCodeCoverages' : 'codebuild:BatchPutTestCases';
    const ret = iam.Grant.addToPrincipal({
      grantee: identity,
      actions: [
        'codebuild:CreateReport',
        'codebuild:UpdateReport',
        typeAction,
      ],
      resourceArns: [this.reportGroupArn],
    });

    if (this.exportBucket) {
      this.exportBucket.grantWrite(identity);
    }

    return ret;
  }
}

/**
 * The type of reports in the report group.
 */
export enum ReportGroupType {
  /**
   * The report group contains test reports.
   */
  TEST = 'TEST',
  /**
   * The report group contains code coverage reports.
   */
  CODE_COVERAGE = 'CODE_COVERAGE'
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
  readonly type?: ReportGroupType
}

/**
 * The ReportGroup resource class.
 */
export class ReportGroup extends ReportGroupBase {

  /**
   * Reference an existing ReportGroup,
   * defined outside of the CDK code,
   * by name.
   */
  public static fromReportGroupName(scope: Construct, id: string, reportGroupName: string): IReportGroup {
    class Import extends ReportGroupBase {
      public readonly reportGroupName = reportGroupName;
      public readonly reportGroupArn = renderReportGroupArn(scope, reportGroupName);
      protected readonly exportBucket = undefined;
      protected readonly type = undefined;
    }

    return new Import(scope, id);
  }

  public readonly reportGroupArn: string;
  public readonly reportGroupName: string;
  protected readonly exportBucket?: s3.IBucket;
  protected readonly type?: ReportGroupType;

  constructor(scope: Construct, id: string, props: ReportGroupProps = {}) {
    super(scope, id, {
      physicalName: props.reportGroupName,
    });
    this.type = props.type ? props.type : ReportGroupType.TEST;
    const resource = new CfnReportGroup(this, 'Resource', {
      type: this.type,
      exportConfig: {
        exportConfigType: props.exportBucket ? 'S3' : 'NO_EXPORT',
        s3Destination: props.exportBucket
          ? {
            bucket: props.exportBucket.bucketName,
            encryptionDisabled: props.exportBucket.encryptionKey ? false : undefined,
            encryptionKey: props.exportBucket.encryptionKey?.keyArn,
            packaging: props.zipExport ? 'ZIP' : undefined,
          }
          : undefined,
      },
      name: props.reportGroupName,
    });
    resource.applyRemovalPolicy(props.removalPolicy, {
      default: cdk.RemovalPolicy.RETAIN,
    });
    this.reportGroupArn = this.getResourceArnAttribute(resource.attrArn,
      reportGroupArnComponents(this.physicalName));
    this.reportGroupName = this.getResourceNameAttribute(
      // there is no separate name attribute,
      // so use Fn::Select + Fn::Split to make one
      cdk.Fn.select(1, cdk.Fn.split('/', resource.ref)),
    );
    this.exportBucket = props.exportBucket;
  }
}
