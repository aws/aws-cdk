import { Construct } from 'constructs';
import * as iam from '../../aws-iam';

/**
 * Construction properties for UntrustedCodeBoundaryPolicy
 */
export interface UntrustedCodeBoundaryPolicyProps {
  /**
   * The name of the managed policy.
   *
   * @default - A name is automatically generated.
   */
  readonly managedPolicyName?: string;

  /**
   * Additional statements to add to the default set of statements
   *
   * @default - No additional statements
   */
  readonly additionalStatements?: iam.PolicyStatement[];
}

/**
 * Permissions Boundary for a CodeBuild Project running untrusted code
 *
 * This class is a Policy, intended to be used as a Permissions Boundary
 * for a CodeBuild project. It allows most of the actions necessary to run
 * the CodeBuild project, but disallows reading from Parameter Store
 * and Secrets Manager.
 *
 * Use this when your CodeBuild project is running untrusted code (for
 * example, if you are using one to automatically build Pull Requests
 * that anyone can submit), and you want to prevent your future self
 * from accidentally exposing Secrets to this build.
 *
 * (The reason you might want to do this is because otherwise anyone
 * who can submit a Pull Request to your project can write a script
 * to email those secrets to themselves).
 *
 * @example
 *
 * declare const project: codebuild.Project;
 * iam.PermissionsBoundary.of(project).apply(new codebuild.UntrustedCodeBoundaryPolicy(this, 'Boundary'));
 */
export class UntrustedCodeBoundaryPolicy extends iam.ManagedPolicy {
  constructor(scope: Construct, id: string, props: UntrustedCodeBoundaryPolicyProps = {}) {
    super(scope, id, {
      managedPolicyName: props.managedPolicyName,
      description: 'Permissions Boundary Policy for CodeBuild Projects running untrusted code',
      statements: [
        new iam.PolicyStatement({
          actions: [
            // For logging
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',

            // For test reports
            'codebuild:CreateReportGroup',
            'codebuild:CreateReport',
            'codebuild:UpdateReport',
            'codebuild:BatchPutTestCases',
            'codebuild:BatchPutCodeCoverages',

            // For batch builds
            'codebuild:StartBuild',
            'codebuild:StopBuild',
            'codebuild:RetryBuild',

            // For pulling ECR images
            'ecr:GetDownloadUrlForLayer',
            'ecr:BatchGetImage',
            'ecr:BatchCheckLayerAvailability',

            // For running in a VPC
            'ec2:CreateNetworkInterfacePermission',
            'ec2:CreateNetworkInterface',
            'ec2:DescribeNetworkInterfaces',
            'ec2:DeleteNetworkInterface',
            'ec2:DescribeSubnets',
            'ec2:DescribeSecurityGroups',
            'ec2:DescribeDhcpOptions',
            'ec2:DescribeVpcs',

            // NOTABLY MISSING:
            // - Reading secrets
            // - Reading parameterstore
          ],
          resources: ['*'],
        }),
        ...props.additionalStatements ?? [],
      ],
    });
  }
}
