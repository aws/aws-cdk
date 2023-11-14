import { IPackageSource } from './package-sources/source';
import { packageSourceInSubprocess } from './package-sources/subprocess';

export interface PackageContext {
  readonly packages: IPackageSource;
}

export function withPackages<A extends object>(block: (context: A & PackageContext) => Promise<void>) {
  return async (context: A) => {
    return block({
      ...context,
      packages: packageSourceInSubprocess(),
    });
  };
}