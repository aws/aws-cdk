import { Construct } from 'constructs';
import { ActionCategory, ActionArtifactBounds } from './action';
/**
 * The creation attributes used for defining a configuration property
 * of a custom Action.
 */
export interface CustomActionProperty {
    /**
     * The name of the property.
     * You use this name in the `configuration` attribute when defining your custom Action class.
     */
    readonly name: string;
    /**
     * The description of the property.
     *
     * @default the description will be empty
     */
    readonly description?: string;
    /**
     * Whether this property is a key.
     *
     * @default false
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-key
     */
    readonly key?: boolean;
    /**
     * Whether this property is queryable.
     * Note that only a single property of a custom Action can be queryable.
     *
     * @default false
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype-configurationproperties.html#cfn-codepipeline-customactiontype-configurationproperties-queryable
     */
    readonly queryable?: boolean;
    /**
     * Whether this property is required.
     */
    readonly required: boolean;
    /**
     * Whether this property is secret,
     * like a password, or access key.
     *
     * @default false
     */
    readonly secret?: boolean;
    /**
     * The type of the property,
     * like 'String', 'Number', or 'Boolean'.
     *
     * @default 'String'
     */
    readonly type?: string;
}
/**
 * Properties of registering a custom Action.
 */
export interface CustomActionRegistrationProps {
    /**
     * The category of the Action.
     */
    readonly category: ActionCategory;
    /**
     * The artifact bounds of the Action.
     */
    readonly artifactBounds: ActionArtifactBounds;
    /**
     * The provider of the Action.
     * For example, `'MyCustomActionProvider'`
     */
    readonly provider: string;
    /**
     * The version of your Action.
     *
     * @default '1'
     */
    readonly version?: string;
    /**
     * The URL shown for the entire Action in the Pipeline UI.
     * @default none
     */
    readonly entityUrl?: string;
    /**
     * The URL shown for a particular execution of an Action in the Pipeline UI.
     * @default none
     */
    readonly executionUrl?: string;
    /**
     * The properties used for customizing the instance of your Action.
     *
     * @default []
     */
    readonly actionProperties?: CustomActionProperty[];
}
/**
 * The resource representing registering a custom Action with CodePipeline.
 * For the Action to be usable, it has to be registered for every region and every account it's used in.
 * In addition to this class, you should most likely also provide your clients a class
 * representing your custom Action, extending the Action class,
 * and taking the `actionProperties` as properly typed, construction properties.
 */
export declare class CustomActionRegistration extends Construct {
    constructor(scope: Construct, id: string, props: CustomActionRegistrationProps);
}
