import * as stream from 'stream';
import * as fs from 'fs-extra';
import { ConventionalCommit, filterCommits } from '../conventional-commits';
import { writeFile } from '../private/files';
import { notify, debug } from '../private/print';
import { ExperimentalChangesTreatment, LifecyclesSkip, PackageInfo, Versions } from '../types';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const conventionalChangelogPresetLoader = require('conventional-changelog-preset-loader');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const conventionalChangelogWriter = require('conventional-changelog-writer');

const START_OF_LAST_RELEASE_PATTERN = /(^#+ \[?[0-9]+\.[0-9]+\.[0-9]+|<a name=)/m;

export interface WriteChangelogOptions extends ChangelogOptions {
  skip?: LifecyclesSkip;
  alphaChangelogFile?: string;
  experimentalChangesTreatment?: ExperimentalChangesTreatment;

  currentVersion: Versions;
  newVersion: Versions;
  commits: ConventionalCommit[];
  packages: PackageInfo[];
}

export interface ChangelogOptions {
  changelogFile: string;
  dryRun?: boolean;
  verbose?: boolean;
  silent?: boolean;

  changeLogHeader?: string;
  includeDateInChangelog?: boolean;
}

export interface ChangelogResult {
  readonly filePath: string;
  readonly fileContents: string;
}

export async function writeChangelogs(opts: WriteChangelogOptions): Promise<ChangelogResult[]> {
  if (opts.skip?.changelog) {
    return [];
  }

  const experimentalChangesTreatment = opts.experimentalChangesTreatment ?? ExperimentalChangesTreatment.INCLUDE;
  const alphaPackages = opts.packages.filter(p => p.alpha);
  const stableCommits = filterCommits(opts.commits, { excludePackages: alphaPackages.map(p => p.name) });

  switch (experimentalChangesTreatment) {
    case ExperimentalChangesTreatment.INCLUDE:
      const allContents = await changelog(opts, opts.currentVersion.stableVersion, opts.newVersion.stableVersion, opts.commits);
      return [{ filePath: opts.changelogFile, fileContents: allContents }];

    case ExperimentalChangesTreatment.STRIP:
      const strippedContents = await changelog(opts, opts.currentVersion.stableVersion, opts.newVersion.stableVersion, stableCommits);
      return [{ filePath: opts.changelogFile, fileContents: strippedContents }];

    case ExperimentalChangesTreatment.SEPARATE:
      if (!opts.currentVersion.alphaVersion || !opts.newVersion.alphaVersion) {
        throw new Error('unable to create separate alpha Changelog without alpha package versions');
      }
      if (!opts.alphaChangelogFile) {
        throw new Error('alphaChangelogFile must be specified if experimentalChangesTreatment is SEPARATE');
      }

      const changelogResults: ChangelogResult[] = [];
      const contents = await changelog(opts, opts.currentVersion.stableVersion, opts.newVersion.stableVersion, stableCommits);
      changelogResults.push({ filePath: opts.changelogFile, fileContents: contents });

      const alphaCommits = filterCommits(opts.commits, { includePackages: alphaPackages.map(p => p.name) });
      const alphaContents = await changelog(
        { ...opts, changelogFile: opts.alphaChangelogFile },
        opts.currentVersion.alphaVersion, opts.newVersion.alphaVersion, alphaCommits);
      changelogResults.push({ filePath: opts.alphaChangelogFile, fileContents: alphaContents });

      return changelogResults;

    default:
      throw new Error(`unsupported experimentalChanges type: ${opts.experimentalChangesTreatment}`);
  }
}

export async function changelog(
  args: ChangelogOptions, currentVersion: string, newVersion: string, commits: ConventionalCommit[],
): Promise<string> {

  createChangelogIfMissing(args);

  // find the position of the last release and remove header
  let oldContent = args.dryRun ? '' : fs.readFileSync(args.changelogFile, 'utf-8');
  const oldContentStart = oldContent.search(START_OF_LAST_RELEASE_PATTERN);
  if (oldContentStart !== -1) {
    oldContent = oldContent.substring(oldContentStart);
  }

  // load the default configuration that we use for the Changelog generation
  const presetConfig = await conventionalChangelogPresetLoader({
    name: 'conventional-changelog-conventionalcommits',
  });

  return new Promise((resolve, reject) => {
    // convert an array of commits into a Stream,
    // which conventionalChangelogWriter expects
    const commitsStream = new stream.Stream.Readable({
      objectMode: true,
    });
    commits.forEach(commit => commitsStream.push(commit));
    // mark the end of the stream
    commitsStream.push(null);

    const host = 'https://github.com', owner = 'aws', repository = 'aws-cdk';
    const context = {
      issue: 'issues',
      commit: 'commit',
      version: newVersion,
      host,
      owner,
      repository,
      repoUrl: `${host}/${owner}/${repository}`,
      linkCompare: true,
      previousTag: `v${currentVersion}`,
      currentTag: `v${newVersion}`,
      // when isPatch is 'true', the default template used for the header renders an H3 instead of an H2
      // (see: https://github.com/conventional-changelog/conventional-changelog/blob/f1f50f56626099e92efe31d2f8c5477abd90f1b7/packages/conventional-changelog-conventionalcommits/templates/header.hbs#L1-L5)
      isPatch: false,
    };
    // invoke the conventionalChangelogWriter package that will perform the actual Changelog rendering
    const changelogStream = commitsStream
      .pipe(conventionalChangelogWriter(context,
        {
          // CDK uses the settings from 'conventional-changelog-conventionalcommits'
          // (by way of 'standard-version'),
          // which are different than the 'conventionalChangelogWriter' defaults
          ...presetConfig.writerOpts,
          finalizeContext: (ctx: { noteGroups?: { title: string }[], date?: string }) => {
            // the heading of the "BREAKING CHANGES" section is governed by this Handlebars template:
            // https://github.com/conventional-changelog/conventional-changelog/blob/f1f50f56626099e92efe31d2f8c5477abd90f1b7/packages/conventional-changelog-conventionalcommits/templates/template.hbs#L3-L12
            // to change the heading from 'BREAKING CHANGES' to 'BREAKING CHANGES TO EXPERIMENTAL FEATURES',
            // we have to change the title of the 'BREAKING CHANGES' noteGroup
            ctx.noteGroups?.forEach(noteGroup => {
              if (noteGroup.title === 'BREAKING CHANGES') {
                noteGroup.title = 'BREAKING CHANGES TO EXPERIMENTAL FEATURES';
              }
            });
            // in unit tests, we don't want to have the date in the Changelog
            if (args.includeDateInChangelog === false) {
              ctx.date = undefined;
            }
            return ctx;
          },
        }));

    changelogStream.on('error', function (err: any) {
      reject(err);
    });
    let content = '';
    changelogStream.on('data', function (buffer: any) {
      content += buffer.toString();
    });
    changelogStream.on('end', function () {
      notify(args, 'outputting changes to %s', [args.changelogFile]);
      if (args.dryRun) {
        debug(args, `\n---\n${content.trim()}\n---\n`);
      } else {
        writeFile(args, args.changelogFile, args.changeLogHeader + '\n' + (content + oldContent).replace(/\n+$/, '\n'));
      }
      return resolve(content);
    });
  });
}

function createChangelogIfMissing(args: ChangelogOptions) {
  if (!fs.existsSync(args.changelogFile)) {
    notify(args, 'created %s', [args.changelogFile]);
    writeFile(args, args.changelogFile, '\n');
  }
}
