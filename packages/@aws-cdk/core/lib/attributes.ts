import * as cfn_parse from '@aws-cdk/core/lib/cfn-parse';
import { ICfnResourceOptions, ICfnFinder, CfnResource } from './'

export abstract class Attributes {
  public static handleAttributes(resource: CfnResource, cfnOptions: ICfnResourceOptions, cfnParser: cfn_parse.CfnParser, resourceAttributes: any,
    logicalId: string, finder: ICfnFinder): void {

    cfnOptions.creationPolicy = cfnParser.parseCreationPolicy(resourceAttributes.CreationPolicy);
    cfnOptions.updatePolicy = cfnParser.parseUpdatePolicy(resourceAttributes.UpdatePolicy);
    cfnOptions.deletionPolicy = cfnParser.parseDeletionPolicy(resourceAttributes.DeletionPolicy);
    cfnOptions.updateReplacePolicy = cfnParser.parseDeletionPolicy(resourceAttributes.UpdateReplacePolicy);
    cfnOptions.metadata = cfnParser.parseValue(resourceAttributes.Metadata)

    // handle DependsOn
    resourceAttributes.DependsOn = resourceAttributes.DependsOn ?? [];
    const dependencies: string[] = Array.isArray(resourceAttributes.DependsOn) ?
      resourceAttributes.DependsOn : [resourceAttributes.DependsOn];
    for (const dep of dependencies) {
      const depResource = finder.findResource(dep);
      if (!depResource) {
        throw new Error(`resource '${logicalId}' depends on '${dep}' that doesn't exist`);
      }
      resource.node.addDependency(depResource);
    }
    // handle Condition
    if (resourceAttributes.Condition) {
      const condition = finder.findCondition(resourceAttributes.Condition);
      if (!condition) {
        throw new Error(`resource '${logicalId}' uses Condition '${resourceAttributes.Condition}' that doesn't exist`);
      }
      cfnOptions.condition = condition;
    }
  }
}