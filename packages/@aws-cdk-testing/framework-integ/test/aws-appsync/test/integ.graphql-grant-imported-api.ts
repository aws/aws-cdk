import { join } from 'path';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  AuthorizationType,
  GraphqlApi,
  UserPoolDefaultAction,
  SchemaFile,
  IamResource,
} from 'aws-cdk-lib/aws-appsync';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ServicePrincipal, Role } from 'aws-cdk-lib/aws-iam';

class OriginalStack extends Stack {
  public readonly apiId: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const userPool = new UserPool(this, 'Pool', {
      userPoolName: 'myPool',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const api = new GraphqlApi(this, 'Api', {
      name: 'Integ_Test_IAM',
      schema: SchemaFile.fromAsset(join(__dirname, 'integ.graphql-iam.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
            defaultAction: UserPoolDefaultAction.ALLOW,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.IAM,
          },
        ],
      },
    });

    this.apiId = api.apiId;
  }
}

interface ImportedStackProps extends StackProps {
  apiId: string;
}

class ImportedStack extends Stack {
  constructor(scope: App, id: string, props: ImportedStackProps) {
    super(scope, id);

    const importedApi = GraphqlApi.fromGraphqlApiAttributes(originalStack, 'ImportedApi', {
      graphqlApiId: `${props.apiId}`,
    });

    const lambdaRole = new Role(this, 'lambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    importedApi.grant(lambdaRole, IamResource.custom('types/Query/fields/getPost'), 'appsync:GraphQL');

    const mutationLambdaRole = new Role(this, 'mutatioLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    importedApi.grantMutation(mutationLambdaRole);

    const queryLambdaRole = new Role(this, 'queryLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    importedApi.grantQuery(queryLambdaRole);

    const subscriptionLambdaRole = new Role(this, 'subscriptionLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    importedApi.grantSubscription(subscriptionLambdaRole);
  }
}

const app = new App();
const originalStack = new OriginalStack(app, 'aws-appsync-integ');
const importedStack = new ImportedStack(app, 'imported-stack', {
  apiId: originalStack.apiId,
});

new IntegTest(app, 'GraphqlGrantImportedApiInteg', {
  testCases: [importedStack],
});
