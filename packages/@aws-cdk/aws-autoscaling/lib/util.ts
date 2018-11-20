import cdk = require('@aws-cdk/cdk');
/**
 * Allow lazy evaluation of a list of dependables
 */
export class LazyDependable implements cdk.IDependable {
  constructor(private readonly depList: cdk.IDependable[]) {
  }

  public get dependencyElements(): cdk.IDependable[] {
    return this.depList;
  }
}