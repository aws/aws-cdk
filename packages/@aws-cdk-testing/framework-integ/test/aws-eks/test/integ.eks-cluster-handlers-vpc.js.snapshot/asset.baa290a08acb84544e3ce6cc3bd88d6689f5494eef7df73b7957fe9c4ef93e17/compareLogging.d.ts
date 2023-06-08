/**
 * This function compares the logging configuration from oldProps and newProps and returns
 * the result that contains LogSetup with enabled:false if any.
 *
 * @param oldProps old properties
 * @param newProps new properties
 * @returns result with LogSet with enabled:false if any
 */
export declare function compareLoggingProps(oldProps: Partial<AWS.EKS.CreateClusterRequest>, newProps: Partial<AWS.EKS.CreateClusterRequest>): Partial<AWS.EKS.CreateClusterRequest>;
