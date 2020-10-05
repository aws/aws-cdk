import * as path from 'path';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as events_targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambda_es from '@aws-cdk/aws-lambda-event-sources';
import * as route53 from '@aws-cdk/aws-route53';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';

export interface TaskRecordManagerProps {
  cluster: ecs.ICluster;
  service: ecs.Ec2Service | ecs.FargateService;
  dnsZone: route53.IHostedZone;
  dnsRecordName: string;
}

/**
 * Manages posting task DNS records.
 */
export class TaskRecordManager extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: TaskRecordManagerProps) {
    super(scope, id);

    const deadLetterQueue = new sqs.Queue(this, 'EventsDL', {
      retentionPeriod: cdk.Duration.days(14),
    });

    const visibilityTimeout = cdk.Duration.minutes(1);

    // This queue lets us batch together ecs task state events. This is useful
    // for when when we would be otherwise bombarded by them.
    const queue = new sqs.Queue(this, 'EventsQueue', {
      deadLetterQueue: {
        maxReceiveCount: 500,
        queue: deadLetterQueue,
      },
      visibilityTimeout,
    });

    const table = new dynamodb.Table(this, 'Records', {
      partitionKey: {
        name: 'hosted_zone_id_record_name',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Put the cluster's task state changes events into the queue.
    const taskStateChangeRule = new events.Rule(this, 'Rule', {
      eventPattern: {
        source: ['aws.ecs'],
        detailType: ['ECS Task State Change'],
        detail: {
          clusterArn: [props.cluster.clusterArn],
          lastStatus: ['RUNNING', 'STOPPED'],
        },
      },
      targets: [
        new events_targets.SqsQueue(queue),
      ],
    });

    const code = lambda.Code.fromAsset(path.join(__dirname, 'lambda'), {
      exclude: [
        '.coverage',
        '*.pyc',
      ],
    });

    // This function consumes `queue`
    const taskStateHandler = new lambda.Function(this, 'EventHandler', {
      code: code,
      handler: 'index.queue_handler',
      runtime: lambda.Runtime.PYTHON_3_8,
      timeout: visibilityTimeout,
      environment: {
        HOSTED_ZONE_ID: props.dnsZone.hostedZoneId,
        RECORD_NAME: cdk.Fn.join('.', [props.dnsRecordName, props.dnsZone.zoneName]),
        CLUSTER_ARN: props.service.cluster.clusterArn,
        SERVICE_ARN: props.service.serviceArn,
        RECORDS_TABLE: table.tableName,
      },
      events: [
        new lambda_es.SqsEventSource(queue),
      ],
    });

    // TODO: Lock this down once I know what APIs I need.
    taskStateHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['*'],
        resources: ['*'],
      }),
    );

    // Ensure that something about the service depends on the task state change
    // rule so that tasks cannot come online before we can listen for task state
    // changes. When I tried props.service.node, I got a circuler dependency
    // problem, so I latched onto the task definition instead - should be even
    // earlier.
    props.service.taskDefinition.node.addDependency(taskStateChangeRule);
  }
}
