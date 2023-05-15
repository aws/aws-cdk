/**
 * This function compares the logging configuration from oldProps and newProps and returns
 * the result that contains LogSetup with enabled:false if any.
 *
 * @param oldProps old properties
 * @param newProps new properties
 * @returns result with LogSet with enabled:false if any
 */

export function compareLoggingProps(oldProps: Partial<AWS.EKS.CreateClusterRequest>,
  newProps: Partial<AWS.EKS.CreateClusterRequest>): Partial<AWS.EKS.CreateClusterRequest> {
  const result: Partial<AWS.EKS.CreateClusterRequest> = { logging: {} };
  let enabledTypes: AWS.EKS.LogType[] = [];
  let disabledTypes: AWS.EKS.LogType[] = [];

  if (newProps.logging?.clusterLogging === undefined && oldProps.logging?.clusterLogging === undefined) {
    return newProps;
  }
  // if newProps containes LogSetup
  if (newProps.logging && newProps.logging.clusterLogging && newProps.logging.clusterLogging.length > 0) {
    enabledTypes = newProps.logging.clusterLogging[0].types!;
    // if oldProps contains LogSetup with enabled:true
    if (oldProps.logging && oldProps.logging.clusterLogging && oldProps.logging.clusterLogging.length > 0) {
      // LogType in oldProp but not in newProp should be considered disabled(enabled:false)
      disabledTypes = oldProps.logging!.clusterLogging![0].types!.filter(t => !newProps.logging!.clusterLogging![0].types!.includes(t));
    }
  } else {
    // all enabled:true in oldProps will be enabled:false
    disabledTypes = oldProps.logging!.clusterLogging![0].types!;
  }

  if (enabledTypes.length > 0 || disabledTypes.length > 0) {
    result.logging = { clusterLogging: [] };
  }

  // append the enabled:false LogSetup to the result
  if (enabledTypes.length > 0) {
    result.logging!.clusterLogging!.push({ types: enabledTypes, enabled: true });
  }
  // append the enabled:false LogSetup to the result
  if (disabledTypes.length > 0) {
    result.logging!.clusterLogging!.push({ types: disabledTypes, enabled: false });
  }
  return result;
}
