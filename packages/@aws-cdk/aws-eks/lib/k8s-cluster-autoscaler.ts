import autoscaling = require('@aws-cdk/aws-autoscaling');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Cluster } from './cluster';
import { KubernetesResource } from './k8s-resource';

/**
 * The properties for the Cluster Autoscaler.
 */
export interface KubernetesClusterAutoscalerProps {

  /**
   * The EKS cluster to deploy the cluster autoscaler to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

  /**
   * An array of Autoscaling Groups, known as node groups, to configure for autoscaling.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly nodeGroups: autoscaling.AutoScalingGroup[];

  /**
   * The version of the Cluster Autoscaler to deploy.
   *
   * @default - the default version is v1.14.6
   */
  readonly version?: string;

}

/**
 * The Cluster Autoscaler Construct. This will create a new IAM Policy, add labels to the ASGs, and
 * deploy the Cluster Autoscaler manifest.
 */
export class KubernetesClusterAutoscaler extends cdk.Construct {

  /**
   *  The cluster this autoscaler is assosciated with
   *
   * [disable-awslint:ref-via-interface]
   */
  public readonly cluster: Cluster;

  /**
   *  The IAM policy created by this construct.
   */
  public readonly policy: iam.IPolicy;

  /**
   * Constructs a new instance of the Cluster Autoscaler.
   *
   * @param scope cdk.Construct
   * @param id string
   * @param props ClusterAutoscalerProps
   */
  constructor(scope: cdk.Construct, id: string, props: KubernetesClusterAutoscalerProps) {
    super(scope, id);

    this.cluster = props.cluster;

    const clusterName = props.cluster.clusterName;
    const version = props.version === undefined ? 'v1.14.6' : props.version;

    // define the cluster autoscaler policy statements
    // https://docs.aws.amazon.com/en_pv/eks/latest/userguide/cluster-autoscaler.html#ca-create-ngs
    const policyStatement = new iam.PolicyStatement();
    policyStatement.addResources('*');
    policyStatement.addActions(
      'autoscaling:DescribeAutoScalingGroups',
      'autoscaling:DescribeAutoScalingInstances',
      'autoscaling:DescribeLaunchConfigurations',
      'autoscaling:DescribeTags',
      'autoscaling:SetDesiredCapacity',
      'autoscaling:TerminateInstanceInAutoScalingGroup',
      'ec2:DescribeLaunchTemplateVersions'
    );

    // create the policy based on the statements
    const policy = this.policy = new iam.Policy(this, 'cluster-autoscaler-policy', {
      policyName: 'ClusterAutoscalerPolicy',
      statements: [ policyStatement ]
    });

    // loop through all of the node groups and attach the policy
    props.nodeGroups.forEach(element => {
      cdk.Tag.add(element, 'k8s.io/cluster-autoscaler/' + clusterName, 'owned', { applyToLaunchedInstances: true });
      cdk.Tag.add(element, 'k8s.io/cluster-autoscaler/enabled', 'true', { applyToLaunchedInstances: true });
      policy.attachToRole(element.role);
    });

    const metadata = {
      name: 'cluster-autoscaler',
      namespace: 'kube-system',
      labels: {
        'k8s-addon': 'cluster-autoscaler.addons.k8s.io',
        'k8s-app': 'cluster-autoscaler'
      }
    };

    // define the Kubernetes Cluster Autoscaler manifests the manifest is referenced in the aws
    // documentation which is linked below. this manifest automates the manual steps outlined
    // in the documentation
    // https://docs.aws.amazon.com/en_pv/eks/latest/userguide/cluster-autoscaler.html
    new KubernetesResource(this, 'k8s-cluster-autoscaler-manifest', {
      cluster: props.cluster,
      manifest: [
        {
          apiVersion: 'v1',
          kind: 'ServiceAccount',
          metadata
        },
        {
          apiVersion: 'rbac.authorization.k8s.io/v1',
          kind: 'ClusterRole',
          metadata,
          rules: [
            {
              apiGroups: [''],
              resources: ['events', 'endpoints'],
              verbs: ['create', 'patch']
            },
            {
              apiGroups: [''],
              resources: ['pods/eviction'],
              verbs: ['create']
            },
            {
              apiGroups: [''],
              resources: ['pods/status'],
              verbs: ['update']
            },
            {
              apiGroups: [''],
              resources: ['endpoints'],
              resourceNames: [metadata.name],
              verbs: ['get', 'update']
            },
            {
              apiGroups: [''],
              resources: ['nodes'],
              verbs: ['watch', 'list', 'get', 'update']
            },
            {
              apiGroups: [''],
              resources: ['pods', 'services', 'replicationcontrollers', 'persistentvolumeclaims', 'persistentvolumes' ],
              verbs: ['watch', 'list', 'get']
            },
            {
              apiGroups: ['extensions'],
              resources: ['replicasets', 'daemonsets'],
              verbs: ['watch', 'list', 'get']
            },
            {
              apiGroups: ['policy'],
              resources: ['poddisruptionbudgets'],
              verbs: ['watch', 'list']
            },
            {
              apiGroups: ['apps'],
              resources: ['statefulsets', 'replicasets', 'daemonsets'],
              verbs: ['watch', 'list', 'get']
            },
            {
              apiGroups: ['storage.k8s.io'],
              resources: ['storageclasses', 'csinodes'],
              verbs: ['watch', 'list', 'get']
            },
            {
              apiGroups: ['batch', 'extensions'],
              resources: ['jobs'],
              verbs: ['get', 'list', 'watch', 'patch']
            }
          ]
        },
        {
          apiVersion: 'rbac.authorization.k8s.io/v1',
          kind: 'Role',
          metadata,
          rules: [
            {
              apiGroups: [''],
              resources: ['configmaps'],
              verbs: ['create', 'list', 'watch']
            },
            {
              apiGroups: [''],
              resources: ['configmaps'],
              resourceNames: ['cluster-autoscaler-status', 'cluster-autoscaler-priority-expander'],
              verbs: ['delete', 'get', 'update', 'watch']
            }
          ]
        },
        {
          apiVersion: 'rbac.authorization.k8s.io/v1',
          kind: 'ClusterRoleBinding',
          metadata,
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'ClusterRole',
            name: metadata.name
          },
          subjects: [
            {
              kind: 'ServiceAccount',
              name: metadata.name,
              namespace: metadata.namespace
            }
          ]
        },
        {
          apiVersion: 'rbac.authorization.k8s.io/v1',
          kind: 'RoleBinding',
          metadata,
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: metadata.name
          },
          subjects: [
            {
              kind: 'ServiceAccount',
              name: metadata.name,
              namespace: metadata.namespace
            }
          ]
        },
        {
          apiVersion: 'rbac.authorization.k8s.io/v1',
          kind: 'RoleBinding',
          metadata,
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: metadata.name
          },
          subjects: [
            {
              kind: 'ServiceAccount',
              name: metadata.name,
              namespace: metadata.namespace
            }
          ]
        },
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: metadata.name,
            namespace: metadata.namespace,
            labels: {
              app: metadata.name
            },
            annotations: {
              'cluster-autoscaler.kubernetes.io/safe-to-evict': 'false'
            }
          },
          spec: {
            replicas: 1,
            selector: {
              matchLabels: {
                app: metadata.name
              }
            },
            template: {
              metadata: {
                labels: {
                  app: metadata.name
                },
                annotations: {
                  'prometheus.io/scrape': 'true',
                  'prometheus.io/port': '8085'
                }
              },
              spec: {
                serviceAccountName: metadata.name,
                containers: [
                   {
                      image: 'k8s.gcr.io/cluster-autoscaler:' + version,
                      name: metadata.name,
                      resources: {
                         limits: {
                            cpu: '100m',
                            memory: '300Mi'
                         },
                         requests: {
                            cpu: '100m',
                            memory: '300Mi'
                         }
                      },
                      command: [
                        './cluster-autoscaler',
                        '--v=4',
                        '--stderrthreshold=info',
                        '--cloud-provider=aws',
                        '--skip-nodes-with-local-storage=false',
                        '--expander=least-waste',
                        '--node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/' + clusterName,
                        '--balance-similar-node-groups',
                        '--skip-nodes-with-system-pods=false'
                      ],
                      volumeMounts: [
                         {
                            name: 'ssl-certs',
                            mountPath: '/etc/ssl/certs/ca-certificates.crt',
                            readOnly: true
                         }
                      ],
                      imagePullPolicy: 'Always'
                   }
                ],
                volumes: [
                   {
                    name: 'ssl-certs',
                    hostPath: {
                      path: '/etc/ssl/certs/ca-bundle.crt'
                    }
                   }
                ]
             }
            }
          }
        }
      ]
    });

  }
}
