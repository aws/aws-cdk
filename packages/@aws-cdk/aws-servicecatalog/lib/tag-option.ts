import * as cdk from '@aws-cdk/core';
import { hashValues } from './private/util';
import { InputValidator } from './private/validation';
import { CfnTagOption } from './servicecatalog.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * Properties for a service catalog TagOption.
 */
export interface TagOptionProps {
  /**
   * The TagOption key.
   */
  readonly key: string;

  /**
   * The TagOption value.
   */
  readonly value: string;
}

/**
 * TagOption is a key-value pair managed in AWS Service Catalog.
 * It is not an AWS tag, but serves as a template for creating an AWS tag based on the TagOption.
 */
export interface ITagOption extends cdk.IResource {
  /**
   * The ID of the TagOption.
   * @attribute
   */
  readonly tagOptionId: string;
}

abstract class TagOptionBase extends cdk.Resource implements ITagOption {
  public abstract readonly tagOptionId: string;
}

/**
 * A Service Catalog TagOption.
 */
export class TagOption extends TagOptionBase {
  /**
   * Creates a TagOption construct that represents an external TagOption.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   */
  public static fromTagOptionId(scope: Construct, id: string, tagOptionId: string): ITagOption {
    class Import extends TagOptionBase {
      public readonly tagOptionId = tagOptionId;
    }
    return new Import(scope, id);
  }

  public readonly tagOptionId: string;

  constructor(scope: Construct, id: string, props: TagOptionProps) {
    super(scope, id);
    InputValidator.validateLength(this.node.path, 'TagOption key', 1, 128, props.key);
    InputValidator.validateLength(this.node.path, 'TagOption value', 1, 256, props.value);

    const tagOptionKey = hashValues(props.key, props.value);
    const cfnTagOption = new CfnTagOption(this, `TagOption${tagOptionKey}`, {
      key: props.key,
      value: props.value,
    });
    this.tagOptionId = cfnTagOption.ref;
  }
}

/**
 * Defines a set of TagOptions, which are a list of key-value pairs managed in AWS Service Catalog.
 * It is not an AWS tag, but serves as a template for creating an AWS tag based on the TagOption.
 */
export class TagOptions {
  /**
   * Map of underlying TagOption resources.
   */
  public readonly tagOptionsMap: { [key:string] : {[value:string] :TagOption}};

  constructor(scope: Construct, tagOptions: { [key: string]: string[] }) {
    this.tagOptionsMap = this.createUnderlyingTagOptions(scope, tagOptions);
  }

  private createUnderlyingTagOptions(scope: Construct, tagOptions: { [key: string]: string[] }): {[key:string] : {[value:string] :TagOption}} {
    var tagOptionMap: {[key:string] : {[value:string] : TagOption}} = {};
    for (const [key, tagOptionsList] of Object.entries(tagOptions)) {

      tagOptionsList.forEach((value: string) => {
        const tagOptionKey = hashValues(key, value);
        const tagOption = new TagOption(cdk.Stack.of(scope), `TagOptions${tagOptionKey}`, {
          key: key,
          value: value,
        });
        if (!tagOptionMap[key]) {
          tagOptionMap[key] = {};
        }
        tagOptionMap[key][value] = tagOption;
      });
    }
    return tagOptionMap;
  }
}
