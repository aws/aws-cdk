import * as cdk from '@aws-cdk/core';
import { hashValues } from './private/util';
import { InputValidator } from './private/validation';
import { CfnTagOption } from './servicecatalog.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

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
   * Map of underlying TagOption resources.
   *
   * @internal
   */
  public readonly _tagOptionsMap: { [tagOptionIdentifier: string]: CfnTagOption };

  constructor(scope: Construct, id: string, props: TagOptionsProps) {
    super(scope, id);

    this._tagOptionsMap = this.createUnderlyingTagOptions(props.allowedValuesForTags);
  }

  private createUnderlyingTagOptions(tagOptions: { [tagKey: string]: string[] }): { [tagOptionIdentifier: string]: CfnTagOption } {
    var tagOptionMap: { [tagOptionIdentifier: string]: CfnTagOption } = {};
    for (const [tagKey, tagOptionsList] of Object.entries(tagOptions)) {
      InputValidator.validateLength(this.node.addr, 'TagOption key', 1, 128, tagKey);
      tagOptionsList.forEach((tagValue: string) => {
        InputValidator.validateLength(this.node.addr, 'TagOption value', 1, 256, tagValue);
        const tagOptionIdentifier = hashValues(tagKey, tagValue);
        if (!this.node.tryFindChild(tagOptionIdentifier)) {
          const tagOption = new CfnTagOption(this, tagOptionIdentifier, {
            key: tagKey,
            value: tagValue,
            active: true,
          });
          tagOptionMap[tagOptionIdentifier] = tagOption;
        }
      });
    }
    return tagOptionMap;
  }
}
