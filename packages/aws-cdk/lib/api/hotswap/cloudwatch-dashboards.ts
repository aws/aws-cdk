import { ISDK } from '../aws-auth';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate, establishResourcePhysicalName } from './common';
import { EvaluateCloudFormationTemplate } from './evaluate-cloudformation-template';

export async function isHotswappableDashboardChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const dashboardBodyChange = await isDashboardBodyOnlyChange(change, evaluateCfnTemplate);
  if (dashboardBodyChange === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT ||
      dashboardBodyChange === ChangeHotswapImpact.IRRELEVANT) {
    return dashboardBodyChange;
  }

  const dashboardNameInCfnTemplate = change.newValue?.Properties?.DashboardName;
  const dashboardName = await establishResourcePhysicalName(logicalId, dashboardNameInCfnTemplate, evaluateCfnTemplate);
  if (!dashboardName) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  return new DashboardHotswapOperation({
    body: dashboardBodyChange,
    dashboardName: dashboardName,
  });
}

async function isDashboardBodyOnlyChange(
  change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<string | ChangeHotswapImpact> {
  const newResourceType = change.newValue.Type;
  if (newResourceType !== 'AWS::CloudWatch::Dashboard') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const propertyUpdates = change.propertyUpdates;
  for (const updatedPropName in propertyUpdates) {
    // ensure that only changes to the DashboardBody result in a hotswap
    if (updatedPropName !== 'DashboardBody') {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  return evaluateCfnTemplate.evaluateCfnExpression(propertyUpdates.DashboardBody.newValue);
}

interface DashboardResource {
  readonly dashboardName: string;
  readonly body: string;
}

class DashboardHotswapOperation implements HotswapOperation {
  constructor(private readonly dashboardResource: DashboardResource) {
  }

  public async apply(sdk: ISDK): Promise<any> {
    return sdk.cloudWatch().putDashboard({
      DashboardName: this.dashboardResource.dashboardName,
      DashboardBody: this.dashboardResource.body,
    }).promise();
  }
}
