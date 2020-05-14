const cfn = require("@aws-cdk/aws-cloudformation");
const assets = require("@aws-cdk/aws-s3-assets");
const core = require("@aws-cdk/core");
const path = require("path");

const ExampleAsset = {
    ASSET_1: "asset1.txt",
    ASSET_2: "asset2.txt",
};
exports.ExampleAsset = ExampleAsset;

/**
 * We need to have this class in JavaScript,
 * instead of TypeScript,
 * because of cyclical dependencies between assets and the aws-cdk module.
 * It all works at runtime if compilation is not needed though.
 */
class MyTestCdkStack extends core.Stack {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            env: {
                account: props.env.account,
                region: props.env.region,
            },
        });

        // we need to have at least one resource
        // make it different based on the asset,
        // because otherwise the ChangeSet will be empty
        // (parameter changes are actually not enough to create a ChangeSet)
        new cfn.CfnWaitConditionHandle(this, `Dummy_${props.assetType.toString()}`);

        // have an asset, to make sure we're exercising the bootstrapping stack
        new assets.Asset(this, 'Asset', {
            path: path.join(__dirname, 'assets', props.assetType.toString()),
        });
    }
}
exports.MyTestCdkStack = MyTestCdkStack;
