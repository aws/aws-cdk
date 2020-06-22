/**
 * EKS cluster control plane logging configuration
 */
export interface ControlPlaneLogging {
  readonly api?: boolean;
  readonly audit?: boolean;
  readonly authenticator?: boolean;
  readonly controllerManager?: boolean;
  readonly scheduler?: boolean;
}

/**
 * The available cluster control plane log types.
 */
export type LogKind = keyof ControlPlaneLogging;
