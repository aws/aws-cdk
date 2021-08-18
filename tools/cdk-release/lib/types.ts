export interface Lifecycles {
  bump?: string;
  changelog?: string;
  postchangelog?: string;
  commit?: string;

  // we don't actually do tagging at all, but still support passing it as an option,
  // for conformance with standard-version (CDK doesn't use its tagging capabilities anyway)
  tag?: string;
}

export type LifecyclesSkip = {
  [key in keyof Lifecycles]: boolean;
}

export interface Versions {
  stableVersion: string;
  alphaVersion?: string;
}

export type ReleaseType = 'major' | 'minor' | 'patch';

/* ****** main options ******** */

export interface ReleaseOptions {
  releaseAs: ReleaseType;
  skip?: LifecyclesSkip;
  versionFile: string;
  changelogFile: string;
  prerelease?: string;
  scripts?: Lifecycles;
  dryRun?: boolean;
  verbose?: boolean;
  silent?: boolean;
  sign?: boolean;
  stripExperimentalChanges?: boolean;

  changeLogHeader?: string;
  includeDateInChangelog?: boolean;
  releaseCommitMessageFormat?: string;
}
