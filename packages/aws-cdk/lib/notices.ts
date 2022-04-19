import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { debug, print, trace } from './logging';
import { flatMap } from './util';
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
   * Whether cached notices should be ignored. Setting this property
   * to true will force the CLI to download fresh data
   *
   * @default false
   */
  readonly ignoreCache?: boolean;
}

export async function refreshNotices() {
  const dataSource = dataSourceReference(false);
  return dataSource.fetch();
}

export async function displayNotices(props: DisplayNoticesProps) {
  const dataSource = dataSourceReference(props.ignoreCache ?? false);
  print(await generateMessage(dataSource, props));
  return 0;
}

export async function generateMessage(dataSource: NoticeDataSource, props: DisplayNoticesProps) {
  const data = await dataSource.fetch();
  const filteredNotices = filterNotices(data, {
    outdir: props.outdir,
    acknowledgedIssueNumbers: new Set(props.acknowledgedIssueNumbers),
  });

  if (filteredNotices.length > 0) {
    const individualMessages = formatNotices(filteredNotices);
    return finalMessage(individualMessages, filteredNotices[0].issueNumber);
  }
  return '';
}

function dataSourceReference(ignoreCache: boolean): NoticeDataSource {
  return new CachedDataSource(CACHE_FILE_PATH, new WebsiteNoticeDataSource(), ignoreCache);
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
  cliVersion?: string,
  frameworkVersion?: string,
  acknowledgedIssueNumbers?: Set<number>,
}

export function filterNotices(data: Notice[], options: FilterNoticeOptions): Notice[] {
  const filter = new NoticeFilter({
    cliVersion: options.cliVersion ?? versionNumber(),
    acknowledgedIssueNumbers: options.acknowledgedIssueNumbers ?? new Set(),
    tree: loadTree(options.outdir ?? 'cdk.out').tree,
  });
  return data.filter(notice => filter.apply(notice));
}

export function formatNotices(data: Notice[]): string[] {
  return data.map(formatNotice);
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
    const timeout = 3000;
    return new Promise((resolve, reject) => {
      try {
        const req = https.get('https://cli.cdk.dev-tools.aws.dev/notices.json',
          { timeout },
          res => {
            if (res.statusCode === 200) {
              res.setEncoding('utf8');
              let rawData = '';
              res.on('data', (chunk) => {
                rawData += chunk;
              });
              res.on('end', () => {
                try {
                  const data = JSON.parse(rawData).notices as Notice[];
                  if (!data) {
                    throw new Error("'notices' key is missing");
                  }
                  debug('Notices refreshed');
                  resolve(data ?? []);
                } catch (e) {
                  reject(new Error(`Failed to parse notices: ${e.message}`));
                }
              });
              res.on('error', e => {
                reject(new Error(`Failed to fetch notices: ${e.message}`));
              });
            } else {
              reject(new Error(`Failed to fetch notices. Status code: ${res.statusCode}`));
            }
          });
        req.on('error', reject);
        req.on('timeout', () => {
          // The 'timeout' event doesn't stop anything by itself, it just
          // notifies that it has been long time since we saw bytes.
          // In our case, we want to give up.
          req.destroy(new Error('Request timed out'));
        });

        // It's not like I don't *trust* the 'timeout' event... but I don't trust it.
        // Add a backup timer that will destroy the request after all.
        // (This is at least necessary to make the tests pass, but that's probably because of 'nock'.
        // It's not clear whether users will hit this).
        setTimeout(() => {
          req.destroy(new Error('Request timed out. You should never see this message; if you do, please let us know at https://github.com/aws/aws-cdk/issues'));
        }, timeout + 200);
      } catch (e) {
        reject(new Error(`HTTPS 'get' call threw an error: ${e.message}`));
      }
    });
  }
}

interface CachedNotices {
  expiration: number,
  notices: Notice[],
}

const TIME_TO_LIVE_SUCCESS = 60 * 60 * 1000; // 1 hour
const TIME_TO_LIVE_ERROR = 1 * 60 * 1000; // 1 minute

export class CachedDataSource implements NoticeDataSource {
  constructor(
    private readonly fileName: string,
    private readonly dataSource: NoticeDataSource,
    private readonly skipCache?: boolean) {
  }

  async fetch(): Promise<Notice[]> {
    const cachedData = await this.load();
    const data = cachedData.notices;
    const expiration = cachedData.expiration ?? 0;

    if (Date.now() > expiration || this.skipCache) {
      const freshData = await this.fetchInner();
      await this.save(freshData);
      return freshData.notices;
    } else {
      debug(`Reading cached notices from ${this.fileName}`);
      return data;
    }
  }

  private async fetchInner(): Promise<CachedNotices> {
    try {
      return {
        expiration: Date.now() + TIME_TO_LIVE_SUCCESS,
        notices: await this.dataSource.fetch(),
      };
    } catch (e) {
      debug(`Could not refresh notices: ${e}`);
      return {
        expiration: Date.now() + TIME_TO_LIVE_ERROR,
        notices: [],
      };
    }
  }

  private async load(): Promise<CachedNotices> {
    const defaultValue = {
      expiration: 0,
      notices: [],
    };

    try {
      return fs.existsSync(this.fileName)
        ? await fs.readJSON(this.fileName) as CachedNotices
        : defaultValue;
    } catch (e) {
      debug(`Failed to load notices from cache: ${e}`);
      return defaultValue;
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
  cliVersion: string,
  acknowledgedIssueNumbers: Set<number>,
  tree: ConstructTreeNode,
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
    if (this.acknowledgedIssueNumbers.has(notice.issueNumber)) {
      return false;
    }

    return this.applyVersion(notice, 'cli', this.props.cliVersion) ||
      match(resolveAliases(notice.components), this.props.tree);
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

/**
 * Some component names are aliases to actual component names. For example "framework"
 * is an alias for either the core library (v1) or the whole CDK library (v2).
 *
 * This function converts all aliases to their actual counterpart names, to be used to
 * match against the construct tree.
 *
 * @param components a list of components. Components whose name is an alias will be
 * transformed and all others will be left intact.
 */
function resolveAliases(components: Component[]): Component[] {
  return flatMap(components, component => {
    if (component.name === 'framework') {
      return [{
        name: '@aws-cdk/core.',
        version: component.version,
      }, {
        name: 'aws-cdk-lib.',
        version: component.version,
      }];
    } else {
      return [component];
    }
  });
}

function formatNotice(notice: Notice): string {
  const componentsValue = notice.components.map(c => `${c.name}: ${c.version}`).join(', ');
  return [
    `${notice.issueNumber}\t${notice.title}`,
    formatOverview(notice.overview),
    `\tAffected versions: ${componentsValue}`,
    `\tMore information at: https://github.com/aws/aws-cdk/issues/${notice.issueNumber}`,
  ].join('\n\n') + '\n';
}

function formatOverview(text: string) {
  const wrap = (s: string) => s.replace(/(?![^\n]{1,60}$)([^\n]{1,60})\s/g, '$1\n');

  const heading = 'Overview: ';
  const separator = `\n\t${' '.repeat(heading.length)}`;
  const content = wrap(text)
    .split('\n')
    .join(separator);

  return '\t' + heading + content;
}

/**
 * Whether any component in the tree matches any component in the query.
 * A match happens when:
 *
 * 1. The version of the node matches the version in the query, interpreted
 * as a semver range.
 *
 * 2. The name in the query is a prefix of the node name when the query ends in '.',
 * or the two names are exactly the same, otherwise.
 */
function match(query: Component[], tree: ConstructTreeNode): boolean {
  return some(tree, node => {
    return query.some(component =>
      compareNames(component.name, node.constructInfo?.fqn) &&
      compareVersions(component.version, node.constructInfo?.version));
  });

  function compareNames(pattern: string, target: string | undefined): boolean {
    if (target == null) { return false; }
    return pattern.endsWith('.') ? target.startsWith(pattern) : pattern === target;
  }

  function compareVersions(pattern: string, target: string | undefined): boolean {
    return semver.satisfies(target ?? '', pattern);
  }
}

function loadTree(outdir: string) {
  try {
    return fs.readJSONSync(path.join(outdir, 'tree.json'));
  } catch (e) {
    trace(`Failed to get tree.json file: ${e}. Proceeding with empty tree.`);
    return {};
  }
}

/**
 * Source information on a construct (class fqn and version)
 */
interface ConstructInfo {
  readonly fqn: string;
  readonly version: string;
}

/**
 * A node in the construct tree.
 * @internal
 */
interface ConstructTreeNode {
  readonly id: string;
  readonly path: string;
  readonly children?: { [key: string]: ConstructTreeNode };
  readonly attributes?: { [key: string]: any };

  /**
   * Information on the construct class that led to this node, if available
   */
  readonly constructInfo?: ConstructInfo;
}

function some(node: ConstructTreeNode, predicate: (n: ConstructTreeNode) => boolean): boolean {
  return node != null && (predicate(node) || findInChildren());

  function findInChildren(): boolean {
    if (node.children == null) { return false; }

    for (const name in node.children) {
      if (some(node.children[name], predicate)) {
        return true;
      }
    }
    return false;
  }
}
