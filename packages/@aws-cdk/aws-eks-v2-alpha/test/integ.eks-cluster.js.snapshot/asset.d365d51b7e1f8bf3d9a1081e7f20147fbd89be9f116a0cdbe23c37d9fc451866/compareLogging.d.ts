/**
 * This function compares the logging configuration from oldProps and newProps and returns
 * the result that contains LogSetup with enabled:false if any.
 *
 * @param oldProps old properties
 * @param newProps new properties
 * @returns result with LogSet with enabled:false if any
 */
import * as EKS from '@aws-sdk/client-eks';
export declare function compareLoggingProps(oldProps: Partial<EKS.CreateClusterCommandInput>, newProps: Partial<EKS.CreateClusterCommandInput>): Partial<EKS.CreateClusterCommandInput>;
