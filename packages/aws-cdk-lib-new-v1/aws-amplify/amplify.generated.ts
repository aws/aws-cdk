/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::Amplify::App resource specifies Apps in Amplify Hosting.
 *
 * An App is a collection of branches.
 *
 * @cloudformationResource AWS::Amplify::App
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html
 */
export class CfnApp extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Amplify::App";

  /**
   * Build a CfnApp from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApp {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAppPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApp(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Unique Id for the Amplify App.
   *
   * @cloudformationAttribute AppId
   */
  public readonly attrAppId: string;

  /**
   * Name for the Amplify App.
   *
   * @cloudformationAttribute AppName
   */
  public readonly attrAppName: string;

  /**
   * ARN for the Amplify App.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Default domain for the Amplify App.
   *
   * @cloudformationAttribute DefaultDomain
   */
  public readonly attrDefaultDomain: string;

  /**
   * The personal access token for a GitHub repository for an Amplify app.
   */
  public accessToken?: string;

  /**
   * Sets the configuration for your automatic branch creation.
   */
  public autoBranchCreationConfig?: CfnApp.AutoBranchCreationConfigProperty | cdk.IResolvable;

  /**
   * The credentials for basic authorization for an Amplify app.
   */
  public basicAuthConfig?: CfnApp.BasicAuthConfigProperty | cdk.IResolvable;

  /**
   * The build specification (build spec) for an Amplify app.
   */
  public buildSpec?: string;

  /**
   * The custom HTTP headers for an Amplify app.
   */
  public customHeaders?: string;

  /**
   * The custom rewrite and redirect rules for an Amplify app.
   */
  public customRules?: Array<CfnApp.CustomRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description for an Amplify app.
   */
  public description?: string;

  /**
   * Automatically disconnect a branch in Amplify Hosting when you delete a branch from your Git repository.
   */
  public enableBranchAutoDeletion?: boolean | cdk.IResolvable;

  /**
   * The environment variables map for an Amplify app.
   */
  public environmentVariables?: Array<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The AWS Identity and Access Management (IAM) service role for the Amazon Resource Name (ARN) of the Amplify app.
   */
  public iamServiceRole?: string;

  /**
   * The name for an Amplify app.
   */
  public name: string;

  /**
   * The OAuth token for a third-party source control system for an Amplify app.
   */
  public oauthToken?: string;

  /**
   * The platform for the Amplify app.
   */
  public platform?: string;

  /**
   * The repository for an Amplify app.
   */
  public repository?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tag for an Amplify app.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAppProps) {
    super(scope, id, {
      "type": CfnApp.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrAppId = cdk.Token.asString(this.getAtt("AppId", cdk.ResolutionTypeHint.STRING));
    this.attrAppName = cdk.Token.asString(this.getAtt("AppName", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDefaultDomain = cdk.Token.asString(this.getAtt("DefaultDomain", cdk.ResolutionTypeHint.STRING));
    this.accessToken = props.accessToken;
    this.autoBranchCreationConfig = props.autoBranchCreationConfig;
    this.basicAuthConfig = props.basicAuthConfig;
    this.buildSpec = props.buildSpec;
    this.customHeaders = props.customHeaders;
    this.customRules = props.customRules;
    this.description = props.description;
    this.enableBranchAutoDeletion = props.enableBranchAutoDeletion;
    this.environmentVariables = props.environmentVariables;
    this.iamServiceRole = props.iamServiceRole;
    this.name = props.name;
    this.oauthToken = props.oauthToken;
    this.platform = props.platform;
    this.repository = props.repository;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Amplify::App", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessToken": this.accessToken,
      "autoBranchCreationConfig": this.autoBranchCreationConfig,
      "basicAuthConfig": this.basicAuthConfig,
      "buildSpec": this.buildSpec,
      "customHeaders": this.customHeaders,
      "customRules": this.customRules,
      "description": this.description,
      "enableBranchAutoDeletion": this.enableBranchAutoDeletion,
      "environmentVariables": this.environmentVariables,
      "iamServiceRole": this.iamServiceRole,
      "name": this.name,
      "oauthToken": this.oauthToken,
      "platform": this.platform,
      "repository": this.repository,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApp.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAppPropsToCloudFormation(props);
  }
}

export namespace CfnApp {
  /**
   * Use the AutoBranchCreationConfig property type to automatically create branches that match a certain pattern.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html
   */
  export interface AutoBranchCreationConfigProperty {
    /**
     * Automated branch creation glob patterns for the Amplify app.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-autobranchcreationpatterns
     */
    readonly autoBranchCreationPatterns?: Array<string>;

    /**
     * Sets password protection for your auto created branch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-basicauthconfig
     */
    readonly basicAuthConfig?: CfnApp.BasicAuthConfigProperty | cdk.IResolvable;

    /**
     * The build specification (build spec) for the autocreated branch.
     *
     * *Length Constraints:* Minimum length of 1. Maximum length of 25000.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-buildspec
     */
    readonly buildSpec?: string;

    /**
     * Enables automated branch creation for the Amplify app.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-enableautobranchcreation
     */
    readonly enableAutoBranchCreation?: boolean | cdk.IResolvable;

    /**
     * Enables auto building for the auto created branch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-enableautobuild
     */
    readonly enableAutoBuild?: boolean | cdk.IResolvable;

    /**
     * Enables performance mode for the branch.
     *
     * Performance mode optimizes for faster hosting performance by keeping content cached at the edge for a longer interval. When performance mode is enabled, hosting configuration or code changes can take up to 10 minutes to roll out.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-enableperformancemode
     */
    readonly enablePerformanceMode?: boolean | cdk.IResolvable;

    /**
     * Sets whether pull request previews are enabled for each branch that Amplify Hosting automatically creates for your app.
     *
     * Amplify creates previews by deploying your app to a unique URL whenever a pull request is opened for the branch. Development and QA teams can use this preview to test the pull request before it's merged into a production or integration branch.
     *
     * To provide backend support for your preview, Amplify Hosting automatically provisions a temporary backend environment that it deletes when the pull request is closed. If you want to specify a dedicated backend environment for your previews, use the `PullRequestEnvironmentName` property.
     *
     * For more information, see [Web Previews](https://docs.aws.amazon.com/amplify/latest/userguide/pr-previews.html) in the *AWS Amplify Hosting User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-enablepullrequestpreview
     */
    readonly enablePullRequestPreview?: boolean | cdk.IResolvable;

    /**
     * Environment variables for the auto created branch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-environmentvariables
     */
    readonly environmentVariables?: Array<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The framework for the autocreated branch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-framework
     */
    readonly framework?: string;

    /**
     * If pull request previews are enabled, you can use this property to specify a dedicated backend environment for your previews.
     *
     * For example, you could specify an environment named `prod` , `test` , or `dev` that you initialized with the Amplify CLI.
     *
     * To enable pull request previews, set the `EnablePullRequestPreview` property to `true` .
     *
     * If you don't specify an environment, Amplify Hosting provides backend support for each preview by automatically provisioning a temporary backend environment. Amplify deletes this environment when the pull request is closed.
     *
     * For more information about creating backend environments, see [Feature Branch Deployments and Team Workflows](https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html) in the *AWS Amplify Hosting User Guide* .
     *
     * *Length Constraints:* Maximum length of 20.
     *
     * *Pattern:* (?s).*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-pullrequestenvironmentname
     */
    readonly pullRequestEnvironmentName?: string;

    /**
     * Stage for the auto created branch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-autobranchcreationconfig.html#cfn-amplify-app-autobranchcreationconfig-stage
     */
    readonly stage?: string;
  }

  /**
   * Environment variables are key-value pairs that are available at build time.
   *
   * Set environment variables for all branches in your app.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-environmentvariable.html
   */
  export interface EnvironmentVariableProperty {
    /**
     * The environment variable name.
     *
     * *Length Constraints:* Maximum length of 255.
     *
     * *Pattern:* (?s).*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-environmentvariable.html#cfn-amplify-app-environmentvariable-name
     */
    readonly name: string;

    /**
     * The environment variable value.
     *
     * *Length Constraints:* Maximum length of 5500.
     *
     * *Pattern:* (?s).*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-environmentvariable.html#cfn-amplify-app-environmentvariable-value
     */
    readonly value: string;
  }

  /**
   * Use the BasicAuthConfig property type to set password protection at an app level to all your branches.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-basicauthconfig.html
   */
  export interface BasicAuthConfigProperty {
    /**
     * Enables basic authorization for the Amplify app's branches.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-basicauthconfig.html#cfn-amplify-app-basicauthconfig-enablebasicauth
     */
    readonly enableBasicAuth?: boolean | cdk.IResolvable;

    /**
     * The password for basic authorization.
     *
     * *Length Constraints:* Minimum length of 1. Maximum length of 255.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-basicauthconfig.html#cfn-amplify-app-basicauthconfig-password
     */
    readonly password?: string;

    /**
     * The user name for basic authorization.
     *
     * *Length Constraints:* Minimum length of 1. Maximum length of 255.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-basicauthconfig.html#cfn-amplify-app-basicauthconfig-username
     */
    readonly username?: string;
  }

  /**
   * The CustomRule property type allows you to specify redirects, rewrites, and reverse proxies.
   *
   * Redirects enable a web app to reroute navigation from one URL to another.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-customrule.html
   */
  export interface CustomRuleProperty {
    /**
     * The condition for a URL rewrite or redirect rule, such as a country code.
     *
     * *Length Constraints:* Minimum length of 0. Maximum length of 2048.
     *
     * *Pattern:* (?s).*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-customrule.html#cfn-amplify-app-customrule-condition
     */
    readonly condition?: string;

    /**
     * The source pattern for a URL rewrite or redirect rule.
     *
     * *Length Constraints:* Minimum length of 1. Maximum length of 2048.
     *
     * *Pattern:* (?s).+
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-customrule.html#cfn-amplify-app-customrule-source
     */
    readonly source: string;

    /**
     * The status code for a URL rewrite or redirect rule.
     *
     * - **200** - Represents a 200 rewrite rule.
     * - **301** - Represents a 301 (moved pemanently) redirect rule. This and all future requests should be directed to the target URL.
     * - **302** - Represents a 302 temporary redirect rule.
     * - **404** - Represents a 404 redirect rule.
     * - **404-200** - Represents a 404 rewrite rule.
     *
     * *Length Constraints:* Minimum length of 3. Maximum length of 7.
     *
     * *Pattern:* .{3,7}
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-customrule.html#cfn-amplify-app-customrule-status
     */
    readonly status?: string;

    /**
     * The target pattern for a URL rewrite or redirect rule.
     *
     * *Length Constraints:* Minimum length of 1. Maximum length of 2048.
     *
     * *Pattern:* (?s).+
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-app-customrule.html#cfn-amplify-app-customrule-target
     */
    readonly target: string;
  }
}

/**
 * Properties for defining a `CfnApp`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html
 */
export interface CfnAppProps {
  /**
   * The personal access token for a GitHub repository for an Amplify app.
   *
   * The personal access token is used to authorize access to a GitHub repository using the Amplify GitHub App. The token is not stored.
   *
   * Use `AccessToken` for GitHub repositories only. To authorize access to a repository provider such as Bitbucket or CodeCommit, use `OauthToken` .
   *
   * You must specify either `AccessToken` or `OauthToken` when you create a new app.
   *
   * Existing Amplify apps deployed from a GitHub repository using OAuth continue to work with CI/CD. However, we strongly recommend that you migrate these apps to use the GitHub App. For more information, see [Migrating an existing OAuth app to the Amplify GitHub App](https://docs.aws.amazon.com/amplify/latest/userguide/setting-up-GitHub-access.html#migrating-to-github-app-auth) in the *Amplify User Guide* .
   *
   * *Length Constraints:* Minimum length of 1. Maximum length of 255.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-accesstoken
   */
  readonly accessToken?: string;

  /**
   * Sets the configuration for your automatic branch creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-autobranchcreationconfig
   */
  readonly autoBranchCreationConfig?: CfnApp.AutoBranchCreationConfigProperty | cdk.IResolvable;

  /**
   * The credentials for basic authorization for an Amplify app.
   *
   * You must base64-encode the authorization credentials and provide them in the format `user:password` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-basicauthconfig
   */
  readonly basicAuthConfig?: CfnApp.BasicAuthConfigProperty | cdk.IResolvable;

  /**
   * The build specification (build spec) for an Amplify app.
   *
   * *Length Constraints:* Minimum length of 1. Maximum length of 25000.
   *
   * *Pattern:* (?s).+
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-buildspec
   */
  readonly buildSpec?: string;

  /**
   * The custom HTTP headers for an Amplify app.
   *
   * *Length Constraints:* Minimum length of 0. Maximum length of 25000.
   *
   * *Pattern:* (?s).*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-customheaders
   */
  readonly customHeaders?: string;

  /**
   * The custom rewrite and redirect rules for an Amplify app.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-customrules
   */
  readonly customRules?: Array<CfnApp.CustomRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description for an Amplify app.
   *
   * *Length Constraints:* Maximum length of 1000.
   *
   * *Pattern:* (?s).*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-description
   */
  readonly description?: string;

  /**
   * Automatically disconnect a branch in Amplify Hosting when you delete a branch from your Git repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-enablebranchautodeletion
   */
  readonly enableBranchAutoDeletion?: boolean | cdk.IResolvable;

  /**
   * The environment variables map for an Amplify app.
   *
   * For a list of the environment variables that are accessible to Amplify by default, see [Amplify Environment variables](https://docs.aws.amazon.com/amplify/latest/userguide/amplify-console-environment-variables.html) in the *Amplify Hosting User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-environmentvariables
   */
  readonly environmentVariables?: Array<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The AWS Identity and Access Management (IAM) service role for the Amazon Resource Name (ARN) of the Amplify app.
   *
   * *Length Constraints:* Minimum length of 0. Maximum length of 1000.
   *
   * *Pattern:* (?s).*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-iamservicerole
   */
  readonly iamServiceRole?: string;

  /**
   * The name for an Amplify app.
   *
   * *Length Constraints:* Minimum length of 1. Maximum length of 255.
   *
   * *Pattern:* (?s).+
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-name
   */
  readonly name: string;

  /**
   * The OAuth token for a third-party source control system for an Amplify app.
   *
   * The OAuth token is used to create a webhook and a read-only deploy key using SSH cloning. The OAuth token is not stored.
   *
   * Use `OauthToken` for repository providers other than GitHub, such as Bitbucket or CodeCommit. To authorize access to GitHub as your repository provider, use `AccessToken` .
   *
   * You must specify either `OauthToken` or `AccessToken` when you create a new app.
   *
   * Existing Amplify apps deployed from a GitHub repository using OAuth continue to work with CI/CD. However, we strongly recommend that you migrate these apps to use the GitHub App. For more information, see [Migrating an existing OAuth app to the Amplify GitHub App](https://docs.aws.amazon.com/amplify/latest/userguide/setting-up-GitHub-access.html#migrating-to-github-app-auth) in the *Amplify User Guide* .
   *
   * *Length Constraints:* Maximum length of 1000.
   *
   * *Pattern:* (?s).*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-oauthtoken
   */
  readonly oauthToken?: string;

  /**
   * The platform for the Amplify app.
   *
   * For a static app, set the platform type to `WEB` . For a dynamic server-side rendered (SSR) app, set the platform type to `WEB_COMPUTE` . For an app requiring Amplify Hosting's original SSR support only, set the platform type to `WEB_DYNAMIC` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-platform
   */
  readonly platform?: string;

  /**
   * The repository for an Amplify app.
   *
   * *Pattern:* (?s).*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-repository
   */
  readonly repository?: string;

  /**
   * The tag for an Amplify app.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-app.html#cfn-amplify-app-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `EnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppEnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EnvironmentVariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppEnvironmentVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppEnvironmentVariablePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAppEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.EnvironmentVariableProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.EnvironmentVariableProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BasicAuthConfigProperty`
 *
 * @param properties - the TypeScript properties of a `BasicAuthConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppBasicAuthConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableBasicAuth", cdk.validateBoolean)(properties.enableBasicAuth));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"BasicAuthConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppBasicAuthConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppBasicAuthConfigPropertyValidator(properties).assertSuccess();
  return {
    "EnableBasicAuth": cdk.booleanToCloudFormation(properties.enableBasicAuth),
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnAppBasicAuthConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.BasicAuthConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.BasicAuthConfigProperty>();
  ret.addPropertyResult("enableBasicAuth", "EnableBasicAuth", (properties.EnableBasicAuth != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableBasicAuth) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoBranchCreationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AutoBranchCreationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppAutoBranchCreationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoBranchCreationPatterns", cdk.listValidator(cdk.validateString))(properties.autoBranchCreationPatterns));
  errors.collect(cdk.propertyValidator("basicAuthConfig", CfnAppBasicAuthConfigPropertyValidator)(properties.basicAuthConfig));
  errors.collect(cdk.propertyValidator("buildSpec", cdk.validateString)(properties.buildSpec));
  errors.collect(cdk.propertyValidator("enableAutoBranchCreation", cdk.validateBoolean)(properties.enableAutoBranchCreation));
  errors.collect(cdk.propertyValidator("enableAutoBuild", cdk.validateBoolean)(properties.enableAutoBuild));
  errors.collect(cdk.propertyValidator("enablePerformanceMode", cdk.validateBoolean)(properties.enablePerformanceMode));
  errors.collect(cdk.propertyValidator("enablePullRequestPreview", cdk.validateBoolean)(properties.enablePullRequestPreview));
  errors.collect(cdk.propertyValidator("environmentVariables", cdk.listValidator(CfnAppEnvironmentVariablePropertyValidator))(properties.environmentVariables));
  errors.collect(cdk.propertyValidator("framework", cdk.validateString)(properties.framework));
  errors.collect(cdk.propertyValidator("pullRequestEnvironmentName", cdk.validateString)(properties.pullRequestEnvironmentName));
  errors.collect(cdk.propertyValidator("stage", cdk.validateString)(properties.stage));
  return errors.wrap("supplied properties not correct for \"AutoBranchCreationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppAutoBranchCreationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppAutoBranchCreationConfigPropertyValidator(properties).assertSuccess();
  return {
    "AutoBranchCreationPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.autoBranchCreationPatterns),
    "BasicAuthConfig": convertCfnAppBasicAuthConfigPropertyToCloudFormation(properties.basicAuthConfig),
    "BuildSpec": cdk.stringToCloudFormation(properties.buildSpec),
    "EnableAutoBranchCreation": cdk.booleanToCloudFormation(properties.enableAutoBranchCreation),
    "EnableAutoBuild": cdk.booleanToCloudFormation(properties.enableAutoBuild),
    "EnablePerformanceMode": cdk.booleanToCloudFormation(properties.enablePerformanceMode),
    "EnablePullRequestPreview": cdk.booleanToCloudFormation(properties.enablePullRequestPreview),
    "EnvironmentVariables": cdk.listMapper(convertCfnAppEnvironmentVariablePropertyToCloudFormation)(properties.environmentVariables),
    "Framework": cdk.stringToCloudFormation(properties.framework),
    "PullRequestEnvironmentName": cdk.stringToCloudFormation(properties.pullRequestEnvironmentName),
    "Stage": cdk.stringToCloudFormation(properties.stage)
  };
}

// @ts-ignore TS6133
function CfnAppAutoBranchCreationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.AutoBranchCreationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.AutoBranchCreationConfigProperty>();
  ret.addPropertyResult("autoBranchCreationPatterns", "AutoBranchCreationPatterns", (properties.AutoBranchCreationPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AutoBranchCreationPatterns) : undefined));
  ret.addPropertyResult("basicAuthConfig", "BasicAuthConfig", (properties.BasicAuthConfig != null ? CfnAppBasicAuthConfigPropertyFromCloudFormation(properties.BasicAuthConfig) : undefined));
  ret.addPropertyResult("buildSpec", "BuildSpec", (properties.BuildSpec != null ? cfn_parse.FromCloudFormation.getString(properties.BuildSpec) : undefined));
  ret.addPropertyResult("enableAutoBranchCreation", "EnableAutoBranchCreation", (properties.EnableAutoBranchCreation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableAutoBranchCreation) : undefined));
  ret.addPropertyResult("enableAutoBuild", "EnableAutoBuild", (properties.EnableAutoBuild != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableAutoBuild) : undefined));
  ret.addPropertyResult("enablePerformanceMode", "EnablePerformanceMode", (properties.EnablePerformanceMode != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnablePerformanceMode) : undefined));
  ret.addPropertyResult("enablePullRequestPreview", "EnablePullRequestPreview", (properties.EnablePullRequestPreview != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnablePullRequestPreview) : undefined));
  ret.addPropertyResult("environmentVariables", "EnvironmentVariables", (properties.EnvironmentVariables != null ? cfn_parse.FromCloudFormation.getArray(CfnAppEnvironmentVariablePropertyFromCloudFormation)(properties.EnvironmentVariables) : undefined));
  ret.addPropertyResult("framework", "Framework", (properties.Framework != null ? cfn_parse.FromCloudFormation.getString(properties.Framework) : undefined));
  ret.addPropertyResult("pullRequestEnvironmentName", "PullRequestEnvironmentName", (properties.PullRequestEnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.PullRequestEnvironmentName) : undefined));
  ret.addPropertyResult("stage", "Stage", (properties.Stage != null ? cfn_parse.FromCloudFormation.getString(properties.Stage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CustomRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppCustomRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("condition", cdk.validateString)(properties.condition));
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  return errors.wrap("supplied properties not correct for \"CustomRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppCustomRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppCustomRulePropertyValidator(properties).assertSuccess();
  return {
    "Condition": cdk.stringToCloudFormation(properties.condition),
    "Source": cdk.stringToCloudFormation(properties.source),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Target": cdk.stringToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnAppCustomRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApp.CustomRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApp.CustomRuleProperty>();
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? cfn_parse.FromCloudFormation.getString(properties.Condition) : undefined));
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAppProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessToken", cdk.validateString)(properties.accessToken));
  errors.collect(cdk.propertyValidator("autoBranchCreationConfig", CfnAppAutoBranchCreationConfigPropertyValidator)(properties.autoBranchCreationConfig));
  errors.collect(cdk.propertyValidator("basicAuthConfig", CfnAppBasicAuthConfigPropertyValidator)(properties.basicAuthConfig));
  errors.collect(cdk.propertyValidator("buildSpec", cdk.validateString)(properties.buildSpec));
  errors.collect(cdk.propertyValidator("customHeaders", cdk.validateString)(properties.customHeaders));
  errors.collect(cdk.propertyValidator("customRules", cdk.listValidator(CfnAppCustomRulePropertyValidator))(properties.customRules));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("enableBranchAutoDeletion", cdk.validateBoolean)(properties.enableBranchAutoDeletion));
  errors.collect(cdk.propertyValidator("environmentVariables", cdk.listValidator(CfnAppEnvironmentVariablePropertyValidator))(properties.environmentVariables));
  errors.collect(cdk.propertyValidator("iamServiceRole", cdk.validateString)(properties.iamServiceRole));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("oauthToken", cdk.validateString)(properties.oauthToken));
  errors.collect(cdk.propertyValidator("platform", cdk.validateString)(properties.platform));
  errors.collect(cdk.propertyValidator("repository", cdk.validateString)(properties.repository));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAppProps\"");
}

// @ts-ignore TS6133
function convertCfnAppPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppPropsValidator(properties).assertSuccess();
  return {
    "AccessToken": cdk.stringToCloudFormation(properties.accessToken),
    "AutoBranchCreationConfig": convertCfnAppAutoBranchCreationConfigPropertyToCloudFormation(properties.autoBranchCreationConfig),
    "BasicAuthConfig": convertCfnAppBasicAuthConfigPropertyToCloudFormation(properties.basicAuthConfig),
    "BuildSpec": cdk.stringToCloudFormation(properties.buildSpec),
    "CustomHeaders": cdk.stringToCloudFormation(properties.customHeaders),
    "CustomRules": cdk.listMapper(convertCfnAppCustomRulePropertyToCloudFormation)(properties.customRules),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EnableBranchAutoDeletion": cdk.booleanToCloudFormation(properties.enableBranchAutoDeletion),
    "EnvironmentVariables": cdk.listMapper(convertCfnAppEnvironmentVariablePropertyToCloudFormation)(properties.environmentVariables),
    "IAMServiceRole": cdk.stringToCloudFormation(properties.iamServiceRole),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OauthToken": cdk.stringToCloudFormation(properties.oauthToken),
    "Platform": cdk.stringToCloudFormation(properties.platform),
    "Repository": cdk.stringToCloudFormation(properties.repository),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAppPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppProps>();
  ret.addPropertyResult("accessToken", "AccessToken", (properties.AccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.AccessToken) : undefined));
  ret.addPropertyResult("autoBranchCreationConfig", "AutoBranchCreationConfig", (properties.AutoBranchCreationConfig != null ? CfnAppAutoBranchCreationConfigPropertyFromCloudFormation(properties.AutoBranchCreationConfig) : undefined));
  ret.addPropertyResult("basicAuthConfig", "BasicAuthConfig", (properties.BasicAuthConfig != null ? CfnAppBasicAuthConfigPropertyFromCloudFormation(properties.BasicAuthConfig) : undefined));
  ret.addPropertyResult("buildSpec", "BuildSpec", (properties.BuildSpec != null ? cfn_parse.FromCloudFormation.getString(properties.BuildSpec) : undefined));
  ret.addPropertyResult("customHeaders", "CustomHeaders", (properties.CustomHeaders != null ? cfn_parse.FromCloudFormation.getString(properties.CustomHeaders) : undefined));
  ret.addPropertyResult("customRules", "CustomRules", (properties.CustomRules != null ? cfn_parse.FromCloudFormation.getArray(CfnAppCustomRulePropertyFromCloudFormation)(properties.CustomRules) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("enableBranchAutoDeletion", "EnableBranchAutoDeletion", (properties.EnableBranchAutoDeletion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableBranchAutoDeletion) : undefined));
  ret.addPropertyResult("environmentVariables", "EnvironmentVariables", (properties.EnvironmentVariables != null ? cfn_parse.FromCloudFormation.getArray(CfnAppEnvironmentVariablePropertyFromCloudFormation)(properties.EnvironmentVariables) : undefined));
  ret.addPropertyResult("iamServiceRole", "IAMServiceRole", (properties.IAMServiceRole != null ? cfn_parse.FromCloudFormation.getString(properties.IAMServiceRole) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("oauthToken", "OauthToken", (properties.OauthToken != null ? cfn_parse.FromCloudFormation.getString(properties.OauthToken) : undefined));
  ret.addPropertyResult("platform", "Platform", (properties.Platform != null ? cfn_parse.FromCloudFormation.getString(properties.Platform) : undefined));
  ret.addPropertyResult("repository", "Repository", (properties.Repository != null ? cfn_parse.FromCloudFormation.getString(properties.Repository) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::Amplify::Branch resource specifies a new branch within an app.
 *
 * @cloudformationResource AWS::Amplify::Branch
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html
 */
export class CfnBranch extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Amplify::Branch";

  /**
   * Build a CfnBranch from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBranch {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBranchPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBranch(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * ARN for a branch, part of an Amplify App.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Name for a branch, part of an Amplify App.
   *
   * @cloudformationAttribute BranchName
   */
  public readonly attrBranchName: string;

  /**
   * The unique ID for an Amplify app.
   */
  public appId: string;

  /**
   * The backend environment for an Amplify app.
   */
  public backend?: CfnBranch.BackendProperty | cdk.IResolvable;

  /**
   * The basic authorization credentials for a branch of an Amplify app.
   */
  public basicAuthConfig?: CfnBranch.BasicAuthConfigProperty | cdk.IResolvable;

  /**
   * The name for the branch.
   */
  public branchName: string;

  /**
   * The build specification (build spec) for the branch.
   */
  public buildSpec?: string;

  /**
   * The description for the branch that is part of an Amplify app.
   */
  public description?: string;

  /**
   * Enables auto building for the branch.
   */
  public enableAutoBuild?: boolean | cdk.IResolvable;

  /**
   * Enables performance mode for the branch.
   */
  public enablePerformanceMode?: boolean | cdk.IResolvable;

  /**
   * Specifies whether Amplify Hosting creates a preview for each pull request that is made for this branch.
   */
  public enablePullRequestPreview?: boolean | cdk.IResolvable;

  /**
   * The environment variables for the branch.
   */
  public environmentVariables?: Array<CfnBranch.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The framework for the branch.
   */
  public framework?: string;

  /**
   * If pull request previews are enabled for this branch, you can use this property to specify a dedicated backend environment for your previews.
   */
  public pullRequestEnvironmentName?: string;

  /**
   * Describes the current stage for the branch.
   */
  public stage?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tag for the branch.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBranchProps) {
    super(scope, id, {
      "type": CfnBranch.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "appId", this);
    cdk.requireProperty(props, "branchName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrBranchName = cdk.Token.asString(this.getAtt("BranchName", cdk.ResolutionTypeHint.STRING));
    this.appId = props.appId;
    this.backend = props.backend;
    this.basicAuthConfig = props.basicAuthConfig;
    this.branchName = props.branchName;
    this.buildSpec = props.buildSpec;
    this.description = props.description;
    this.enableAutoBuild = props.enableAutoBuild;
    this.enablePerformanceMode = props.enablePerformanceMode;
    this.enablePullRequestPreview = props.enablePullRequestPreview;
    this.environmentVariables = props.environmentVariables;
    this.framework = props.framework;
    this.pullRequestEnvironmentName = props.pullRequestEnvironmentName;
    this.stage = props.stage;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Amplify::Branch", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appId": this.appId,
      "backend": this.backend,
      "basicAuthConfig": this.basicAuthConfig,
      "branchName": this.branchName,
      "buildSpec": this.buildSpec,
      "description": this.description,
      "enableAutoBuild": this.enableAutoBuild,
      "enablePerformanceMode": this.enablePerformanceMode,
      "enablePullRequestPreview": this.enablePullRequestPreview,
      "environmentVariables": this.environmentVariables,
      "framework": this.framework,
      "pullRequestEnvironmentName": this.pullRequestEnvironmentName,
      "stage": this.stage,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBranch.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBranchPropsToCloudFormation(props);
  }
}

export namespace CfnBranch {
  /**
   * The EnvironmentVariable property type sets environment variables for a specific branch.
   *
   * Environment variables are key-value pairs that are available at build time.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-environmentvariable.html
   */
  export interface EnvironmentVariableProperty {
    /**
     * The environment variable name.
     *
     * *Length Constraints:* Maximum length of 255.
     *
     * *Pattern:* (?s).*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-environmentvariable.html#cfn-amplify-branch-environmentvariable-name
     */
    readonly name: string;

    /**
     * The environment variable value.
     *
     * *Length Constraints:* Maximum length of 5500.
     *
     * *Pattern:* (?s).*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-environmentvariable.html#cfn-amplify-branch-environmentvariable-value
     */
    readonly value: string;
  }

  /**
   * Use the BasicAuthConfig property type to set password protection for a specific branch.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-basicauthconfig.html
   */
  export interface BasicAuthConfigProperty {
    /**
     * Enables basic authorization for the branch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-basicauthconfig.html#cfn-amplify-branch-basicauthconfig-enablebasicauth
     */
    readonly enableBasicAuth?: boolean | cdk.IResolvable;

    /**
     * The password for basic authorization.
     *
     * *Length Constraints:* Minimum length of 1. Maximum length of 255.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-basicauthconfig.html#cfn-amplify-branch-basicauthconfig-password
     */
    readonly password: string;

    /**
     * The user name for basic authorization.
     *
     * *Length Constraints:* Minimum length of 1. Maximum length of 255.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-basicauthconfig.html#cfn-amplify-branch-basicauthconfig-username
     */
    readonly username: string;
  }

  /**
   * Describes the backend properties associated with an Amplify `Branch` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-backend.html
   */
  export interface BackendProperty {
    /**
     * The Amazon Resource Name (ARN) for the AWS CloudFormation stack.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-branch-backend.html#cfn-amplify-branch-backend-stackarn
     */
    readonly stackArn?: string;
  }
}

/**
 * Properties for defining a `CfnBranch`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html
 */
export interface CfnBranchProps {
  /**
   * The unique ID for an Amplify app.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-appid
   */
  readonly appId: string;

  /**
   * The backend environment for an Amplify app.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-backend
   */
  readonly backend?: CfnBranch.BackendProperty | cdk.IResolvable;

  /**
   * The basic authorization credentials for a branch of an Amplify app.
   *
   * You must base64-encode the authorization credentials and provide them in the format `user:password` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-basicauthconfig
   */
  readonly basicAuthConfig?: CfnBranch.BasicAuthConfigProperty | cdk.IResolvable;

  /**
   * The name for the branch.
   *
   * *Length Constraints:* Minimum length of 1. Maximum length of 255.
   *
   * *Pattern:* (?s).+
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-branchname
   */
  readonly branchName: string;

  /**
   * The build specification (build spec) for the branch.
   *
   * *Length Constraints:* Minimum length of 1. Maximum length of 25000.
   *
   * *Pattern:* (?s).+
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-buildspec
   */
  readonly buildSpec?: string;

  /**
   * The description for the branch that is part of an Amplify app.
   *
   * *Length Constraints:* Maximum length of 1000.
   *
   * *Pattern:* (?s).*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-description
   */
  readonly description?: string;

  /**
   * Enables auto building for the branch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-enableautobuild
   */
  readonly enableAutoBuild?: boolean | cdk.IResolvable;

  /**
   * Enables performance mode for the branch.
   *
   * Performance mode optimizes for faster hosting performance by keeping content cached at the edge for a longer interval. When performance mode is enabled, hosting configuration or code changes can take up to 10 minutes to roll out.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-enableperformancemode
   */
  readonly enablePerformanceMode?: boolean | cdk.IResolvable;

  /**
   * Specifies whether Amplify Hosting creates a preview for each pull request that is made for this branch.
   *
   * If this property is enabled, Amplify deploys your app to a unique preview URL after each pull request is opened. Development and QA teams can use this preview to test the pull request before it's merged into a production or integration branch.
   *
   * To provide backend support for your preview, Amplify automatically provisions a temporary backend environment that it deletes when the pull request is closed. If you want to specify a dedicated backend environment for your previews, use the `PullRequestEnvironmentName` property.
   *
   * For more information, see [Web Previews](https://docs.aws.amazon.com/amplify/latest/userguide/pr-previews.html) in the *AWS Amplify Hosting User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-enablepullrequestpreview
   */
  readonly enablePullRequestPreview?: boolean | cdk.IResolvable;

  /**
   * The environment variables for the branch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-environmentvariables
   */
  readonly environmentVariables?: Array<CfnBranch.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The framework for the branch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-framework
   */
  readonly framework?: string;

  /**
   * If pull request previews are enabled for this branch, you can use this property to specify a dedicated backend environment for your previews.
   *
   * For example, you could specify an environment named `prod` , `test` , or `dev` that you initialized with the Amplify CLI and mapped to this branch.
   *
   * To enable pull request previews, set the `EnablePullRequestPreview` property to `true` .
   *
   * If you don't specify an environment, Amplify Hosting provides backend support for each preview by automatically provisioning a temporary backend environment. Amplify Hosting deletes this environment when the pull request is closed.
   *
   * For more information about creating backend environments, see [Feature Branch Deployments and Team Workflows](https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html) in the *AWS Amplify Hosting User Guide* .
   *
   * *Length Constraints:* Maximum length of 20.
   *
   * *Pattern:* (?s).*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-pullrequestenvironmentname
   */
  readonly pullRequestEnvironmentName?: string;

  /**
   * Describes the current stage for the branch.
   *
   * *Valid Values:* PRODUCTION | BETA | DEVELOPMENT | EXPERIMENTAL | PULL_REQUEST
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-stage
   */
  readonly stage?: string;

  /**
   * The tag for the branch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-branch.html#cfn-amplify-branch-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `EnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBranchEnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EnvironmentVariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnBranchEnvironmentVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBranchEnvironmentVariablePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnBranchEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBranch.EnvironmentVariableProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBranch.EnvironmentVariableProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BasicAuthConfigProperty`
 *
 * @param properties - the TypeScript properties of a `BasicAuthConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBranchBasicAuthConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableBasicAuth", cdk.validateBoolean)(properties.enableBasicAuth));
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"BasicAuthConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnBranchBasicAuthConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBranchBasicAuthConfigPropertyValidator(properties).assertSuccess();
  return {
    "EnableBasicAuth": cdk.booleanToCloudFormation(properties.enableBasicAuth),
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnBranchBasicAuthConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBranch.BasicAuthConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBranch.BasicAuthConfigProperty>();
  ret.addPropertyResult("enableBasicAuth", "EnableBasicAuth", (properties.EnableBasicAuth != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableBasicAuth) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BackendProperty`
 *
 * @param properties - the TypeScript properties of a `BackendProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBranchBackendPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("stackArn", cdk.validateString)(properties.stackArn));
  return errors.wrap("supplied properties not correct for \"BackendProperty\"");
}

// @ts-ignore TS6133
function convertCfnBranchBackendPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBranchBackendPropertyValidator(properties).assertSuccess();
  return {
    "StackArn": cdk.stringToCloudFormation(properties.stackArn)
  };
}

// @ts-ignore TS6133
function CfnBranchBackendPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBranch.BackendProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBranch.BackendProperty>();
  ret.addPropertyResult("stackArn", "StackArn", (properties.StackArn != null ? cfn_parse.FromCloudFormation.getString(properties.StackArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBranchProps`
 *
 * @param properties - the TypeScript properties of a `CfnBranchProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBranchPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appId", cdk.requiredValidator)(properties.appId));
  errors.collect(cdk.propertyValidator("appId", cdk.validateString)(properties.appId));
  errors.collect(cdk.propertyValidator("backend", CfnBranchBackendPropertyValidator)(properties.backend));
  errors.collect(cdk.propertyValidator("basicAuthConfig", CfnBranchBasicAuthConfigPropertyValidator)(properties.basicAuthConfig));
  errors.collect(cdk.propertyValidator("branchName", cdk.requiredValidator)(properties.branchName));
  errors.collect(cdk.propertyValidator("branchName", cdk.validateString)(properties.branchName));
  errors.collect(cdk.propertyValidator("buildSpec", cdk.validateString)(properties.buildSpec));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("enableAutoBuild", cdk.validateBoolean)(properties.enableAutoBuild));
  errors.collect(cdk.propertyValidator("enablePerformanceMode", cdk.validateBoolean)(properties.enablePerformanceMode));
  errors.collect(cdk.propertyValidator("enablePullRequestPreview", cdk.validateBoolean)(properties.enablePullRequestPreview));
  errors.collect(cdk.propertyValidator("environmentVariables", cdk.listValidator(CfnBranchEnvironmentVariablePropertyValidator))(properties.environmentVariables));
  errors.collect(cdk.propertyValidator("framework", cdk.validateString)(properties.framework));
  errors.collect(cdk.propertyValidator("pullRequestEnvironmentName", cdk.validateString)(properties.pullRequestEnvironmentName));
  errors.collect(cdk.propertyValidator("stage", cdk.validateString)(properties.stage));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnBranchProps\"");
}

// @ts-ignore TS6133
function convertCfnBranchPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBranchPropsValidator(properties).assertSuccess();
  return {
    "AppId": cdk.stringToCloudFormation(properties.appId),
    "Backend": convertCfnBranchBackendPropertyToCloudFormation(properties.backend),
    "BasicAuthConfig": convertCfnBranchBasicAuthConfigPropertyToCloudFormation(properties.basicAuthConfig),
    "BranchName": cdk.stringToCloudFormation(properties.branchName),
    "BuildSpec": cdk.stringToCloudFormation(properties.buildSpec),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EnableAutoBuild": cdk.booleanToCloudFormation(properties.enableAutoBuild),
    "EnablePerformanceMode": cdk.booleanToCloudFormation(properties.enablePerformanceMode),
    "EnablePullRequestPreview": cdk.booleanToCloudFormation(properties.enablePullRequestPreview),
    "EnvironmentVariables": cdk.listMapper(convertCfnBranchEnvironmentVariablePropertyToCloudFormation)(properties.environmentVariables),
    "Framework": cdk.stringToCloudFormation(properties.framework),
    "PullRequestEnvironmentName": cdk.stringToCloudFormation(properties.pullRequestEnvironmentName),
    "Stage": cdk.stringToCloudFormation(properties.stage),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnBranchPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBranchProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBranchProps>();
  ret.addPropertyResult("appId", "AppId", (properties.AppId != null ? cfn_parse.FromCloudFormation.getString(properties.AppId) : undefined));
  ret.addPropertyResult("backend", "Backend", (properties.Backend != null ? CfnBranchBackendPropertyFromCloudFormation(properties.Backend) : undefined));
  ret.addPropertyResult("basicAuthConfig", "BasicAuthConfig", (properties.BasicAuthConfig != null ? CfnBranchBasicAuthConfigPropertyFromCloudFormation(properties.BasicAuthConfig) : undefined));
  ret.addPropertyResult("branchName", "BranchName", (properties.BranchName != null ? cfn_parse.FromCloudFormation.getString(properties.BranchName) : undefined));
  ret.addPropertyResult("buildSpec", "BuildSpec", (properties.BuildSpec != null ? cfn_parse.FromCloudFormation.getString(properties.BuildSpec) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("enableAutoBuild", "EnableAutoBuild", (properties.EnableAutoBuild != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableAutoBuild) : undefined));
  ret.addPropertyResult("enablePerformanceMode", "EnablePerformanceMode", (properties.EnablePerformanceMode != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnablePerformanceMode) : undefined));
  ret.addPropertyResult("enablePullRequestPreview", "EnablePullRequestPreview", (properties.EnablePullRequestPreview != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnablePullRequestPreview) : undefined));
  ret.addPropertyResult("environmentVariables", "EnvironmentVariables", (properties.EnvironmentVariables != null ? cfn_parse.FromCloudFormation.getArray(CfnBranchEnvironmentVariablePropertyFromCloudFormation)(properties.EnvironmentVariables) : undefined));
  ret.addPropertyResult("framework", "Framework", (properties.Framework != null ? cfn_parse.FromCloudFormation.getString(properties.Framework) : undefined));
  ret.addPropertyResult("pullRequestEnvironmentName", "PullRequestEnvironmentName", (properties.PullRequestEnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.PullRequestEnvironmentName) : undefined));
  ret.addPropertyResult("stage", "Stage", (properties.Stage != null ? cfn_parse.FromCloudFormation.getString(properties.Stage) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::Amplify::Domain resource allows you to connect a custom domain to your app.
 *
 * @cloudformationResource AWS::Amplify::Domain
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-domain.html
 */
export class CfnDomain extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Amplify::Domain";

  /**
   * Build a CfnDomain from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomain {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDomainPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDomain(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * ARN for the Domain Association.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Branch patterns for the automatically created subdomain.
   *
   * @cloudformationAttribute AutoSubDomainCreationPatterns
   */
  public readonly attrAutoSubDomainCreationPatterns: Array<string>;

  /**
   * The IAM service role for the subdomain.
   *
   * @cloudformationAttribute AutoSubDomainIAMRole
   */
  public readonly attrAutoSubDomainIamRole: string;

  /**
   * DNS Record for certificate verification.
   *
   * @cloudformationAttribute CertificateRecord
   */
  public readonly attrCertificateRecord: string;

  /**
   * Name of the domain.
   *
   * @cloudformationAttribute DomainName
   */
  public readonly attrDomainName: string;

  /**
   * Status for the Domain Association.
   *
   * @cloudformationAttribute DomainStatus
   */
  public readonly attrDomainStatus: string;

  /**
   * Specifies whether the automated creation of subdomains for branches is enabled.
   *
   * @cloudformationAttribute EnableAutoSubDomain
   */
  public readonly attrEnableAutoSubDomain: cdk.IResolvable;

  /**
   * Reason for the current status of the domain.
   *
   * @cloudformationAttribute StatusReason
   */
  public readonly attrStatusReason: string;

  /**
   * The unique ID for an Amplify app.
   */
  public appId: string;

  /**
   * Sets the branch patterns for automatic subdomain creation.
   */
  public autoSubDomainCreationPatterns?: Array<string>;

  /**
   * The required AWS Identity and Access Management (IAM) service role for the Amazon Resource Name (ARN) for automatically creating subdomains.
   */
  public autoSubDomainIamRole?: string;

  /**
   * The domain name for the domain association.
   */
  public domainName: string;

  /**
   * Enables the automated creation of subdomains for branches.
   */
  public enableAutoSubDomain?: boolean | cdk.IResolvable;

  /**
   * The setting for the subdomain.
   */
  public subDomainSettings: Array<cdk.IResolvable | CfnDomain.SubDomainSettingProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDomainProps) {
    super(scope, id, {
      "type": CfnDomain.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "appId", this);
    cdk.requireProperty(props, "domainName", this);
    cdk.requireProperty(props, "subDomainSettings", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrAutoSubDomainCreationPatterns = cdk.Token.asList(this.getAtt("AutoSubDomainCreationPatterns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrAutoSubDomainIamRole = cdk.Token.asString(this.getAtt("AutoSubDomainIAMRole", cdk.ResolutionTypeHint.STRING));
    this.attrCertificateRecord = cdk.Token.asString(this.getAtt("CertificateRecord", cdk.ResolutionTypeHint.STRING));
    this.attrDomainName = cdk.Token.asString(this.getAtt("DomainName", cdk.ResolutionTypeHint.STRING));
    this.attrDomainStatus = cdk.Token.asString(this.getAtt("DomainStatus", cdk.ResolutionTypeHint.STRING));
    this.attrEnableAutoSubDomain = this.getAtt("EnableAutoSubDomain");
    this.attrStatusReason = cdk.Token.asString(this.getAtt("StatusReason", cdk.ResolutionTypeHint.STRING));
    this.appId = props.appId;
    this.autoSubDomainCreationPatterns = props.autoSubDomainCreationPatterns;
    this.autoSubDomainIamRole = props.autoSubDomainIamRole;
    this.domainName = props.domainName;
    this.enableAutoSubDomain = props.enableAutoSubDomain;
    this.subDomainSettings = props.subDomainSettings;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appId": this.appId,
      "autoSubDomainCreationPatterns": this.autoSubDomainCreationPatterns,
      "autoSubDomainIamRole": this.autoSubDomainIamRole,
      "domainName": this.domainName,
      "enableAutoSubDomain": this.enableAutoSubDomain,
      "subDomainSettings": this.subDomainSettings
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomain.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDomainPropsToCloudFormation(props);
  }
}

export namespace CfnDomain {
  /**
   * The SubDomainSetting property type enables you to connect a subdomain (for example, example.exampledomain.com) to a specific branch.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-domain-subdomainsetting.html
   */
  export interface SubDomainSettingProperty {
    /**
     * The branch name setting for the subdomain.
     *
     * *Length Constraints:* Minimum length of 1. Maximum length of 255.
     *
     * *Pattern:* (?s).+
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-domain-subdomainsetting.html#cfn-amplify-domain-subdomainsetting-branchname
     */
    readonly branchName: string;

    /**
     * The prefix setting for the subdomain.
     *
     * *Length Constraints:* Maximum length of 255.
     *
     * *Pattern:* (?s).*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-amplify-domain-subdomainsetting.html#cfn-amplify-domain-subdomainsetting-prefix
     */
    readonly prefix: string;
  }
}

/**
 * Properties for defining a `CfnDomain`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-domain.html
 */
export interface CfnDomainProps {
  /**
   * The unique ID for an Amplify app.
   *
   * *Length Constraints:* Minimum length of 1. Maximum length of 20.
   *
   * *Pattern:* d[a-z0-9]+
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-domain.html#cfn-amplify-domain-appid
   */
  readonly appId: string;

  /**
   * Sets the branch patterns for automatic subdomain creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-domain.html#cfn-amplify-domain-autosubdomaincreationpatterns
   */
  readonly autoSubDomainCreationPatterns?: Array<string>;

  /**
   * The required AWS Identity and Access Management (IAM) service role for the Amazon Resource Name (ARN) for automatically creating subdomains.
   *
   * *Length Constraints:* Maximum length of 1000.
   *
   * *Pattern:* ^$|^arn:aws:iam::\d{12}:role.+
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-domain.html#cfn-amplify-domain-autosubdomainiamrole
   */
  readonly autoSubDomainIamRole?: string;

  /**
   * The domain name for the domain association.
   *
   * *Length Constraints:* Maximum length of 255.
   *
   * *Pattern:* ^(((?!-)[A-Za-z0-9-]{0,62}[A-Za-z0-9])\.)+((?!-)[A-Za-z0-9-]{1,62}[A-Za-z0-9])(\.)?$
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-domain.html#cfn-amplify-domain-domainname
   */
  readonly domainName: string;

  /**
   * Enables the automated creation of subdomains for branches.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-domain.html#cfn-amplify-domain-enableautosubdomain
   */
  readonly enableAutoSubDomain?: boolean | cdk.IResolvable;

  /**
   * The setting for the subdomain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-amplify-domain.html#cfn-amplify-domain-subdomainsettings
   */
  readonly subDomainSettings: Array<cdk.IResolvable | CfnDomain.SubDomainSettingProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `SubDomainSettingProperty`
 *
 * @param properties - the TypeScript properties of a `SubDomainSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainSubDomainSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("branchName", cdk.requiredValidator)(properties.branchName));
  errors.collect(cdk.propertyValidator("branchName", cdk.validateString)(properties.branchName));
  errors.collect(cdk.propertyValidator("prefix", cdk.requiredValidator)(properties.prefix));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  return errors.wrap("supplied properties not correct for \"SubDomainSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainSubDomainSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainSubDomainSettingPropertyValidator(properties).assertSuccess();
  return {
    "BranchName": cdk.stringToCloudFormation(properties.branchName),
    "Prefix": cdk.stringToCloudFormation(properties.prefix)
  };
}

// @ts-ignore TS6133
function CfnDomainSubDomainSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.SubDomainSettingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.SubDomainSettingProperty>();
  ret.addPropertyResult("branchName", "BranchName", (properties.BranchName != null ? cfn_parse.FromCloudFormation.getString(properties.BranchName) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDomainProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appId", cdk.requiredValidator)(properties.appId));
  errors.collect(cdk.propertyValidator("appId", cdk.validateString)(properties.appId));
  errors.collect(cdk.propertyValidator("autoSubDomainCreationPatterns", cdk.listValidator(cdk.validateString))(properties.autoSubDomainCreationPatterns));
  errors.collect(cdk.propertyValidator("autoSubDomainIamRole", cdk.validateString)(properties.autoSubDomainIamRole));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("enableAutoSubDomain", cdk.validateBoolean)(properties.enableAutoSubDomain));
  errors.collect(cdk.propertyValidator("subDomainSettings", cdk.requiredValidator)(properties.subDomainSettings));
  errors.collect(cdk.propertyValidator("subDomainSettings", cdk.listValidator(CfnDomainSubDomainSettingPropertyValidator))(properties.subDomainSettings));
  return errors.wrap("supplied properties not correct for \"CfnDomainProps\"");
}

// @ts-ignore TS6133
function convertCfnDomainPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainPropsValidator(properties).assertSuccess();
  return {
    "AppId": cdk.stringToCloudFormation(properties.appId),
    "AutoSubDomainCreationPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.autoSubDomainCreationPatterns),
    "AutoSubDomainIAMRole": cdk.stringToCloudFormation(properties.autoSubDomainIamRole),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "EnableAutoSubDomain": cdk.booleanToCloudFormation(properties.enableAutoSubDomain),
    "SubDomainSettings": cdk.listMapper(convertCfnDomainSubDomainSettingPropertyToCloudFormation)(properties.subDomainSettings)
  };
}

// @ts-ignore TS6133
function CfnDomainPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainProps>();
  ret.addPropertyResult("appId", "AppId", (properties.AppId != null ? cfn_parse.FromCloudFormation.getString(properties.AppId) : undefined));
  ret.addPropertyResult("autoSubDomainCreationPatterns", "AutoSubDomainCreationPatterns", (properties.AutoSubDomainCreationPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AutoSubDomainCreationPatterns) : undefined));
  ret.addPropertyResult("autoSubDomainIamRole", "AutoSubDomainIAMRole", (properties.AutoSubDomainIAMRole != null ? cfn_parse.FromCloudFormation.getString(properties.AutoSubDomainIAMRole) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("enableAutoSubDomain", "EnableAutoSubDomain", (properties.EnableAutoSubDomain != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableAutoSubDomain) : undefined));
  ret.addPropertyResult("subDomainSettings", "SubDomainSettings", (properties.SubDomainSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnDomainSubDomainSettingPropertyFromCloudFormation)(properties.SubDomainSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}