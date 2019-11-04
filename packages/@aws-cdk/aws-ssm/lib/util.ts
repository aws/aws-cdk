import { CfnCondition, Construct, Fn, IConstruct, Stack, Token } from "@aws-cdk/core";

/**
 * Renders an ARN for an SSM parameter given a parameter name.
 * @param scope definition scope
 * @param parameterName the parameter name to include in the ARN
 * @param physicalName optional physical name specified by the user (to auto-detect separator)
 */
export function arnForParameterName(scope: IConstruct, parameterName: string, physicalName?: string): string {
  const { sep, resourceName } = determineSepAndResourceName();

  validateParameterName(physicalName || parameterName);

  return Stack.of(scope).formatArn({
    service: 'ssm',
    resource: 'parameter',
    sep,
    resourceName,
  });

  function validateParameterName(concreteName: string) {
    // can't validate tokens
    if (Token.isUnresolved(concreteName)) {
      return;
    }

    if (concreteName.includes('/') && !concreteName.startsWith('/')) {
      throw new Error(`Parameter names must be fully qualified (if they include "/" they must also begin with a "/"): ${concreteName}`);
    }
  }

  function determineSepAndResourceName() {
    // if the parameter name is a token
    if (Token.isUnresolved(parameterName)) {

      // if we have a concrete physical name, we can use it to determine the separator
      if (physicalName && !Token.isUnresolved(physicalName)) {
        return {
          sep: physicalName.startsWith('/') ? '' : '/',
          resourceName: parameterName
        };
      }

      // parameterName is a token and physical name is not helping us (either missing or a token itself)
      // in this use case we will need to synthesize a CloudFormation condition that will be used to determine
      // if the name has a "/" prefix or not.
      const startsWithSlash = startsWithCondition(scope as Construct, parameterName, "/");
      return {
        sep: '',
        resourceName: Token.asString(Fn.conditionIf(startsWithSlash.logicalId, parameterName, `/${parameterName}`))
      };
    }

    // parameterName is concrete, use it to determine the token
    return {
      sep: parameterName.startsWith('/') ? '' : '/',
      resourceName: parameterName
    };
  }
}

/**
 * Gets or creates a CloudFormation condition that evaluates to "TRUE" if `parameterName` (treated as an opaque token)
 * starts with a "/".
 */
function startsWithCondition(scope: Construct, value: string, startsWith: string) {
  const id = `AWS::CDK::StartsWith(${startsWith})`;
  return scope.node.tryFindChild(id) as CfnCondition || new CfnCondition(scope, id, {
    expression: Fn.conditionEquals(Fn.select(0, Fn.split(startsWith, value)), "")
  });
}