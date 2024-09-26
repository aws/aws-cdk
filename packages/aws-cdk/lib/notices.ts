import { ClientRequest } from 'http';
import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { debug, print } from './logging';
import { Configuration } from './settings';
import { ConstructTreeNode, loadTreeFromDir, some } from './tree';
import { flatMap } from './util';
import { cdkCacheDir } from './util/directories';
import { versionNumber } from './version';

const CACHE_FILE_PATH = path.join(cdkCacheDir(), 'notices.json');

export interface NoticesProps {
  /**
   * A `Configuration` instance holding CDK context and settings.
   */
  readonly configuration: Configuration;

  /**
   * Include notices that have already been acknowledged.
   *
   * @default false
   */
  readonly includeAcknowlegded?: boolean;

}

export interface NoticesPrintOptions {

  /**
   * Whether to append the total number of unacknowledged notices to the display.
   *
   * @default false
   */
  readonly showTotal?: boolean;

}

export interface NoticesRefreshOptions {
  /**
   * Whether to force a cache refresh regardless of expiration time.
   *
   * @default false
   */
  readonly force?: boolean;

  /**
   * Data source for fetch notices from.
   *
   * @default - CachedDataSource which fetches from our s3 bucket and populates a cache file.
   */
  readonly dataSource?: NoticeDataSource;
}

export class NoticesFormatter {

  public static format(notices: Notice[], showTotal?: boolean): string {

    let messageString: string = '';
    if (notices.length > 0) {
      messageString = [
        '\nNOTICES         (What\'s this? https://github.com/aws/aws-cdk/wiki/CLI-Notices)',
        ...notices.map(NoticesFormatter.formatBody),
        `If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge ${notices[0].issueNumber}".`,
      ].join('\n\n');
    }
    if (showTotal ?? false) {
      messageString = [messageString, `There are ${notices.length} unacknowledged notice(s).`].join('\n\n');
    }

    return messageString;

  }

  private static formatBody(notice: Notice): string {
    const componentsValue = notice.components.map(c => `${c.name}: ${c.version}`).join(', ');
    return [
      `${notice.issueNumber}\t${notice.title}`,
      NoticesFormatter.formatOverview(notice),
      `\tAffected versions: ${componentsValue}`,
      `\tMore information at: https://github.com/aws/aws-cdk/issues/${notice.issueNumber}`,
    ].join('\n\n') + '\n';
  }

  private static formatOverview(notice: Notice) {
    const wrap = (s: string) => s.replace(/(?![^\n]{1,60}$)([^\n]{1,60})\s/g, '$1\n');

    const heading = 'Overview: ';
    const separator = `\n\t${' '.repeat(heading.length)}`;
    const content = wrap(notice.overview)
      .split('\n')
      .join(separator);

    return '\t' + heading + content;
  }

}

export interface NoticesFilterFilterOptions {
  readonly data: Notice[];
  readonly cliVersion: string;
  readonly outDir: string;
  readonly bootstrapVersion?: number;
}

export class NoticesFilter {

  public static filter(options: NoticesFilterFilterOptions): Notice[] {
    return [
      ...this.findForCliVersion(options.data, options.cliVersion),
      ...this.findForFrameworkVersion(options.data, options.outDir),
      ...(options.bootstrapVersion ? this.findForBootstrapVersion(options.data, options.bootstrapVersion) : []),
    ];
  }

  private static findForCliVersion(data: Notice[], cliVersion: string): Notice[] {
    return data.filter(notice => {
      const affectedComponent = notice.components.find(component => component.name === 'cli');
      const affectedRange = affectedComponent?.version;
      return affectedRange != null && semver.satisfies(cliVersion, affectedRange);
    });

  }

  private static findForFrameworkVersion(data: Notice[], outDir: string): Notice[] {
    return data.filter(notice => {
      return match(resolveAliases(notice.components), loadTreeFromDir(outDir));
    });

  }

  private static findForBootstrapVersion(data: Notice[], bootstrapVersion: number): Notice[] {

    const semverBootstrapVersion = semver.coerce(bootstrapVersion);
    if (!semverBootstrapVersion) {
      throw new Error(`Cannot coerce bootstrap version '${bootstrapVersion}' into semver`);
    }

    return data.filter(notice => {

      const affectedComponent = notice.components.find(component => component.name === 'bootstrap');
      const affectedRange = affectedComponent?.version;
      return affectedRange != null && semver.satisfies(semverBootstrapVersion, affectedRange);
    });
  }

}

/**
 * Provides access to notices the CLI can display.
 */
export class Notices {

  /**
   * Create an instance. Note that this replaces the singleton.
   */
  public static create(props: NoticesProps): Notices {
    this._instance = new Notices(props);
    return this._instance;
  }

  /**
   * Get the singleton instance. Note this will throw if `create` was not called.
   */
  public static get(): Notices {
    if (!this._instance) {
      throw new Error('Notices have not been initialized. Call create.');
    }
    return this._instance;
  }

  private static _instance: Notices | undefined;

  private readonly configuration: Configuration;
  private readonly acknowledgedIssueNumbers: Set<Number>;
  private readonly includeAcknowlegded: boolean;

  private readonly data: Notice[] = [];
  private _bootstrapVersion?: number;

  private constructor(props: NoticesProps) {
    this.configuration = props.configuration;
    this.acknowledgedIssueNumbers = new Set(this.configuration.context.get('acknowledged-issue-numbers') ?? []);
    this.includeAcknowlegded = props.includeAcknowlegded ?? false;
  }

  public set bootstrapVersion(version: number) {
    if (this._bootstrapVersion && version != this._bootstrapVersion) {
      throw new Error('Cannot change bootstrap version once set');
    }
    this._bootstrapVersion = version;
  }

  /**
   * Refresh the list of notices this instance is aware of.
   */
  public async refresh(options: NoticesRefreshOptions = {}) {
    const dataSource = options.dataSource ?? new CachedDataSource(CACHE_FILE_PATH, new WebsiteNoticeDataSource(), options.force ?? false);
    const notices = await dataSource.fetch();
    this.data.push(...(this.includeAcknowlegded ? notices : notices.filter(n => !this.acknowledgedIssueNumbers.has(n.issueNumber))));
  }

  /**
   * Determine whether or not notices should be displayed based on the
   * configuration provided at instantiation time.
   */
  public shouldDisplay(): boolean {
    return this.configuration.settings.get(['notices']) ?? true;
  }

  /**
   * Display the relevant notices.
   */
  public display(options: NoticesPrintOptions = {}) {

    const notices = NoticesFilter.filter({
      data: this.data,
      cliVersion: versionNumber(),
      outDir: this.configuration.settings.get(['output']) ?? 'cdk.out',
      bootstrapVersion: this._bootstrapVersion,
    });

    print(NoticesFormatter.format(notices, options.showTotal));

  }

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
  fetch(): Promise<Notice[]>;
}

export class WebsiteNoticeDataSource implements NoticeDataSource {
  fetch(): Promise<Notice[]> {
    const timeout = 3000;
    return new Promise((resolve, reject) => {
      let req: ClientRequest | undefined;

      let timer = setTimeout(() => {
        if (req) {
          req.destroy(new Error('Request timed out'));
        }
      }, timeout);

      timer.unref();

      try {
        req = https.get('https://cli.cdk.dev-tools.aws.dev/notices.json',
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
                } catch (e: any) {
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
      } catch (e: any) {
        reject(new Error(`HTTPS 'get' call threw an error: ${e.message}`));
      }
    });
  }
}

interface CachedNotices {
  expiration: number;
  notices: Notice[];
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
