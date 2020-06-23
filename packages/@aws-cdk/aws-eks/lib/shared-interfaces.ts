/**
 * EKS cluster control plane logging configuration
 */
export interface ControlPlaneLogging {
  /**
   * Kubernetes API server component logs – Your cluster's API server is the
   * control plane component that exposes the Kubernetes API.
   *
   * @see https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/
   */
  readonly api?: boolean;

  /**
   * Audit (audit) – Kubernetes audit logs provide a record of the individual
   * users, administrators, or system components that have affected your cluster.
   *
   * @see https://kubernetes.io/docs/tasks/debug-application-cluster/audit/
   */
  readonly audit?: boolean;

  /**
   * Authenticator – Authenticator logs are unique to Amazon EKS. These logs
   * represent the control plane component that Amazon EKS uses for Kubernetes
   * Role Based Access Control (RBAC) authentication using IAM credentials.
   *
   * @see https://kubernetes.io/docs/admin/authorization/rbac/
   */
  readonly authenticator?: boolean;

  /**
   * Controller manager – The controller manager manages the core control
   * loops that are shipped with Kubernetes.
   *
   * @see https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/
   */
  readonly controllerManager?: boolean;

  /**
   * Scheduler – The scheduler component manages when and where to run
   * pods in your cluster.
   *
   * @see https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/
   */
  readonly scheduler?: boolean;
}
