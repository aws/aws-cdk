import { PropertyDifference } from '@aws-cdk/cloudformation-diff';
//import * as AWS from 'aws-sdk';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { /*ChangeHotswapImpact,*/ ChangeHotswapResult, HotswappableChangeCandidate, lowerCaseFirstCharacter, transformObjectKeys } from './common';

export async function isHotswappableAppSyncChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const isResolver = change.newValue.Type === 'AWS::AppSync::Resolver';
  const isFunction = change.newValue.Type === 'AWS::AppSync::FunctionConfiguration';

  if (!isResolver && !isFunction) {
    // This decider can't make decisions about this resource type
    return [];
  }

  const resourceProperties = change.newValue.Properties;
  if (isResolver && resourceProperties?.Kind === 'PIPELINE') {
    // Pipeline resolvers can't be hotswapped as they reference
    // the FunctionId of the underlying functions, which can't be resolved.
    return [{
      hotswappable: false,
      reason: 'PIPELINE bad',
      rejectedChanges: Object.keys(change.propertyUpdates),
      resourceType: change.newValue.Type,
    }];
  }

  const ret: ChangeHotswapResult = [];

  const { yes, no } = classifyChanges(change, ['RequestMappingTemplate', 'ResponseMappingTemplate']);

  const noKeys = Object.keys(no);
  if (noKeys.length > 0) {
    ret.push({
      hotswappable: false,
      reason: 'WTF IS THIS',
      rejectedChanges: noKeys,
      resourceType: change.newValue.Type,
    });
  }

  // Was there anything left we CAN actually do?
  const namesOfHotswappableChanges = Object.keys(yes);
  if (namesOfHotswappableChanges.length > 0) {
    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: namesOfHotswappableChanges,
      service: 'appsync',
      resourceNames: ['blah'], //TODO: this will probably have to be resovled during `apply()` somehow
      apply: async (sdk: ISDK) => {
        const resourcePhysicalName = await evaluateCfnTemplate.establishResourcePhysicalName(
          logicalId,
          isFunction ? resourceProperties?.Name : undefined,
        );
        if (!resourcePhysicalName) {
          return;
        }

        const sdkProperties: { [name: string]: any } = {
          ...change.oldValue.Properties,
          RequestMappingTemplate: change.newValue.Properties?.RequestMappingTemplate,
          ResponseMappingTemplate: change.newValue.Properties?.ResponseMappingTemplate,
        };
        const evaluatedResourceProperties = await evaluateCfnTemplate.evaluateCfnExpression(sdkProperties);
        const sdkRequestObject = transformObjectKeys(evaluatedResourceProperties, lowerCaseFirstCharacter);

        if (isResolver) {
          // Resolver physical name is the ARN in the format:
          // arn:aws:appsync:us-east-1:111111111111:apis/<apiId>/types/<type>/resolvers/<field>.
          // We'll use `<type>.<field>` as the resolver name.
          //const arnParts = resourcePhysicalName.split('/');
          //const resolverName = `${arnParts[3]}.${arnParts[5]}`; // TODO: resolver name

          // THIS CAN NEVER WORK
          await sdk.appsync().updateResolver(sdkRequestObject).promise();
        } else {
          // THIS IS WEIRD, DO WE EXPECT API-ID TO BE SET??
          const { functions } = await sdk.appsync().listFunctions({ apiId: sdkRequestObject.apiId }).promise();
          const { functionId } = functions?.find(fn => fn.name === resourcePhysicalName) ?? {};
          await sdk.appsync().updateFunction({
            ...sdkRequestObject,
            functionId: functionId!,
          }).promise();
        }
      },
    });
  }

  return ret;
}

type PropDiffs = Record<string, PropertyDifference<any>>;

function classifyChanges(xs: HotswappableChangeCandidate, hotswappableProps: string[]): {yes: PropDiffs, no: PropDiffs} {
  const yes: PropDiffs = {};
  const no: PropDiffs = {};

  for (const [name, propDiff] of Object.entries(xs.propertyUpdates)) {
    if (hotswappableProps.includes(name)) {
      yes[name] = propDiff;
    } else {
      no[name] = propDiff;
    }
  }

  return { yes, no };
}
