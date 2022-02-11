import * as https from 'https';
import * as semver from 'semver';
import { print } from './logging';
import { versionNumber } from './version';

export async function displayNotices() {

  const dataSource = new WebsiteNoticeDataSource();
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


  if (notices.length > 0) {
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
      });
    });
  }
}

// TODO Caching can be implemented as a decorator around NoticeDataSource

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