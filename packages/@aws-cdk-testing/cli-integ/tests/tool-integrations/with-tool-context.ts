import { TestContext } from '../../lib/integ-test';
import { AwsContext, withAws } from '../../lib/with-aws';
import { DisableBootstrapContext } from '../../lib/with-cdk-app';
import { PackageContext, withPackages } from '../../lib/with-packages';
import { TemporaryDirectoryContext, withTemporaryDirectory } from '../../lib/with-temporary-directory';

/**
 * The default prerequisites for tests running tool integrations
 */
export function withToolContext<A extends TestContext>(
  block: (context: A & TemporaryDirectoryContext & PackageContext & AwsContext & DisableBootstrapContext
  ) => Promise<void>) {
  return withAws(withTemporaryDirectory(withPackages(block)));
}
