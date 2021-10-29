import * as crypto from 'crypto';
import * as cdk from '@aws-cdk/core';
import { ProductStackSynthesizer } from './private/product-stack-synthesizer';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct } from '@aws-cdk/core';

/**
 * A Service Catalog product stack, which is similar in form to a Cloudformation nested stack.
 * You can add the resources to this stack that you want to define for your service catalog product.
 *
 * This stack will not be treated as an independent deployment
 * artifact (won't be listed in "cdk list" or deployable through "cdk deploy"),
 * but rather only synthesized as a template and uploaded as an asset to S3.
 *
 */
export class ProductStack extends cdk.Stack implements cdk.IChildStack {
  public readonly templateFile: string;
  private _templateUrl?: string;
  private _parentStack: cdk.Stack;

  constructor(scope: Construct, id: string) {
    super(scope, id, {
      synthesizer: new ProductStackSynthesizer(),
    });

    this._parentStack = findParentStack(scope);

    // this is the file name of the synthesized template file within the cloud assembly
    this.templateFile = `${cdk.Names.uniqueId(this)}.product.template.json`;
  }

  /**
   * Fetch the template URL.
   *
   * @internal
   */
  public _getTemplateUrl(): string {
    return cdk.Lazy.uncachedString({ produce: () => this._templateUrl });
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
  public _prepareTemplateAsset(): boolean {
    if (this._templateUrl) {
      return false;
    }

    const cfn = JSON.stringify(this._toCloudFormation());
    const templateHash = crypto.createHash('sha256').update(cfn).digest('hex');

    const templateLocation = this._parentStack.synthesizer.addFileAsset({
      packaging: cdk.FileAssetPackaging.FILE,
      sourceHash: templateHash,
      fileName: this.templateFile,
    });

    // if bucketName/objectKey are cfn parameters from a stack other than the parent stack, they will
    // be resolved as cross-stack references like any other (see "multi" tests).
    this._templateUrl = `https://s3.${this._parentStack.region}.${this._parentStack.urlSuffix}/${templateLocation.bucketName}/${templateLocation.objectKey}`;
    return true;
  }
}

/**
 * Validates the scope for a product stack, which must be defined within the scope of another `Stack`.
 */
function findParentStack(scope: Construct): cdk.Stack {
  try {
    const parentStack = cdk.Stack.of(scope);
    return parentStack as cdk.Stack;
  } catch (e) {
    throw new Error('Product stacks must be defined within scope of another non-product stack');
  }
}
