import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

interface EventApiOIDCAuthStackProps extends cdk.StackProps {
  oidcIssuerUrl: string;
  oidcClientId: string;
}

class EventApiOIDCAuthStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;

  constructor(scope: cdk.App, id: string, props: EventApiOIDCAuthStackProps) {
    super(scope, id, props);

    const oidcProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.OIDC,
      openIdConnectConfig: {
        oidcProvider: props.oidcIssuerUrl,
        clientId: props.oidcClientId,
      },
    };

    this.eventApi = new appsync.EventApi(this, 'event-api', {
      apiName: 'event-api',
      authorizationConfig: {
        authProviders: [
          oidcProvider,
        ],
      },
    });
  }
};

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
*/
const oidcIssuerUrl = process.env.CDK_INTEG_OIDC_ISSUER_URL ?? process.env.OIDC_ISSUER_URL;
if (!oidcIssuerUrl) throw new Error('For this test you must provide your own OIDC Issuer Url as an env var "OIDC_ISSUER_URL". See framework-integ/README.md for details.');
const oidcClientId = process.env.CDK_INTEG_OIDC_CLIENT_ID ?? process.env.OIDC_CLIENT_ID;
if (!oidcClientId) throw new Error('For this test you must provide your own OIDC Client ID as an env var "OIDC_CLIENT_ID". See framework-integ/README.md for details.');

const app = new cdk.App();
const stack = new EventApiOIDCAuthStack(app, 'EventApiOIDCAuthStack', {
  oidcIssuerUrl,
  oidcClientId,
});

new IntegTest(app, 'appsync-event-api-oidc-auth', {
  testCases: [stack],
});