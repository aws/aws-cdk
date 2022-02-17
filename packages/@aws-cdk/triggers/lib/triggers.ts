import { join } from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider, CustomResourceProviderRuntime } from '@aws-cdk/core';

import { Construct } from 'constructs';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Props for `Trigger`.
 */
export interface TriggerProps {
  /**
   * Resources to trigger on. Resources can come from any stack in the app.
   *
   * @default [] Run the trigger at any time during stack deployment.
   */
  readonly dependencies?: Construct[];

  /**
   * The handler to execute once after all the resources are created.
   *
   * The trigger will be executed every time the handler changes (code or
   * configuration).
   */
  readonly handler: lambda.Function;
}

/**
 * Triggers an AWS Lambda function during deployment.
 */
export class Trigger extends CoreConstruct {
  constructor(scope: Construct, id: string, props: TriggerProps) {
    super(scope, id);

    const provider = CustomResourceProvider.getOrCreateProvider(this, 'AWSCDK.TriggerCustomResourceProvider', {
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      codeDirectory: join(__dirname, 'lambda'),
      policyStatements: [
        {
          Effect: 'Allow',
          Action: ['lambda:InvokeFunction'],
          Resource: [props.handler.currentVersion.functionArn],
        },
      ],
    });

    const resource = new CustomResource(this, 'Resource', {
      resourceType: 'Custom::Trigger',
      serviceToken: provider.serviceToken,
      properties: {
        // we use 'currentVersion' because a new version is created every time the
        // handler changes (either code or configuration). this will have the effect
        // that the trigger will be executed every time the handler is changed.
        HandlerArn: props.handler.currentVersion.functionArn,
      },
    });

    // add a dependency between our resource and the resources we want to invoke
    // after.
    resource.node.addDependency(...props.dependencies ?? []);
  }
}