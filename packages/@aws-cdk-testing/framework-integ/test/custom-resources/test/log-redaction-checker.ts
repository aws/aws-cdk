import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type * as logs from 'aws-cdk-lib/aws-logs';
import { Duration } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

export interface LogRedactionCheckerProps {
  /** The log groups to read, every event in each. */
  readonly logGroups: logs.ILogGroup[];
  /** A string that must appear in at least one event of each log group. */
  readonly marker: string;
  /** A value that must not appear in any event. */
  readonly secret: string;
}

/**
 * A function that reads every event in the given log groups and returns
 * `"<marker found in every group>/<secret absent everywhere>"`, for example
 * `"marker-found/no-secret"`. A single FilterLogEvents call can return an empty
 * page with a nextToken, so it pages to the end. Records in the JSON log format are
 * matched on their `message` field. A missing log group counts as
 * "no marker", so an assertion that retries keeps waiting for the logs.
 */
export function logRedactionChecker(scope: Construct, id: string, props: LogRedactionCheckerProps): lambda.Function {
  const checker = new lambda.Function(scope, id, {
    runtime: lambda.Runtime.NODEJS_22_X,
    handler: 'index.handler',
    timeout: Duration.minutes(1),
    environment: {
      LOG_GROUPS: JSON.stringify(props.logGroups.map(group => group.logGroupName)),
      MARKER: props.marker,
      SECRET: props.secret,
    },
    code: lambda.Code.fromInline(`
      const { CloudWatchLogsClient, FilterLogEventsCommand } = require('@aws-sdk/client-cloudwatch-logs');
      const client = new CloudWatchLogsClient({});
      exports.handler = async () => {
        let markerEverywhere = true;
        let secret = false;
        for (const logGroupName of JSON.parse(process.env.LOG_GROUPS)) {
          let marker = false;
          let nextToken;
          try {
            do {
              const page = await client.send(new FilterLogEventsCommand({ logGroupName, nextToken }));
              for (const event of page.events ?? []) {
                // with the JSON log format, the logged text is the record's message field
                let text = event.message;
                try { const record = JSON.parse(text); if (typeof record.message === 'string') { text = record.message; } } catch { }
                if (text.includes(process.env.MARKER)) { marker = true; }
                if (event.message.includes(process.env.SECRET) || text.includes(process.env.SECRET)) { secret = true; }
              }
              nextToken = page.nextToken;
            } while (nextToken);
          } catch (e) {
            if (e.name !== 'ResourceNotFoundException') { throw e; }
          }
          markerEverywhere = markerEverywhere && marker;
        }
        return (markerEverywhere ? 'marker-found' : 'marker-missing') + '/' + (secret ? 'secret-logged' : 'no-secret');
      };`),
  });
  checker.addToRolePolicy(new iam.PolicyStatement({
    actions: ['logs:FilterLogEvents'],
    resources: props.logGroups.map(group => group.logGroupArn),
  }));
  return checker;
}
