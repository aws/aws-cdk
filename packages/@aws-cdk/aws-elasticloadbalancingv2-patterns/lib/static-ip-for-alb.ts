import {Peer, Port} from '@aws-cdk/aws-ec2';
import {ApplicationLoadBalancer, NetworkListener, NetworkLoadBalancer, NetworkTargetGroup, TargetType} from '@aws-cdk/aws-elasticloadbalancingv2';
import {Rule, Schedule} from '@aws-cdk/aws-events';
import {LambdaFunction} from '@aws-cdk/aws-events-targets';
import {Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal} from '@aws-cdk/aws-iam';
import {Code, Function, Runtime} from '@aws-cdk/aws-lambda';
import {RetentionDays} from '@aws-cdk/aws-logs';
import {BlockPublicAccess, Bucket} from '@aws-cdk/aws-s3';
import {Construct, Duration} from '@aws-cdk/core';
import * as path from 'path';

export interface StaticIpForAlbProps {

  /**
   * The Application Load Balancer to grant a static IP to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly applicationLoadBalancer: ApplicationLoadBalancer;

  /**
   * The ALB ports you want to expose over a static IP.
   * @default - 443
   */
  readonly albPort?: number;

  /**
   * Whether you want the resulting NetworkLoadBalancer to be internet-facing.
   * @default - false.
   */
  readonly internetFacing?: boolean;
}

/**
 * Creates a Network Load Balancer which acts as a front for an Application Load Balancer, forwarding traffic
 * on a given port. This enables an ALB-based application to be exposed over a Vpc Endpoint, as ALB cannot currently
 * be exposed over a private link.
 *
 * This construct is based on an AWS blog post:
 * https://aws.amazon.com/blogs/networking-and-content-delivery/using-static-ip-addresses-for-application-load-balancers/
 */
export class StaticIpForAlb extends Construct {

  /**
   * The Application Load Balancer to grant a static IP to.
   *
   * [disable-awslint:ref-via-interface]
   */
  private readonly applicationLoadBalancer: ApplicationLoadBalancer;

  /**
   * The Network Load Balancer that sits in front of the ALB
   */
  private readonly networkLoadBalancer: NetworkLoadBalancer;

  constructor(scope: Construct, id: string, props: StaticIpForAlbProps) {
    super(scope, id);

    const port = props.albPort ?? 443;
    const internetFacing = props.internetFacing ?? false;

    this.applicationLoadBalancer = props.applicationLoadBalancer;
    const vpc = this.applicationLoadBalancer.vpc;

    this.applicationLoadBalancer.connections.allowFrom(
      Peer.ipv4(vpc.vpcCidrBlock),
      Port.tcp(port));

    this.networkLoadBalancer = new NetworkLoadBalancer(this, 'NLB', {
      vpc,
      internetFacing,
    });

    const targetGroup = new NetworkTargetGroup(this, 'NLBTargetGroup', {
      port,
      vpc,
      targetType: TargetType.IP,
    });

    new NetworkListener(this, 'NLBListener', {
      loadBalancer: this.networkLoadBalancer,
      port,
      defaultTargetGroups: [targetGroup],
    });

    const bucket = new Bucket(this, 'AlbIpChangeTrackingBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    const policy = this.createStaticIPForALBIAMPolicy(this, bucket, targetGroup);
    const role = new Role(this, 'IpSyncFunctionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [policy],
    });

    const lambdaEnvironment = {
      ALB_DNS_NAME: this.applicationLoadBalancer.loadBalancerDnsName,
      ALB_LISTENER: String(port),
      NLB_TG_ARN: targetGroup.targetGroupArn,
      S3_BUCKET: bucket.bucketName,
      CW_METRIC_FLAG_IP_COUNT: 'True',
      INVOCATIONS_BEFORE_DEREGISTRATION: '3',
      MAX_LOOKUP_PER_INVOCATION: '50',
    };

    const handlerCodeBundle = path.join(__dirname, '..', 'lambda', 'staticipforalb', 'bundle.zip');

    const sync = new Function(this, 'IpSyncFunction', {
      code: Code.fromAsset(handlerCodeBundle),
      description: 'Syncs ip addresses of the target ALB to the NLB target group',
      environment: lambdaEnvironment,
      handler: '__init__.lambda_handler',
      logRetention: RetentionDays.ONE_MONTH,
      memorySize: 128,
      role,
      runtime: Runtime.PYTHON_3_8,
      timeout: Duration.minutes(5),
    });

    new Rule(this, 'IpSyncTriggerRule', {
      schedule: Schedule.rate(Duration.minutes(5)),
      targets: [new LambdaFunction(sync)],
    });
  }

  private createStaticIPForALBIAMPolicy(scope: Construct, bucket: Bucket, ntg: NetworkTargetGroup) {
    return new ManagedPolicy(scope, 'LambdaPolicy', {
      statements: [
        new PolicyStatement({
          actions: [
            's3:GetObject',
            's3:PutObject',
            'logs:CreateLogStream',
            'elasticloadbalancing:RegisterTargets',
            'elasticloadbalancing:DeregisterTargets',
          ],
          effect: Effect.ALLOW,
          resources: [
            'arn:aws:logs:*:*:log-group:*',
            bucket.arnForObjects('*'),
            ntg.targetGroupArn,
          ],
        }),
        new PolicyStatement({
          actions: [
            'cloudwatch:PutMetricData',
            'elasticloadbalancing:DescribeTargetHealth',
            'logs:CreateLogGroup',
          ],
          effect: Effect.ALLOW,
          resources: ['*'],
        }),
        new PolicyStatement({
          actions: [
            'logs:PutLogEvents',
          ],
          effect: Effect.ALLOW,
          resources: ['arn:aws:logs:*:*:log-group:*:log-stream:*'],
        }),
      ],
    });
  }
}