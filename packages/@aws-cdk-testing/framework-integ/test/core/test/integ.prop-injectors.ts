import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import {
  SecurityGroup,
  SecurityGroupProps,
  Vpc,
  VpcProps,
} from 'aws-cdk-lib/aws-ec2';
import {
  ApplicationLogLevel,
  Code,
  Function,
  FunctionProps,
  LoggingFormat,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import {
  LogGroup,
  LogRetention,
  RetentionDays,
} from 'aws-cdk-lib/aws-logs';
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  IBucket,
} from 'aws-cdk-lib/aws-s3';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * This test creates an IPropertyInjector for S3 Bucket, Lambda Function, VPC, and SecurityGroup.
 *
 * The VPC Injector is the simplest to understand.  It just adds a couple of defaults.
 * The SecurityGroup Injector shows an injector that does change the input props.
 * The S3 Injector shows an example of creating a log bucket for a bucket.  It uses _skip to break infinite recursion.
 * The Function Injector shows creating a LogGroup for a Function.
 *
 */

// Simple Injector
export class VpcPropsInjector implements cdk.IPropertyInjector {
  readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = Vpc.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: VpcProps, _context: cdk.InjectionContext): VpcProps {
    return {
      vpnGateway: false,
      restrictDefaultSecurityGroup: true,
      ...originalProps,
    };
  }
}

// Do Nothing Injector
export class SecurityGroupPropsInjector implements cdk.IPropertyInjector {
  readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = SecurityGroup.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: SecurityGroupProps, _context: cdk.InjectionContext): SecurityGroupProps {
    return originalProps;
  }
}

// Complex Injector that creates a bucket in another
class MyBucketPropsInjector implements cdk.IPropertyInjector {
  public readonly constructUniqueId: string;

  private commonInjectionValues = {
    accessControl: undefined,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    encryption: BucketEncryption.KMS,
    enforceSSL: true,
    publicReadAccess: false,
    lifecycleRules: [],
  };

  // Skip property injection if this class attribute is set to true
  // This technique is needed to avoid infinite recursion if we create one Bucket in another.
  private _skip: boolean;

  constructor() {
    this._skip = false;
    this.constructUniqueId = Bucket.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: any, context: cdk.InjectionContext): any {
    // Don't set up access logging bucket if this._skip=true
    if (this._skip) {
      return {
        ...this.commonInjectionValues,
        ...originalProps,
      };
    }

    let accessLoggingBucket: IBucket | undefined = undefined;
    if (!originalProps || (originalProps && !('serverAccessLogsBucket' in originalProps))) {
      // Set the _skip flag to disable indefinite access log bucket creation loop
      this._skip = true;

      accessLoggingBucket = new Bucket(context.scope, `access-logging-${md5hash(context.id)}`, {
        ...this.commonInjectionValues,
        removalPolicy: originalProps?.removalPolicy ?? cdk.RemovalPolicy.RETAIN,
      });

      // reset the _skip flag
      this._skip = false;
    }

    const newProps = {
      ...this.commonInjectionValues,
      serverAccessLogsBucket: accessLoggingBucket,
      ...originalProps,
    };
    return newProps;
  }
}

// Function Injector that creates a LogGroup
class FunctionPropsInjector implements cdk.IPropertyInjector {
  readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = Function.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: FunctionProps, context: cdk.InjectionContext): FunctionProps {
    let lg = originalProps.logGroup;
    if (!lg) {
      lg = LogGroup.fromLogGroupArn(
        context.scope,
        `LogGroup-${context.id}`,
        new LogRetention(context.scope, `LogRetention-${context.id}`, {
          logGroupName: `/aws/lambda/${originalProps.functionName}`,
          retention: RetentionDays.TEN_YEARS,
        }).logGroupArn,
      );
    }

    return {
      applicationLogLevelV2: ApplicationLogLevel.INFO,
      loggingFormat: LoggingFormat.JSON,
      ...originalProps,
      logGroup: lg,
    };
  }
}

class RestApiPropsInjector implements cdk.IPropertyInjector {
  readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = apigw.RestApi.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: apigw.RestApiProps, _context: cdk.InjectionContext): apigw.RestApiProps {
    return {
      endpointTypes: [apigw.EndpointType.REGIONAL],
      deploy: false,
      restApiName: 'my-rest-api',
      ...originalProps,
    };
  }
}

class LambdaRestApiPropsInjector implements cdk.IPropertyInjector {
  readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = apigw.LambdaRestApi.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: apigw.LambdaRestApiProps, _context: cdk.InjectionContext): apigw.LambdaRestApiProps {
    return {
      disableExecuteApiEndpoint: false,
      restApiName: 'my-lambda-rest-api',
      ...originalProps,
    };
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TestStack', {
  propertyInjectors: [
    new FunctionPropsInjector(),
    new MyBucketPropsInjector(),
    new SecurityGroupPropsInjector(),
    new VpcPropsInjector(),
    new RestApiPropsInjector(),
    new LambdaRestApiPropsInjector(),
  ],
});

const f = new Function(stack, 'Function', {
  functionName: 'myfunc',
  runtime: Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: Code.fromInline('console.log();'),
});

const vpc = new Vpc(stack, 'my-vpc', {});

new SecurityGroup(stack, 'my-sg', {
  vpc: vpc,
  allowAllIpv6Outbound: false,
  allowAllOutbound: false,
});

new Bucket(stack, 'Default', {});

new apigw.LambdaRestApi(stack, 'MyRestAPI', {
  handler: f,
});

new IntegTest(app, 'PropertyInjectorTest', { testCases: [stack] });
