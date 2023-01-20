import { ReleasePackageSource } from './release-source';
import { RepoPackageSource } from './repo-source';
import { IPackageSourceSetup, IPackageSource } from './source';

export function serializeForSubprocess(s: IPackageSourceSetup) {
  process.env.PACKAGE_SOURCE = s.name;
}

export function packageSourceInSubprocess(): IPackageSource {
  switch (process.env.PACKAGE_SOURCE) {
    case 'repo': return new RepoPackageSource();
    case 'release': return new ReleasePackageSource();
    default: throw new Error(`Unrecognized package source: ${process.env.PACKAGE_SOURCE}`);
  }
}