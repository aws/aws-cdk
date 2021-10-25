import * as crypto from 'crypto';
import * as cdk from '@aws-cdk/core';
import { Node } from 'constructs';
import { ProductStackSynthesizer } from './private/product-stack-synthesizer';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct } from '@aws-cdk/core';

const PRODUCT_STACK_SYMBOL = Symbol.for('@aws-cdk/aws-servicecatalog.ProductStack');

/**
 * A Service Catalog product stack, which is similar in form to a Cloudformation nested stack.
 * You can add the resources to this stack that you want to define for your service catalog product.
 *
 * This stack will not be treated as an independent deployment
 * artifact (won't be listed in "cdk list" or deployable through "cdk deploy"),
 * but rather only synthesized as a template and uploaded as an asset to S3.
 *
 */
export class ProductStack extends cdk.Stack {
  /**
   * Checks if `x` is an object of type `ProductStack`.
  */
  public static isProductStack(x: any): x is ProductStack {
    return x != null && typeof(x) === 'object' && PRODUCT_STACK_SYMBOL in x;
  }

  public readonly templateFile: string;
  private _templateUrl: string;
  private _parentStack: cdk.Stack;

  constructor(scope: Construct, id: string) {
    const parentStack = findParentStack(scope);

    super(scope, id, {
      env: { account: parentStack.account, region: parentStack.region },
      synthesizer: new ProductStackSynthesizer(),
    });

    this._parentStack = parentStack;

    Object.defineProperty(this, PRODUCT_STACK_SYMBOL, { value: true });

    // this is the file name of the synthesized template file within the cloud assembly
    this.templateFile = `${cdk.Names.uniqueId(this)}.product.template.json`;

    this._templateUrl = this._prepareTemplateAsset();
  }

  /**
   * Assign a value to one of the nested stack parameters.
   */
  public templateUrl() {
    return this._templateUrl;
  }

  /**
   * Defines an asset at the parent stack which represents the template of this
   * nested stack.
   *
   * This private API is used by `App.prepare()` within a loop that rectifies
   * references every time an asset is added. This is because (at the moment)
   * assets are addressed using CloudFormation parameters.
   *
   * @returns `true` if a new asset was added or `false` if an asset was
   * previously added. When this returns `true`, App will do another reference
   * rectification cycle.
   *
   * @internal
   */
  public _prepareTemplateAsset() {

    const cfn = JSON.stringify(this._toCloudFormation());
    const templateHash = crypto.createHash('sha256').update(cfn).digest('hex');

    const templateLocation = this._parentStack.synthesizer.addFileAsset({
      packaging: cdk.FileAssetPackaging.FILE,
      sourceHash: templateHash,
      fileName: this.templateFile,
    });

    // if bucketName/objectKey are cfn parameters from a stack other than the parent stack, they will
    // be resolved as cross-stack references like any other (see "multi" tests).
    return `https://s3.${this._parentStack.region}.${this._parentStack.urlSuffix}/${templateLocation.bucketName}/${templateLocation.objectKey}`;
  }
}

/**
 * Validates the scope for a product stack, which must be defined within the scope of another `Stack`.
 */
function findParentStack(scope: Construct): cdk.Stack {
  if (!scope) {
    throw new Error('Product stacks cannot be defined as a root construct');
  }

  const parentStack = Node.of(scope).scopes.reverse().find(p => cdk.Stack.isStack(p));
  if (!parentStack) {
    throw new Error('Product stacks must be defined within scope of another non-product stack');
  }

  return parentStack as cdk.Stack;
}
