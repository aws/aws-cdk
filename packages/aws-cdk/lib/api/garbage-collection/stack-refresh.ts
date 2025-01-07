import { ParameterDeclaration } from '@aws-sdk/client-cloudformation';
import { debug } from '../../logging';
import { ToolkitError } from '../../toolkit/error';
import { ICloudFormationClient } from '../aws-auth';

export class ActiveAssetCache {
  private readonly stacks: Set<string> = new Set();

  public rememberStack(stackTemplate: string) {
    this.stacks.add(stackTemplate);
  }

  public contains(asset: string): boolean {
    for (const stack of this.stacks) {
      if (stack.includes(asset)) {
        return true;
      }
    }
    return false;
  }
}

async function paginateSdkCall(cb: (nextToken?: string) => Promise<string | undefined>) {
  let finished = false;
  let nextToken: string | undefined;
  while (!finished) {
    nextToken = await cb(nextToken);
    if (nextToken === undefined) {
      finished = true;
    }
  }
}

/**
 * Fetches all relevant stack templates from CloudFormation. It ignores the following stacks:
 * - stacks in DELETE_COMPLETE or DELETE_IN_PROGRESS stage
 * - stacks that are using a different bootstrap qualifier
 */
async function fetchAllStackTemplates(cfn: ICloudFormationClient, qualifier?: string) {
  const stackNames: string[] = [];
  await paginateSdkCall(async (nextToken) => {
    const stacks = await cfn.listStacks({ NextToken: nextToken });

    // We ignore stacks with these statuses because their assets are no longer live
    const ignoredStatues = ['CREATE_FAILED', 'DELETE_COMPLETE', 'DELETE_IN_PROGRESS', 'DELETE_FAILED', 'REVIEW_IN_PROGRESS'];
    stackNames.push(
      ...(stacks.StackSummaries ?? [])
        .filter((s: any) => !ignoredStatues.includes(s.StackStatus))
        .map((s: any) => s.StackId ?? s.StackName),
    );

    return stacks.NextToken;
  });

  debug(`Parsing through ${stackNames.length} stacks`);

  const templates: string[] = [];
  for (const stack of stackNames) {
    let summary;
    summary = await cfn.getTemplateSummary({
      StackName: stack,
    });

    if (bootstrapFilter(summary.Parameters, qualifier)) {
      // This stack is definitely bootstrapped to a different qualifier so we can safely ignore it
      continue;
    } else {
      const template = await cfn.getTemplate({
        StackName: stack,
      });

      templates.push((template.TemplateBody ?? '') + JSON.stringify(summary?.Parameters));
    }
  }

  debug('Done parsing through stacks');

  return templates;
}

/**
 * Filter out stacks that we KNOW are using a different bootstrap qualifier
 * This is mostly necessary for the integration tests that can run the same app (with the same assets)
 * under different qualifiers.
 * This is necessary because a stack under a different bootstrap could coincidentally reference the same hash
 * and cause a false negative (cause an asset to be preserved when its isolated)
 * This is intentionally done in a way where we ONLY filter out stacks that are meant for a different qualifier
 * because we are okay with false positives.
 */
function bootstrapFilter(parameters?: ParameterDeclaration[], qualifier?: string) {
  const bootstrapVersion = parameters?.find((p) => p.ParameterKey === 'BootstrapVersion');
  const splitBootstrapVersion = bootstrapVersion?.DefaultValue?.split('/');
  // We find the qualifier in a specific part of the bootstrap version parameter
  return (qualifier &&
          splitBootstrapVersion &&
          splitBootstrapVersion.length == 4 &&
          splitBootstrapVersion[2] != qualifier);
}

export async function refreshStacks(cfn: ICloudFormationClient, activeAssets: ActiveAssetCache, qualifier?: string) {
  try {
    const stacks = await fetchAllStackTemplates(cfn, qualifier);
    for (const stack of stacks) {
      activeAssets.rememberStack(stack);
    }
  } catch (err) {
    throw new ToolkitError(`Error refreshing stacks: ${err}`);
  }
}

/**
 * Background Stack Refresh properties
 */
export interface BackgroundStackRefreshProps {
  /**
   * The CFN SDK handler
   */
  readonly cfn: ICloudFormationClient;

  /**
   * Active Asset storage
   */
  readonly activeAssets: ActiveAssetCache;

  /**
   * Stack bootstrap qualifier
   */
  readonly qualifier?: string;
}

/**
 * Class that controls scheduling of the background stack refresh
 */
export class BackgroundStackRefresh {
  private timeout?: NodeJS.Timeout;
  private lastRefreshTime: number;
  private queuedPromises: Array<(value: unknown) => void> = [];

  constructor(private readonly props: BackgroundStackRefreshProps) {
    this.lastRefreshTime = Date.now();
  }

  public start() {
    // Since start is going to be called right after the first invocation of refreshStacks,
    // lets wait some time before beginning the background refresh.
    this.timeout = setTimeout(() => this.refresh(), 300_000); // 5 minutes
  }

  private async refresh() {
    const startTime = Date.now();

    await refreshStacks(this.props.cfn, this.props.activeAssets, this.props.qualifier);
    this.justRefreshedStacks();

    // If the last invocation of refreshStacks takes <5 minutes, the next invocation starts 5 minutes after the last one started.
    // If the last invocation of refreshStacks takes >5 minutes, the next invocation starts immediately.
    this.timeout = setTimeout(() => this.refresh(), Math.max(startTime + 300_000 - Date.now(), 0));
  }

  private justRefreshedStacks() {
    this.lastRefreshTime = Date.now();
    for (const p of this.queuedPromises.splice(0, this.queuedPromises.length)) {
      p(undefined);
    }
  }

  /**
   * Checks if the last successful background refresh happened within the specified time frame.
   * If the last refresh is older than the specified time frame, it returns a Promise that resolves
   * when the next background refresh completes or rejects if the refresh takes too long.
   */
  public noOlderThan(ms: number) {
    const horizon = Date.now() - ms;

    // The last refresh happened within the time frame
    if (this.lastRefreshTime >= horizon) {
      return Promise.resolve();
    }

    // The last refresh happened earlier than the time frame
    // We will wait for the latest refresh to land or reject if it takes too long
    return Promise.race([
      new Promise(resolve => this.queuedPromises.push(resolve)),
      new Promise((_, reject) => setTimeout(() => reject(new ToolkitError('refreshStacks took too long; the background thread likely threw an error')), ms)),
    ]);
  }

  public stop() {
    clearTimeout(this.timeout);
  }
}
