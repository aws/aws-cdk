import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { CfnWebACL, CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';
import * as path from 'path';
import { Construct } from 'constructs';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

interface EventApiStackProps extends cdk.StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
  domainName: string;
}

class EventApiStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;
  constructor(scope: Construct, id: string, props: EventApiStackProps) {
    super(scope, id);

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });

    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: `*.${props.domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const userPool = new cognito.UserPool(this, 'Pool', {
      userPoolName: 'myPool',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const authorizer = new lambda.Function(this, 'AuthorizerFunction', {
      runtime: STANDARD_NODEJS_RUNTIME,
      code: lambda.Code.fromInline(`
            exports.handler = async (event) => {
              console.log("Authorization event:", JSON.stringify(event));

              const isAuthorized = true;
              if (isAuthorized) {
                return {
                  isAuthorized: true,
                  resolverContext: {
                    userId: 'user-id-example'
                  }
                };
              } else {
                return {
                  isAuthorized: false
                };
              }
            };
          `),
      handler: 'index.handler',
    });

    const cognitoProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.USER_POOL,
      cognitoConfig: {
        userPool: userPool,
      },
    };

    const lambdaProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: authorizer,
      },
    };

    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
    };

    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    const api = new appsync.EventApi(this, 'EventApi', {
      apiName: 'api-overall-test',
      ownerContact: 'test-owner-contact',
      authorizationConfig: {
        authProviders: [
          cognitoProvider,
          lambdaProvider,
          apiKeyProvider,
          iamProvider,
        ],
        connectionAuthModeTypes: [
          appsync.AppSyncAuthorizationType.API_KEY,
        ],
        defaultPublishAuthModeTypes: [
          appsync.AppSyncAuthorizationType.USER_POOL,
        ],
        defaultSubscribeAuthModeTypes: [
          appsync.AppSyncAuthorizationType.IAM,
        ],
      },
      logConfig: {
        fieldLogLevel: appsync.AppSyncFieldLogLevel.ERROR,
      },
      domainName: {
        certificate,
        domainName: `api.${props.domainName}`,
      },
    });
    this.eventApi = api;

    new appsync.ChannelNamespace(this, 'ChannelNamespace', {
      api,
      authorizationConfig: {
        publishAuthModeTypes: [
          appsync.AppSyncAuthorizationType.LAMBDA,
        ],
        subscribeAuthModeTypes: [
          appsync.AppSyncAuthorizationType.LAMBDA,
        ],
      },
      code: appsync.Code.fromAsset(path.join(
        __dirname,
        'integ-assets',
        'appsync-js-channel-namespace-handler.js',
      )),
    });

    api.addChannelNamespace('AnotherChannelNamespace', {
      code: appsync.Code.fromInline(`
            export function onPublish(ctx) {
              return ctx.events.filter((event) => event.payload.odds > 0)
            }
          `),
    });

    const webAcl = new CfnWebACL(this, 'WebAcl', {
      defaultAction: {
        allow: {},
      },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: false,
        metricName: 'webAclMetric',
        sampledRequestsEnabled: false,
      },
    });

    new CfnWebACLAssociation(this, 'WafAssociation', {
      resourceArn: api.apiArn,
      webAclArn: webAcl.attrArn,
    });
  }
}

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new cdk.App();
const stack = new EventApiStack(app, 'appsync-event-api-stack', {
  hostedZoneId,
  hostedZoneName,
  domainName,
});

new IntegTest(app, 'appsync-event-api', {
  testCases: [stack],
  enableLookups: true,
  stackUpdateWorkflow: false,
});

new cdk.CfnOutput(stack, 'AWS AppSync Events HTTP endpoint', { value: stack.eventApi.customHttpEndpoint });
new cdk.CfnOutput(stack, 'AWS AppSync Events Realtime endpoint', { value: stack.eventApi.customRealtimeEndpoint });
