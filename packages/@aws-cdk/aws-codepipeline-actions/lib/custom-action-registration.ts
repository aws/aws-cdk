import * as codepipeline from '@aws-cdk/aws-codepipeline';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * The creation attributes used for defining a configuration property
 * of a custom Action.
 */
export interface CustomActionProperty {
  /**
   * The name of the property.
   * You use this name in the `configuration` attribute when defining your custom Action class.
   */
  name: string;

  /**
   * The description of the property.
   *
   * @default the description will be empty
   */
  description?: string;

  /**
   * Whether this property is a key.
   *
   * @default false
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-key
   */
  key?: boolean;

  /**
   * Whether this property is queryable.
   * Note that only a single property of a custom Action can be queryable.
   *
   * @default false
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-queryable
   */
  queryable?: boolean;

  /**
   * Whether this property is required.
   */
  required: boolean;

  /**
   * Whether this property is secret,
   * like a password, or access key.
   *
   * @default false
   */
  secret?: boolean;

  /**
   * The type of the property,
   * like 'String', 'Number', or 'Boolean'.
   *
   * @default 'String'
   */
  type?: string;
}

/**
 * Properties of registering a custom Action.
 */
export interface CustomActionRegistrationProps {
  /**
   * The category of the Action.
   */
  category: codepipeline.ActionCategory;

  /**
   * The artifact bounds of the Action.
   */
  artifactBounds: codepipeline.ActionArtifactBounds;

  /**
   * The provider of the Action.
   */
  provider: string;

  /**
   * The version of your Action.
   *
   * @default '1'
   */
  version?: string;

  /**
   * The URL shown for the entire Action in the Pipeline UI.
   */
  entityUrl?: string;

  /**
   * The URL shown for a particular execution of an Action in the Pipeline UI.
   */
  executionUrl?: string;

  /**
   * The properties used for customizing the instance of your Action.
   *
   * @default []
   */
  actionProperties?: CustomActionProperty[];
}

/**
 * The resource representing registering a custom Action with CodePipeline.
 * For the Action to be usable, it has to be registered for every region and every account it's used in.
 * In addition to this class, you should most likely also provide your clients a class
 * representing your custom Action, extending the Action class,
 * and taking the `actionProperties` as properly typed, construction properties.
 */
export class CustomActionRegistration extends Construct {
  constructor(parent: Construct, id: string, props: CustomActionRegistrationProps) {
    super(parent, id);

    new codepipeline.CfnCustomActionType(this, 'Resource', {
      category: props.category,
      inputArtifactDetails: {
        minimumCount: props.artifactBounds.minInputs,
        maximumCount: props.artifactBounds.maxInputs,
      },
      outputArtifactDetails: {
        minimumCount: props.artifactBounds.minOutputs,
        maximumCount: props.artifactBounds.maxOutputs,
      },
      provider: props.provider,
      version: props.version || '1',
      settings: {
        entityUrlTemplate: props.entityUrl,
        executionUrlTemplate: props.executionUrl,
      },
      configurationProperties: props.actionProperties === undefined ? undefined : props.actionProperties.map((ap) => {
        return {
          key: ap.key || false,
          secret: ap.secret || false,
          ...ap,
        };
      }),
    });
  }
}
