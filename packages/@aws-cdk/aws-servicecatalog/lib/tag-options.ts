import * as cdk from '@aws-cdk/core';
import { hashValues } from './private/util';
import { InputValidator } from './private/validation';
import { CfnTagOption } from './servicecatalog.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * Defines a set of TagOptions, which are a list of key-value pairs managed in AWS Service Catalog.
 * It is not an AWS tag, but serves as a template for creating an AWS tag based on the TagOption.
 */
export class TagOptions {
  /**
   * Map of underlying TagOption resources.
   */
  public readonly tagOptionsMap: { [key: string]: CfnTagOption };

  constructor(scope: Construct, tagOptions: { [key: string]: string[] }) {
    this.tagOptionsMap = this.createUnderlyingTagOptions(scope, tagOptions);
  }

  private createUnderlyingTagOptions(scope: Construct, tagOptions: { [key: string]: string[] }): { [key: string]: CfnTagOption } {
    var tagOptionMap: { [key: string]: CfnTagOption } = {};
    for (const [key, tagOptionsList] of Object.entries(tagOptions)) {
      InputValidator.validateLength(cdk.Stack.of(scope).node.addr, 'TagOption key', 1, 128, key);
      tagOptionsList.forEach((value: string) => {
        InputValidator.validateLength(cdk.Stack.of(scope).node.addr, 'TagOption value', 1, 256, value);
        const tagOptionIdentifier = `TagOptions${hashValues(key, value)}`;
        const tagOption = new CfnTagOption(cdk.Stack.of(scope), tagOptionIdentifier, {
          key: key,
          value: value,
        });
        tagOptionMap[tagOptionIdentifier] = tagOption;
      });
    }
    return tagOptionMap;
  }
}