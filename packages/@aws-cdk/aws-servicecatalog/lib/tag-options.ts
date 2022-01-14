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
   * TagOption keys and associated list of possible values.
   */
  readonly tagOptions: { [key: string]: string[] };
}

/**
 * Defines a set of TagOptions, which are a list of key-value pairs managed in AWS Service Catalog.
 * It is not an AWS tag, but serves as a template for creating an AWS tag based on the TagOption.
 * @resource AWS::ServiceCatalog::TagOption
 */
export class TagOptions extends cdk.Resource {
  /**
   * Map of underlying TagOption resources.
   *
   * @internal
   */
  public readonly _tagOptionsMap: { [key: string]: CfnTagOption };

  constructor(scope: Construct, id: string, props: TagOptionsProps) {
    super(scope, id);
    this._tagOptionsMap = this.createUnderlyingTagOptions(props.tagOptions);
  }

  private createUnderlyingTagOptions(tagOptions: { [key: string]: string[] }): { [key: string]: CfnTagOption } {
    var tagOptionMap: { [key: string]: CfnTagOption } = {};
    for (const [key, tagOptionsList] of Object.entries(tagOptions)) {
      InputValidator.validateLength(this.node.addr, 'TagOption key', 1, 128, key);
      tagOptionsList.forEach((value: string) => {
        InputValidator.validateLength(this.node.addr, 'TagOption value', 1, 256, value);
        const tagOptionIdentifier = `$TagOption${hashValues(key, value)}`;
        if (!this.node.tryFindChild(tagOptionIdentifier)) {
          const tagOption = new CfnTagOption(this, tagOptionIdentifier, {
            key: key,
            value: value,
          });
          tagOptionMap[tagOptionIdentifier] = tagOption;
        }
      });
    }
    return tagOptionMap;
  }
}
