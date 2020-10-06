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

    const visibilityTimeout = cdk.Duration.seconds(30);

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
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Put the cluster's task state changes events into the queue.
    new events.Rule(this, 'RuleRunning', {
      eventPattern: {
        source: ['aws.ecs'],
        detailType: ['ECS Task State Change'],
        detail: {
          clusterArn: [props.cluster.clusterArn],
          group: [cdk.Fn.join(':', ['service', props.service.serviceName])],
          lastStatus: ['RUNNING'],
          desiredStatus: ['RUNNING'],
        },
      },
      targets: [
        new events_targets.SqsQueue(queue),
      ],
    });

    new events.Rule(this, 'RuleStopped', {
      eventPattern: {
        source: ['aws.ecs'],
        detailType: ['ECS Task State Change'],
        detail: {
          clusterArn: [props.cluster.clusterArn],
          group: [cdk.Fn.join(':', ['service', props.service.serviceName])],
          lastStatus: ['STOPPED'],
          desiredStatus: ['STOPPED'],
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
      // Single-concurrency to prevent a race to set the RecordSet
      reservedConcurrentExecutions: 1,
      environment: {
        HOSTED_ZONE_ID: props.dnsZone.hostedZoneId,
        RECORD_NAME: cdk.Fn.join('.', [props.dnsRecordName, props.dnsZone.zoneName]),
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
  }
}
