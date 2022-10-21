import { Token } from '@aws-cdk/core';


/**
  * Verifies if application or the visited node is region agnostic.
  *
  * @param applicationRegion Region of the application.
  * @param nodeRegion Region of the visited node.
  */
export function isRegionUnresolved(applicationRegion: string, nodeRegion: string): boolean {
  return Token.isUnresolved(applicationRegion) || Token.isUnresolved(nodeRegion);
}

/**
  * Verifies if application or the visited node is account agnostic.
  *
  * @param applicationAccount Account of the application.
  * @param nodeAccount Account of the visited node.
  */
export function isAccountUnresolved(applicationAccount: string, nodeAccount: string): boolean {
  return Token.isUnresolved(applicationAccount) || Token.isUnresolved(nodeAccount);
}