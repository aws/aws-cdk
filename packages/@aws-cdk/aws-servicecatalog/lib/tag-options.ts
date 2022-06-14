import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { hashValues } from './private/util';
import { InputValidator } from './private/validation';
import { CfnTagOption } from './servicecatalog.generated';

/**
 * Properties for TagOptions.
 */
export interface TagOptionsProps {
  /**
   * The values that are allowed to be set for specific tags.
   * The keys of the map represent the tag keys,
   * and the values of the map are a list of allowed values for that particular tag key.
   */
  readonly allowedValuesForTags: { [tagKey: string]: string[] };
}

/**
 * Defines a set of TagOptions, which are a list of key-value pairs managed in AWS Service Catalog.
 * It is not an AWS tag, but serves as a template for creating an AWS tag based on the TagOption.
 * See https://docs.aws.amazon.com/servicecatalog/latest/adminguide/tagoptions.html
 *
 * @resource AWS::ServiceCatalog::TagOption
 */
export class TagOptions extends cdk.Resource {
  /**
   * List of underlying CfnTagOption resources.
   *
   * @internal
   */
  public _cfnTagOptions: CfnTagOption[];

  constructor(scope: Construct, id: string, props: TagOptionsProps) {
    super(scope, id);

    this._cfnTagOptions = this.createUnderlyingTagOptions(props.allowedValuesForTags);
  }

  private createUnderlyingTagOptions(allowedValuesForTags: { [tagKey: string]: string[] }): CfnTagOption[] {
    if (Object.keys(allowedValuesForTags).length === 0) {
      throw new Error(`No tag option keys or values were provided for resource ${this.node.path}`);
    }
    var tagOptions: CfnTagOption[] = [];

    for (const [tagKey, tagValues] of Object.entries(allowedValuesForTags)) {
      InputValidator.validateLength(this.node.addr, 'TagOption key', 1, 128, tagKey);

      const uniqueTagValues = new Set(tagValues);
      if (uniqueTagValues.size === 0) {
        throw new Error(`No tag option values were provided for tag option key ${tagKey} for resource ${this.node.path}`);
      }
      uniqueTagValues.forEach((tagValue: string) => {
        InputValidator.validateLength(this.node.addr, 'TagOption value', 1, 256, tagValue);
        const tagOptionIdentifier = hashValues(tagKey, tagValue);
        const tagOption = new CfnTagOption(this, tagOptionIdentifier, {
          key: tagKey,
          value: tagValue,
          active: true,
        });
        tagOptions.push(tagOption);
      });
    }
    return tagOptions;
  }
}

