export enum LifecycleLabel {
  ON_DEMAND = 'OnDemand',
  SPOT = 'Ec2Spot',
}

export function spotInterruptHandler() {
  return {
        chart: 'aws-node-termination-handler',
        repository: 'https://aws.github.io/eks-charts',
        namespace: 'kube-system',
        values: {
          'nodeSelector.lifecycle': LifecycleLabel.SPOT
        }
  };
}