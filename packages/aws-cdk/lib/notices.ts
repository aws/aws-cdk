import { ClientRequest } from 'http';
import { RequestOptions } from 'https';
import * as https from 'node:https';
import * as path from 'path';
import type { Environment } from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { SdkHttpOptions } from './api';
import { AwsCliCompatible } from './api/aws-auth/awscli-compatible';
import { debug, print, warning, error } from './logging';
import { Context } from './settings';
import { ToolkitError } from './toolkit/error';
import { loadTreeFromDir, some } from './tree';
import { flatMap } from './util';
import { cdkCacheDir } from './util/directories';
import { versionNumber } from './version';

const CACHE_FILE_PATH = path.join(cdkCacheDir(), 'notices.json');

export interface NoticesProps {
  /**
   * CDK context
   */
  readonly context: Context;

  /**
   * Include notices that have already been acknowledged.
   *
   * @default false
   */
  readonly includeAcknowledged?: boolean;

  /**
   * Global CLI option for output directory for synthesized cloud assembly
   *
   * @default 'cdk.out'
   */
  readonly output?: string;

  /**
   * Global CLI option for whether we show notices
   *
   * @default true
   */
  readonly shouldDisplay?: boolean;

  /**
   * Options for the HTTP request
   */
  readonly httpOptions?: SdkHttpOptions;
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

export interface NoticesFilterFilterOptions {
  readonly data: Notice[];
  readonly cliVersion: string;
  readonly outDir: string;
  readonly bootstrappedEnvironments: BootstrappedEnvironment[];
}

export class NoticesFilter {
  public static filter(options: NoticesFilterFilterOptions): FilteredNotice[] {
    return [
      ...this.findForCliVersion(options.data, options.cliVersion),
      ...this.findForFrameworkVersion(options.data, options.outDir),
      ...this.findForBootstrapVersion(options.data, options.bootstrappedEnvironments),
    ];
  }

  private static findForCliVersion(data: Notice[], cliVersion: string): FilteredNotice[] {
    return flatMap(data, notice => {
      const affectedComponent = notice.components.find(component => component.name === 'cli');
      const affectedRange = affectedComponent?.version;

      if (affectedRange == null) {
        return [];
      }

      if (!semver.satisfies(cliVersion, affectedRange)) {
        return [];
      }

      return [new FilteredNotice(notice)];
    });

  }

  private static findForFrameworkVersion(data: Notice[], outDir: string): FilteredNotice[] {
    const tree = loadTreeFromDir(outDir);
    return flatMap(data, notice => {

      //  A match happens when:
      //
      //  1. The version of the node matches the version in the notice, interpreted
      //  as a semver range.
      //
      //  AND
      //
      //  2. The name in the notice is a prefix of the node name when the query ends in '.',
      //  or the two names are exactly the same, otherwise.

      const matched = some(tree, node => {
        return this.resolveAliases(notice.components).some(component =>
          compareNames(component.name, node.constructInfo?.fqn) &&
          compareVersions(component.version, node.constructInfo?.version));
      });

      if (!matched) {
        return [];
      }

      return [new FilteredNotice(notice)];

      function compareNames(pattern: string, target: string | undefined): boolean {
        if (target == null) { return false; }
        return pattern.endsWith('.') ? target.startsWith(pattern) : pattern === target;
      }

      function compareVersions(pattern: string, target: string | undefined): boolean {
        return semver.satisfies(target ?? '', pattern);
      }
    });
  }

  private static findForBootstrapVersion(data: Notice[], bootstrappedEnvironments: BootstrappedEnvironment[]): FilteredNotice[] {
    return flatMap(data, notice => {
      const affectedComponent = notice.components.find(component => component.name === 'bootstrap');
      const affectedRange = affectedComponent?.version;

      if (affectedRange == null) {
        return [];
      }

      const affected = bootstrappedEnvironments.filter(i => {

        const semverBootstrapVersion = semver.coerce(i.bootstrapStackVersion);
        if (!semverBootstrapVersion) {
          // we don't throw because notices should never crash the cli.
          warning(`While filtering notices, could not coerce bootstrap version '${i.bootstrapStackVersion}' into semver`);
          return false;
        }

        return semver.satisfies(semverBootstrapVersion, affectedRange);

      });

      if (affected.length === 0) {
        return [];
      }

      const filtered = new FilteredNotice(notice);
      filtered.addDynamicValue('ENVIRONMENTS', affected.map(s => s.environment.name).join(','));

      return [filtered];
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
 * Information about a bootstrapped environment.
 */
export interface BootstrappedEnvironment {
  readonly bootstrapStackVersion: number;
  readonly environment: Environment;
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

  private readonly context: Context;
  private readonly output: string;
  private readonly shouldDisplay: boolean;
  private readonly acknowledgedIssueNumbers: Set<Number>;
  private readonly includeAcknowlegded: boolean;
  private readonly httpOptions: SdkHttpOptions;

  private data: Set<Notice> = new Set();

  // sets don't deduplicate interfaces, so we use a map.
  private readonly bootstrappedEnvironments: Map<string, BootstrappedEnvironment> = new Map();

  private constructor(props: NoticesProps) {
    this.context = props.context;
    this.acknowledgedIssueNumbers = new Set(this.context.get('acknowledged-issue-numbers') ?? []);
    this.includeAcknowlegded = props.includeAcknowledged ?? false;
    this.output = props.output ?? 'cdk.out';
    this.shouldDisplay = props.shouldDisplay ?? true;
    this.httpOptions = props.httpOptions ?? {};
  }

  /**
   * Add a bootstrap information to filter on. Can have multiple values
   * in case of multi-environment deployments.
   */
  public addBootstrappedEnvironment(bootstrapped: BootstrappedEnvironment) {
    const key = [
      bootstrapped.bootstrapStackVersion,
      bootstrapped.environment.account,
      bootstrapped.environment.region,
      bootstrapped.environment.name,
    ].join(':');
    this.bootstrappedEnvironments.set(key, bootstrapped);
  }

  /**
   * Refresh the list of notices this instance is aware of.
   * To make sure this never crashes the CLI process, all failures are caught and
   * slitently logged.
   *
   * If context is configured to not display notices, this will no-op.
   */
  public async refresh(options: NoticesRefreshOptions = {}) {
    if (!this.shouldDisplay) {
      return;
    }

    try {
      const underlyingDataSource = options.dataSource ?? new WebsiteNoticeDataSource(this.httpOptions);
      const dataSource = new CachedDataSource(CACHE_FILE_PATH, underlyingDataSource, options.force ?? false);
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
    if (!this.shouldDisplay) {
      return;
    }

    const filteredNotices = NoticesFilter.filter({
      data: Array.from(this.data),
      cliVersion: versionNumber(),
      outDir: this.output,
      bootstrappedEnvironments: Array.from(this.bootstrappedEnvironments.values()),
    });

    if (filteredNotices.length > 0) {
      print('');
      print('NOTICES         (What\'s this? https://github.com/aws/aws-cdk/wiki/CLI-Notices)');
      print('');
      for (const filtered of filteredNotices) {
        const formatted = filtered.format();
        switch (filtered.notice.severity) {
          case 'warning':
            warning(formatted);
            break;
          case 'error':
            error(formatted);
            break;
          default:
            print(formatted);
        }
        print('');
      }
      print(`If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge ${filteredNotices[0].notice.issueNumber}".`);
    }

    if (options.showTotal ?? false) {
      print('');
      print(`There are ${filteredNotices.length} unacknowledged notice(s).`);
    }
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
  severity?: string;
}

/**
 * Notice after passing the filter. A filter can augment a notice with
 * dynamic values as it has access to the dynamic matching data.
 */
export class FilteredNotice {
  private readonly dynamicValues: { [key: string]: string } = {};

  public constructor(public readonly notice: Notice) {}

  public addDynamicValue(key: string, value: string) {
    this.dynamicValues[`{resolve:${key}}`] = value;
  }

  public format(): string {

    const componentsValue = this.notice.components.map(c => `${c.name}: ${c.version}`).join(', ');
    return this.resolveDynamicValues([
      `${this.notice.issueNumber}\t${this.notice.title}`,
      this.formatOverview(),
      `\tAffected versions: ${componentsValue}`,
      `\tMore information at: https://github.com/aws/aws-cdk/issues/${this.notice.issueNumber}`,
    ].join('\n\n') + '\n');
  }

  private formatOverview() {
    const wrap = (s: string) => s.replace(/(?![^\n]{1,60}$)([^\n]{1,60})\s/g, '$1\n');

    const heading = 'Overview: ';
    const separator = `\n\t${' '.repeat(heading.length)}`;
    const content = wrap(this.notice.overview)
      .split('\n')
      .join(separator);

    return '\t' + heading + content;
  }

  private resolveDynamicValues(input: string): string {
    const pattern = new RegExp(Object.keys(this.dynamicValues).join('|'), 'g');
    return input.replace(pattern, (matched) => this.dynamicValues[matched] ?? matched);
  }
}

export interface NoticeDataSource {
  fetch(): Promise<Notice[]>;
}

export class WebsiteNoticeDataSource implements NoticeDataSource {
  private readonly options: SdkHttpOptions;

  constructor(options: SdkHttpOptions = {}) {
    this.options = options;
  }

  fetch(): Promise<Notice[]> {
    const timeout = 3000;
    return new Promise((resolve, reject) => {
      let req: ClientRequest | undefined;

      let timer = setTimeout(() => {
        if (req) {
          req.destroy(new ToolkitError('Request timed out'));
        }
      }, timeout);

      timer.unref();

      const options: RequestOptions = {
        agent: AwsCliCompatible.proxyAgent(this.options),
      };

      try {
        req = https.get('https://cli.cdk.dev-tools.aws.dev/notices.json',
          options,
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
                    throw new ToolkitError("'notices' key is missing");
                  }
                  debug('Notices refreshed');
                  resolve(data ?? []);
                } catch (e: any) {
                  reject(new ToolkitError(`Failed to parse notices: ${e.message}`));
                }
              });
              res.on('error', e => {
                reject(new ToolkitError(`Failed to fetch notices: ${e.message}`));
              });
            } else {
              reject(new ToolkitError(`Failed to fetch notices. Status code: ${res.statusCode}`));
            }
          });
        req.on('error', reject);
      } catch (e: any) {
        reject(new ToolkitError(`HTTPS 'get' call threw an error: ${e.message}`));
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
