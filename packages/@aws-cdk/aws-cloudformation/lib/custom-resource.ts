import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './cloudformation.generated';

/**
 * Collection of arbitrary properties
 */
export type Properties = {[key: string]: any};

/**
 * Properties to provide a Lambda-backed custom resource
 */
export interface CustomResourceProps {
  /**
   * The Lambda provider that implements this custom resource.
   *
   * We recommend using a lambda.SingletonFunction for this.
   *
   * Optional, exactly one of lamdaProvider or topicProvider must be set.
   */
  lambdaProvider?: lambda.FunctionRef;

  /**
   * The SNS Topic for the provider that implements this custom resource.
   *
   * Optional, exactly one of lamdaProvider or topicProvider must be set.
   */
  topicProvider?: sns.TopicRef;

  /**
   * Properties to pass to the Lambda
   */
  properties?: Properties;
}

/**
 * Custom resource that is implemented using a Lambda
 *
 * As a custom resource author, you should be publishing a subclass of this class
 * that hides the choice of provider, and accepts a strongly-typed properties
 * object with the properties your provider accepts.
 */
export class CustomResource extends cloudformation.CustomResource {
  // Needs to be implemented using inheritance because we must override the `renderProperties`
  // The generated props classes will never render properties that they don't know about.

  private readonly userProperties?: Properties;

  constructor(parent: cdk.Construct, name: string, props: CustomResourceProps) {
    if (!!props.lambdaProvider === !!props.topicProvider) {
      throw new Error('Exactly one of "lambdaProvider" or "topicProvider" must be set.');
    }

    super(parent, name, {
      serviceToken: props.lambdaProvider ? props.lambdaProvider.functionArn : props.topicProvider!.topicArn
    });

    this.userProperties = props.properties;
  }

  /**
   * Override renderProperties to mix in the user-defined properties
   */
  protected renderProperties(): {[key: string]: any}  {
    const props = super.renderProperties();
    return Object.assign(props, uppercaseProperties(this.userProperties || {}));
  }

}

/**
 * Uppercase the first letter of every property name
 *
 * It's customary for CloudFormation properties to start with capitals, and our
 * properties to start with lowercase, so this function translates from one
 * to the other
 */
function uppercaseProperties(props: Properties): Properties {
  const ret: Properties = {};
  Object.keys(props).forEach(key => {
    const upper = key.substr(0, 1).toUpperCase() + key.substr(1);
    ret[upper] = props[key];
  });
  return ret;
}
