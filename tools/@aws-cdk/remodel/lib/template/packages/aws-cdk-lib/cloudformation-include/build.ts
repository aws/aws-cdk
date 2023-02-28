/**
 * This build file has two purposes:
 *   1. It adds a dependency on each @aws-cdk/aws-xyz package with L1s to this package.
 *   2. It generates the file cfn-types-2-classes.json that contains a mapping
 *     between the CloudFormation type and the fully-qualified name of the L1 class,
 *     used in the logic of the CfnInclude class.
 */

export async function main() {
  console.log('this needs to build the map of CFN resource types to L1s');
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
