import { ClientRequest } from 'http';
import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { debug, print, warning } from './logging';
import { Configuration } from './settings';
import { loadTreeFromDir, some } from './tree';
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
   * @default - WebsiteNoticeDataSource
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
  readonly bootstrapVersions: number[];
}

export class NoticesFilter {

  public static filter(options: NoticesFilterFilterOptions): Notice[] {
    return [
      ...this.findForCliVersion(options.data, options.cliVersion),
      ...this.findForFrameworkVersion(options.data, options.outDir),
      ...this.findForBootstrapVersion(options.data, options.bootstrapVersions),
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
    const tree = loadTreeFromDir(outDir);
    return data.filter(notice => {

      //  A match happens when:
      //
      //  1. The version of the node matches the version in the notice, interpreted
      //  as a semver range.
      //
      //  AND
      //
      //  2. The name in the notice is a prefix of the node name when the query ends in '.',
      //  or the two names are exactly the same, otherwise.

      return some(tree, node => {
        return this.resolveAliases(notice.components).some(component =>
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

    });

  }

  private static findForBootstrapVersion(data: Notice[], bootstrapVersions: number[]): Notice[] {
    return data.filter(notice => {
      const affectedComponent = notice.components.find(component => component.name === 'bootstrap');
      const affectedRange = affectedComponent?.version;
      return affectedRange != null && bootstrapVersions.some(v => {

        const semverBootstrapVersion = semver.coerce(v);
        if (!semverBootstrapVersion) {
          // we don't throw because notices should never crash the cli.
          warning(`While filtering notices, could not coerce bootstrap version '${v}' into semver`);
          return false;
        }

        return semver.satisfies(semverBootstrapVersion, affectedRange);

      });
    });
  }

  private static resolveAliases(components: Component[]): Component[] {
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
   * Get the singleton instance. May return `undefined` if `create` has not been called.
   */
  public static get(): Notices | undefined {
    return this._instance;
  }

  private static _instance: Notices | undefined;

  private readonly configuration: Configuration;
  private readonly acknowledgedIssueNumbers: Set<Number>;
  private readonly includeAcknowlegded: boolean;

  private data: Set<Notice> = new Set();
  private readonly bootstrapVersions: number[] = [];

  private constructor(props: NoticesProps) {
    this.configuration = props.configuration;
    this.acknowledgedIssueNumbers = new Set(this.configuration.context.get('acknowledged-issue-numbers') ?? []);
    this.includeAcknowlegded = props.includeAcknowlegded ?? false;
  }

  /**
   * Add a bootstrap version to filter on. Can have multiple values
   * in case of multi-environment deployments.
   */
  public addBootstrapVersion(version: number) {
    this.bootstrapVersions.push(version);
  }

  /**
   * Refresh the list of notices this instance is aware of.
   * To make sure this never crashes the CLI process, all failures are caught and
   * slitently logged.
   *
   * If context is configured to not display notices, this will no-op.
   */
  public async refresh(options: NoticesRefreshOptions = {}) {

    if (!this.shouldDisplay()) {
      return;
    }

    try {
      const dataSource = new CachedDataSource(CACHE_FILE_PATH, options.dataSource ?? new WebsiteNoticeDataSource(), options.force ?? false);
      const notices = await dataSource.fetch();
      this.data = new Set(this.includeAcknowlegded ? notices : notices.filter(n => !this.acknowledgedIssueNumbers.has(n.issueNumber)));
    } catch (e: any) {
      debug(`Could not refresh notices: ${e}`);
    }
  }

  /**
   * Display the relevant notices (unless context dictates we shouldn't).
   */
  public display(options: NoticesPrintOptions = {}) {

    if (!this.shouldDisplay()) {
      return;
    }

    const notices = NoticesFilter.filter({
      data: Array.from(this.data),
      cliVersion: versionNumber(),
      outDir: this.configuration.settings.get(['output']) ?? 'cdk.out',
      bootstrapVersions: this.bootstrapVersions,
    });

    print(NoticesFormatter.format(notices, options.showTotal));

  }

  /**
   * Determine whether or not notices should be displayed based on the
   * configuration provided at instantiation time.
   */
  private shouldDisplay(): boolean {
    return this.configuration.settings.get(['notices']) ?? true;
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
