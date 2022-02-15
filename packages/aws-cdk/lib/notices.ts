import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { print, debug } from './logging';
import { cdkCacheDir } from './util/directories';
import { versionNumber } from './version';

const CACHE_FILE_PATH = path.join(cdkCacheDir(), 'notices.json');
const ACKNOWLEDGEMENTS_FILE_PATH = path.join(cdkCacheDir(), 'acks.json');

export async function suppressNotice(issueNumber: number) {
  await new Acknowledgements().addIssueNumber(issueNumber);
}

export interface DisplayNoticesOptions extends FilterOptions {
}

export interface FilterOptions {
  readonly temporarilySuppressed?: boolean;
  readonly permanentlySuppressed?: boolean;
  readonly cliVersion?: string;
  readonly acknowledgedIssueNumbers?: Set<number>;
}

export async function displayNotices(options: DisplayNoticesOptions = {}) {
  const dataSource = dataSourceReference();

  const notices = await dataSource.fetch();
  const individualMessages = formatNotices(filterNotices(notices, {
    temporarilySuppressed: options.temporarilySuppressed,
    permanentlySuppressed: options.permanentlySuppressed,
    acknowledgedIssueNumbers: options.acknowledgedIssueNumbers ?? await new Acknowledgements().getIssueNumbers(),
  }));

  if (individualMessages.length > 0) {
    print(finalMessage(individualMessages, notices[0].issueNumber));
  }
}

function dataSourceReference(): CachedDataSource {
  return new CachedDataSource(CACHE_FILE_PATH, new WebsiteNoticeDataSource());
}

function finalMessage(individualMessages: string[], exampleNumber: number): string {
  return [
    'NOTICES',
    ...individualMessages,
    `If you don’t want to see a notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge ${exampleNumber}".`,
  ].join('\n\n');
}

export function filterNotices(notices: Notice[], options: FilterOptions): Notice[] {
  const filter = new NoticeFilter({
    cliVersion: options.cliVersion ?? versionNumber(),
    temporarilySuppressed: options.temporarilySuppressed ?? false, // coming from a command line option
    permanentlySuppressed: options.permanentlySuppressed ?? false, // coming from the cdk.json file
    acknowledgedIssueNumbers: options.acknowledgedIssueNumbers ?? new Set(),
  });
  return notices.filter(notice => filter.apply(notice));
}

export function formatNotices(notices: Notice[]): string[] {
  const formatter = new FooNoticeFormatter();
  return notices.map(notice => formatter.apply(notice));
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
    return new Promise((resolve, reject) => {
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
              resolve(notices);
            } catch (e) {
              reject(e);
            }
          });
        }
        // Otherwise, we just ignore the result and move on
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
  acknowledgedIssueNumbers: Set<number>,
}

export class NoticeFilter {
  private readonly acknowledgedIssueNumbers: Set<number>;

  constructor(private readonly props: NoticeFilterProps) {
    this.acknowledgedIssueNumbers = props.acknowledgedIssueNumbers ?? new Set();
  }

  apply(notice: Notice): boolean {
    if (this.props.permanentlySuppressed
      || this.props.temporarilySuppressed
      || this.acknowledgedIssueNumbers.has(notice.issueNumber)) {
      return false;
    }

    const cliComponent = notice.components.find(component => component.name === 'cli');
    const affectedCliVersion = cliComponent?.version;
    return affectedCliVersion != null && semver.satisfies(this.props.cliVersion, affectedCliVersion);
  }
}

export interface NoticeFormatter {
  apply(notice: Notice): string,
}

// TODO rename this
export class FooNoticeFormatter implements NoticeFormatter {
  apply(notice: Notice): string {
    const componentsValue = notice.components.map(c => `${c.name}: ${c.version}`).join(', ');
    return [
      `${notice.issueNumber}\t${notice.title}`,
      `\tOverview: ${notice.overview}`,
      `\tAffected versions: ${componentsValue}`,
      `\tMore information at: https://github.com/aws/aws-cdk/issues/${notice.issueNumber}`,
    ].join('\n\n');
  }
}

interface CachedAcks {
  issueNumbers: number[];
}

export class Acknowledgements {
  private readonly fileName: string = ACKNOWLEDGEMENTS_FILE_PATH;

  async getIssueNumbers(): Promise<Set<number>> {
    const cachedData = await this.load();
    const issueNumbers = new Set<number>();
    cachedData.issueNumbers.forEach(i => issueNumbers.add(i));
    return issueNumbers;
  }

  async addIssueNumber(issueNumber: number) {
    const cachedData = await this.load();
    cachedData.issueNumbers.push(issueNumber);
    await this.save(cachedData);
  }

  private async load(): Promise<CachedAcks> {
    try {
      return await fs.readJSON(this.fileName) as CachedAcks;
    } catch (e) {
      debug(`Failed to load acknowledgements from cache: ${e}`);
      return {
        issueNumbers: [],
      };
    }
  }

  private async save(cached: CachedAcks): Promise<void> {
    try {
      await fs.writeJSON(this.fileName, cached);
    } catch (e) {
      debug(`Failed to store acknowledgements in the cache: ${e}`);
    }
  }
}