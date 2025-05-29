/// !cdk-integ IntegManagedLoginBranding
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import {
  AssetCategory,
  AssetExtension,
  ColorMode,
  ManagedLoginBranding,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

/**
 * Test stack with multiple branding configurations
 */
class ManagedLoginBrandingStack extends Stack {
  public readonly userPool: UserPool;
  public readonly basicClient: UserPoolClient;
  public readonly assetClient: UserPoolClient;
  public readonly defaultClient: UserPoolClient;
  public readonly basicBranding: ManagedLoginBranding;
  public readonly assetBranding: ManagedLoginBranding;
  public readonly defaultBranding: ManagedLoginBranding;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create a User Pool
    this.userPool = new UserPool(this, 'UserPool', {
      removalPolicy: RemovalPolicy.DESTROY,
      deletionProtection: false,
    });

    // Create a client for basic branding
    this.basicClient = this.userPool.addClient('BasicClient', {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: ['https://example.com/callback'],
        logoutUrls: ['https://example.com/logout'],
      },
    });

    // Create a client for asset branding
    this.assetClient = this.userPool.addClient('AssetClient', {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    // Create a client for default branding
    this.defaultClient = this.userPool.addClient('DefaultClient', {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    // Create branding with basic settings
    this.basicBranding = new ManagedLoginBranding(this, 'BasicBranding', {
      userPoolId: this.userPool.userPoolId,
      clientId: this.basicClient.userPoolClientId,
      settings: {
        categories: {
          global: {
            colorSchemeMode: 'LIGHT',
            spacingDensity: 'REGULAR',
          },
          form: {
            sessionTimerDisplay: 'STATIC',
          },
        },
        components: {
          pageBackground: {
            lightMode: { color: 'ffffffff' },
          },
          primaryButton: {
            lightMode: {
              defaults: {
                backgroundColor: '0972d3ff',
                textColor: 'ffffffff',
              },
            },
          },
        },
      },
    });

    // Create branding with assets
    this.assetBranding = new ManagedLoginBranding(this, 'AssetBranding', {
      userPoolId: this.userPool.userPoolId,
      clientId: this.assetClient.userPoolClientId,
      // Use a single asset for simplicity
      assets: [
        {
          category: AssetCategory.FAVICON_SVG,
          colorMode: ColorMode.DYNAMIC,
          extension: AssetExtension.SVG,
          bytes:
            'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==',
        },
      ],
      // Must include some settings when specifying assets
      settings: {
        components: {
          primaryButton: {
            lightMode: {
              defaults: {
                backgroundColor: '0972d3ff',
                textColor: 'ffffffff',
              },
            },
          },
        },
      },
    });

    // Create branding with default Cognito options
    this.defaultBranding = new ManagedLoginBranding(this, 'DefaultBranding', {
      userPoolId: this.userPool.userPoolId,
      clientId: this.defaultClient.userPoolClientId,
      useCognitoProvidedValues: true,
    });
  }
}

// Create the app and test stack
const app = new App();
const testStack = new ManagedLoginBrandingStack(
  app,
  'IntegManagedLoginBranding',
);

// Create the IntegTest construct
new IntegTest(app, 'ManagedLoginBrandingTest', {
  testCases: [testStack],
  regions: ['us-east-1'],
  diffAssets: true,
});

app.synth();
