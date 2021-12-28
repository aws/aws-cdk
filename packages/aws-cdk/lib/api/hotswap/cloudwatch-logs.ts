import { ListStackResources } from './common';
import { EvaluateCloudFormationTemplate } from './evaluate-cloudformation-template';
import { CloudWatchLogEventMonitor } from './monitor/logs-monitor';

export async function findCloudWatchLogGroups(
  listStackResources: ListStackResources,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
  hotswapLogMonitor: CloudWatchLogEventMonitor,
): Promise<void> {

  const resources = await listStackResources.listStackResources();
  const allGroups = resources.filter(resource => resource.ResourceType === 'AWS::Logs::LogGroup');
  const functions = resources.filter(resource => resource.ResourceType === 'AWS::Lambda::Function');
  const functionLogGroups = await Promise.all(functions.map(async f => {
    const name = await evaluateCfnTemplate.findPhysicalNameFor(f.LogicalResourceId);
    return `/aws/lambda/${name}`;
  }));

  hotswapLogMonitor.addLogGroups(functionLogGroups);

  const relevantGroups = allGroups.filter(group => {
    const resourcesReferencingLogGroup = evaluateCfnTemplate.findReferencesTo(group.LogicalResourceId);
    if (resourcesReferencingLogGroup.some(r => (r.Type === 'AWS::ECS::TaskDefinition' || r.Type === 'AWS::StepFunctions::StateMachine'))) {
      return true;
    }
    return false;
  });

  for (let group of relevantGroups) {
    const groupName = await evaluateCfnTemplate.findPhysicalNameFor(group.LogicalResourceId);
    if (groupName) {
      hotswapLogMonitor.addLogGroups([groupName]);
    }
  }
}
