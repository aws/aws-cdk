import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { print, debug } from './logging';
import { cdkCacheDir } from './util/directories';
import { versionNumber } from './version';

const CACHE_FILE_PATH = path.join(cdkCacheDir(), 'notices.json');

export interface DisplayNoticesProps {
  /**
   * The cloud assembly directory. Usually 'cdk.out'.
   */
  readonly outdir: string;

  /**
   * Issue numbers of notices that have been acknowledged by a user
   * of the current CDK repository. These notices will be skipped.
   */
  readonly acknowledgedIssueNumbers: number[];

  /**
   * Setting that comes from the command-line option.
   * For example, `cdk synth --no-notices`.
   */
  readonly temporarilySuppressed?: boolean;

  /**
   * Setting that comes from cdk.json. For example,
   *
   * "context": {
   *   "notices": false
   * }
   */
  readonly permanentlySuppressed?: boolean;
}

export async function displayNotices(props: DisplayNoticesProps) {
  const dataSource = dataSourceReference();
  await generateMessage(dataSource, props, print);
}

export async function generateMessage(dataSource: NoticeDataSource, props: DisplayNoticesProps, cb: (msg: string) => void) {
  const notices = await dataSource.fetch();
  const individualMessages = formatNotices(filterNotices(notices, {
    outdir: props.outdir,
    temporarilySuppressed: props.temporarilySuppressed,
    permanentlySuppressed: props.permanentlySuppressed,
    acknowledgedIssueNumbers: new Set(props.acknowledgedIssueNumbers),
  }));

  if (individualMessages.length > 0) {
    cb(finalMessage(individualMessages, notices[0].issueNumber));
  }
}

function dataSourceReference(): CachedDataSource {
  return new CachedDataSource(CACHE_FILE_PATH, new WebsiteNoticeDataSource());
}

function finalMessage(individualMessages: string[], exampleNumber: number): string {
  return [
    '\nNOTICES',
    ...individualMessages,
    `If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge ${exampleNumber}".`,
  ].join('\n\n');
}

export interface FilterNoticeOptions {
  outdir?: string,
  permanentlySuppressed?: boolean,
  temporarilySuppressed?: boolean,
  cliVersion?: string,
  frameworkVersion?: string,
  acknowledgedIssueNumbers?: Set<number>,
}

export function filterNotices(notices: Notice[], options: FilterNoticeOptions): Notice[] {
  const filter = new NoticeFilter({
    cliVersion: options.cliVersion ?? versionNumber(),
    frameworkVersion: options.frameworkVersion ?? frameworkVersion(options.outdir ?? 'cdk.out'),
    temporarilySuppressed: options.temporarilySuppressed ?? false,
    permanentlySuppressed: options.permanentlySuppressed ?? false,
    acknowledgedIssueNumbers: options.acknowledgedIssueNumbers ?? new Set(),
  });
  return notices.filter(notice => filter.apply(notice));
}

export function formatNotices(notices: Notice[]): string[] {
  return notices.map(formatNotice);
}

export interface Component {
  name: string;
  version: string;
}

export interface Notice {
  title: string;
  issueNumber: number;
  overview: string;
  components: Component[];
  schemaVersion: string;
}

export interface NoticeDataSource {
  fetch(): Promise<Notice[]>,
}

export class WebsiteNoticeDataSource implements NoticeDataSource {
  fetch(): Promise<Notice[]> {
    return new Promise((resolve) => {
      https.get('https://cli.cdk.dev-tools.aws.dev/notices.json', res => {
        if (res.statusCode === 200) {
          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });
          res.on('end', () => {
            try {
              const notices = JSON.parse(rawData).notices as Notice[];
              resolve(notices ?? []);
            } catch (e) {
              debug(`Failed to parse notices: ${e}`);
              resolve([]);
            }
          });
          res.on('error', e => {
            debug(`Failed to fetch notices: ${e}`);
            resolve([]);
          });
        } else {
          debug(`Failed to fetch notices. Status code: ${res.statusCode}`);
          resolve([]);
        }
      });
    });
  }
}

interface CachedNotices {
  expiration: number,
  notices: Notice[],
}

const TIME_TO_LIVE = 60 * 60 * 1000; // 1 hour

export class CachedDataSource implements NoticeDataSource {
  constructor(
    private readonly fileName: string,
    private readonly dataSource: NoticeDataSource) {
  }

  async fetch(): Promise<Notice[]> {
    const cachedData = await this.load();
    const notices = cachedData.notices;
    const expiration = cachedData.expiration ?? 0;

    if (Date.now() > expiration) {
      const freshData = {
        expiration: Date.now() + TIME_TO_LIVE,
        notices: await this.dataSource.fetch(),
      };
      await this.save(freshData);
      return freshData.notices;
    } else {
      return notices;
    }
  }

  private async load(): Promise<CachedNotices> {
    try {
      return await fs.readJSON(this.fileName) as CachedNotices;
    } catch (e) {
      debug(`Failed to load notices from cache: ${e}`);
      return {
        expiration: 0,
        notices: [],
      };
    }
  }

  private async save(cached: CachedNotices): Promise<void> {
    try {
      await fs.writeJSON(this.fileName, cached);
    } catch (e) {
      debug(`Failed to store notices in the cache: ${e}`);
    }
  }
}

export interface NoticeFilterProps {
  permanentlySuppressed: boolean,
  temporarilySuppressed: boolean,
  cliVersion: string,
  frameworkVersion: string | undefined,
  acknowledgedIssueNumbers: Set<number>,
}

export class NoticeFilter {
  private readonly acknowledgedIssueNumbers: Set<number>;

  constructor(private readonly props: NoticeFilterProps) {
    this.acknowledgedIssueNumbers = props.acknowledgedIssueNumbers;
  }

  /**
   * Returns true iff we should show this notice.
   */
  apply(notice: Notice): boolean {
    if (this.props.permanentlySuppressed
      || this.props.temporarilySuppressed
      || this.acknowledgedIssueNumbers.has(notice.issueNumber)) {
      return false;
    }
    return this.applyVersion(notice, 'cli', this.props.cliVersion) ||
      this.applyVersion(notice, 'framework', this.props.frameworkVersion);
  }

  /**
   * Returns true iff we should show the notice.
   */
  private applyVersion(notice: Notice, name: string, compareToVersion: string | undefined) {
    if (compareToVersion === undefined) { return false; }

    const affectedComponent = notice.components.find(component => component.name === name);
    const affectedRange = affectedComponent?.version;
    return affectedRange != null && semver.satisfies(compareToVersion, affectedRange);
  }
}

function formatNotice(notice: Notice): string {
  const componentsValue = notice.components.map(c => `${c.name}: ${c.version}`).join(', ');
  return [
    `${notice.issueNumber}\t${notice.title}`,
    `\tOverview: ${notice.overview}`,
    `\tAffected versions: ${componentsValue}`,
    `\tMore information at: https://github.com/aws/aws-cdk/issues/${notice.issueNumber}`,
  ].join('\n\n');
}

function frameworkVersion(outdir: string): string | undefined {
  const tree = loadTree().tree;

  if (tree?.constructInfo?.fqn.startsWith('aws-cdk-lib')
    || tree?.constructInfo?.fqn.startsWith('@aws-cdk/core')) {
    return tree.constructInfo.version;
  }
  return undefined;

  function loadTree() {
    try {
      return fs.readJSONSync(path.join(outdir, 'tree.json'));
    } catch (e) {
      debug(`Failed to get tree.json file: ${e}`);
      return {};
    }
  }
}