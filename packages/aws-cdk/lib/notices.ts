import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { print, debug } from './logging';
import { cdkCacheDir } from './util/directories';
import { versionNumber } from './version';

export async function displayNotices() {
  const dataSource = new CachedDataSource(path.join(cdkCacheDir(), 'notices.json'), new WebsiteNoticeDataSource());
  const filter = new NoticeFilter({
    cliVersion: versionNumber(),
    temporarilySuppressed: false,
    permanentlySuppressed: false,
  });
  const formatter = new FooNoticeFormatter();

  const notices = await dataSource.fetch();
  const individualMessages = notices
    .filter(notice => filter.apply(notice))
    .map(notice => formatter.apply(notice));

  if (individualMessages.length > 0) {
    const finalMessage = `NOTICES
    
${individualMessages.join('\n\n')}

If you don’t want to see an notice anymore, use "cdk acknowledge <id>". For example, "cdk acknowledge ${notices[0].issueNumber}".`;

    print(finalMessage);
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

// TODO Caching can be implemented as a decorator around NoticeDataSource
export class CachedDataSource implements NoticeDataSource {
  constructor(
    private readonly fileName: string,
    private readonly dataSource: NoticeDataSource) {
  }

  async fetch(): Promise<Notice[]> {
    const cachedData = await this.loadCachedData();
    const notices = cachedData.notices;
    const expiration = cachedData.expiration ?? 0;

    if (Date.now() > expiration) {
      const freshData = {
        expiration: Date.now() + TIME_TO_LIVE,
        notices: await this.dataSource.fetch(),
      };
      await this.storeCachedData(freshData);
      return freshData.notices;
    } else {
      return notices;
    }
  }

  private async loadCachedData(): Promise<CachedNotices> {
    try {
      return await fs.readJSON(this.fileName) as CachedNotices;
    } catch (e) {
      debug(`Failed to load notices from cached: ${e}`);
      return {
        expiration: 0,
        notices: [],
      };
    }
  }

  private async storeCachedData(cached: CachedNotices): Promise<void> {
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
  acknowledgedIssueNumbers?: number[],
}

export class NoticeFilter {
  private readonly acknowledgedIssueNumbers: number[];

  constructor(private readonly props: NoticeFilterProps) {
    this.acknowledgedIssueNumbers = props.acknowledgedIssueNumbers ?? [];
  }

  apply(notice: Notice): boolean {
    if (this.props.permanentlySuppressed
      || this.props.temporarilySuppressed
      || this.acknowledgedIssueNumbers.includes(notice.issueNumber)) {
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
    let result = '';
    result += `${notice.issueNumber}\t${notice.title}\n\n`;
    result += `\tOverview: ${notice.overview}\n\n`;
    const componentsValue = notice.components.map(c => `${c.name}: ${c.version}`).join(', ');
    result += `\tAffected versions: ${componentsValue}\n\n`;
    result += `\tMore information at: https://github.com/aws/aws-cdk/issues/${notice.issueNumber}`;
    return result;
  }
}