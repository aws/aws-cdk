import { IConstruct, Stack, Token } from "@aws-cdk/core";

export interface ArnForParameterNameOptions {
  readonly physicalName?: string;
  readonly parameterArnSeparator?: string;
}

/**
 * Renders an ARN for an SSM parameter given a parameter name.
 * @param scope definition scope
 * @param parameterName the parameter name to include in the ARN
 * @param physicalName optional physical name specified by the user (to auto-detect separator)
 */
export function arnForParameterName(scope: IConstruct, parameterName: string, options: ArnForParameterNameOptions = { }): string {
  const physicalName = options.physicalName;
  const nameToValidate = physicalName || parameterName;

  // validate "parameterArnSeparator" (if defined).
  if (options.parameterArnSeparator !== undefined) {
    if (options.parameterArnSeparator !== '/' && options.parameterArnSeparator !== '') {
      throw new Error(`parameterArnSeparator must be either "/" or "". got "${options.parameterArnSeparator}"`);
    }
  }

  if (!Token.isUnresolved(nameToValidate) && nameToValidate.includes('/') && !nameToValidate.startsWith('/')) {
    throw new Error(`Parameter names must be fully qualified (if they include "/" they must also begin with a "/"): ${nameToValidate}`);
  }

  return Stack.of(scope).formatArn({
    service: 'ssm',
    resource: 'parameter',
    sep: determineSeperator(),
    resourceName: parameterName,
  });

  /**
   * Determines the ARN separator for this parameter: if we have a concrete
   * parameter name (or explicitly defined physical name), we will parse them
   * and decide whether a "/" is needed or not. Otherwise, users will have to
   * explicitly specify `parameterArnSeparator` when they import the ARN.
   */
  function determineSeperator() {
    // look for a concrete name as a hint for determining the separator
    const concreteName = !Token.isUnresolved(parameterName) ? parameterName : physicalName;
    if (!concreteName || Token.isUnresolved(concreteName)) {

      if (options.parameterArnSeparator === undefined) {
        throw new Error(`Unable to determine ARN separator for SSM parameter since the parameter name is an unresolved token. Use "fromAttributes" and specify "parameterArnSeparator" explicitly`);
      }

      return options.parameterArnSeparator;
    }

    const calculatedSep = concreteName.startsWith('/') ? '' : '/';

    // if users explicitly specify the separator and it conflicts with the one we need, it's an error.
    if (options.parameterArnSeparator !== undefined && options.parameterArnSeparator !== calculatedSep) {
      throw new Error(`parameterArnSeparator "${options.parameterArnSeparator}" is invalid for SSM parameter with name "${concreteName}". It should be "${calculatedSep}"`);
    }

    return calculatedSep;
  }
}
