import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib/core';
import * as customresources from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { DatabaseQueryHandlerProps } from './handler-props';
import { Cluster } from '../cluster';
import { DatabaseOptions } from '../database-options';
import { Stack } from 'aws-cdk-lib/core';

export interface DatabaseQueryProps<HandlerProps> extends DatabaseOptions {
  readonly handler: string;
  readonly properties: HandlerProps;
  /**
   * The policy to apply when this resource is removed from the application.
   *
   * @default cdk.RemovalPolicy.Destroy
   */
  readonly removalPolicy?: cdk.RemovalPolicy;

  /**
   * The handler timeout duration
   *
   * @default cdk.Duration.minutes(1)
   */
  readonly timeout?: cdk.Duration;
}

export class DatabaseQuery<HandlerProps> extends Construct implements iam.IGrantable {
  private static handlerToRole: Record<string, iam.IRole> = {}

  readonly grantPrincipal: iam.IPrincipal;
  readonly ref: string;

  private readonly resource: cdk.CustomResource;

  constructor(scope: Construct, id: string, props: DatabaseQueryProps<HandlerProps>) {
    super(scope, id);

    if (props.timeout && !cdk.Token.isUnresolved(props.timeout)) {
      if (props.timeout.toMilliseconds() < cdk.Duration.seconds(1).toMilliseconds()) {
        throw new Error(`The timeout for the handler must be BETWEEN 1 second and 15 minutes, got ${props.timeout.toMilliseconds()} milliseconds.`);
      }
      if (props.timeout.toSeconds() > cdk.Duration.minutes(15).toSeconds()) {
        throw new Error(`The timeout for the handler must be between 1 second and 15 minutes, got ${props.timeout.toSeconds()} seconds.`);
      }
    }

    const adminUser = this.getAdminUser(props);
    const handler = new lambda.SingletonFunction(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'database-query-provider'), {
        exclude: ['*.ts'],
      }),
      runtime: lambda.determineLatestNodeRuntime(this),
      handler: 'index.handler',
      timeout: props.timeout ?? cdk.Duration.minutes(1),
      uuid: '3de5bea7-27da-4796-8662-5efb56431b5f',
      lambdaPurpose: 'Query Redshift Database',
    });
    handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['redshift-data:DescribeStatement', 'redshift-data:ExecuteStatement'],
      resources: ['*'],
    }));
    adminUser.grantRead(handler);

    const provider = new customresources.Provider(this, 'Provider', {
      onEventHandler: handler,
      role: this.roleForHandler(handler),
    });

    const queryHandlerProps: DatabaseQueryHandlerProps & HandlerProps = {
      handler: props.handler,
      clusterName: props.cluster.clusterName,
      adminUserArn: adminUser.secretArn,
      databaseName: props.databaseName,
      ...props.properties,
    };
    this.resource = new cdk.CustomResource(this, 'Resource', {
      resourceType: 'Custom::RedshiftDatabaseQuery',
      serviceToken: provider.serviceToken,
      removalPolicy: props.removalPolicy,
      properties: queryHandlerProps,
    });

    this.grantPrincipal = handler.grantPrincipal;
    this.ref = this.resource.ref;
  }

  public applyRemovalPolicy(policy: cdk.RemovalPolicy): void {
    this.resource.applyRemovalPolicy(policy);
  }

  public getAtt(attributeName: string): cdk.Reference {
    return this.resource.getAtt(attributeName);
  }

  public getAttString(attributeName: string): string {
    return this.resource.getAttString(attributeName);
  }

  private getAdminUser(props: DatabaseOptions): secretsmanager.ISecret {
    const cluster = props.cluster;
    let adminUser = props.adminUser;
    if (!adminUser) {
      if (cluster instanceof Cluster) {
        if (cluster.secret) {
          adminUser = cluster.secret;
        } else {
          throw new Error(
            'Administrative access to the Redshift cluster is required but an admin user secret was not provided and the cluster did not generate admin user credentials (they were provided explicitly)',
          );
        }
      } else {
        throw new Error(
          'Administrative access to the Redshift cluster is required but an admin user secret was not provided and the cluster was imported',
        );
      }
    }
    return adminUser;
  }

  private roleForHandler(handler: lambda.SingletonFunction): iam.IRole {
    if (!DatabaseQuery.handlerToRole[handler.constructName]) {
      DatabaseQuery.handlerToRole[handler.constructName] = new iam.Role(Stack.of(this), `Role${handler.constructName}`, {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ],
      });
    }

    return DatabaseQuery.handlerToRole[handler.constructName];
  }
}
