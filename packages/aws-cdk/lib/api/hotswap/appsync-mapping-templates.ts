//import * as AWS from 'aws-sdk';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapResult, classifyChanges, HotswappableChangeCandidate, lowerCaseFirstCharacter, transformObjectKeys } from './common';

export async function isHotswappableAppSyncChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const isResolver = change.newValue.Type === 'AWS::AppSync::Resolver';
  const isFunction = change.newValue.Type === 'AWS::AppSync::FunctionConfiguration';

  if (!isResolver && !isFunction) {
    // This decider can't make decisions about this resource type
    return [];
  }

  if (isResolver && change.newValue.Properties?.Kind === 'PIPELINE') {
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
    let _physicalName: string | undefined = undefined;
    const physicalNameLazy = async () => {
      if (!_physicalName) {
        _physicalName = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, isFunction ? change.newValue.Properties?.Name : undefined);
      }
      return _physicalName;
    };
    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: namesOfHotswappableChanges,
      service: 'appsync',
      resourceNames: [`${change.newValue.Type} '${await physicalNameLazy()}'`],
      apply: async (sdk: ISDK) => {
        const physicalName = await physicalNameLazy();
        if (!physicalName) {
          return;
        }

        const sdkProperties: { [name: string]: any } = {
          // TODO: add strict SDK typing to this, so we don't have to do the stupid "oldProperties" thing;
          // instead, supply only the required props for the call.
          // see codebuild for example
        //const sdkProperties: AWS.AppSync.UpdateFunctionRequest | AWS.AppSync.UpdateResolverRequest = {
          ...change.oldValue.Properties,
          requestMappingTemplate: change.newValue.Properties?.RequestMappingTemplate,
          responseMappingTemplate: change.newValue.Properties?.ResponseMappingTemplate,
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
          const { functionId } = functions?.find(fn => fn.name === physicalName) ?? {};
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
