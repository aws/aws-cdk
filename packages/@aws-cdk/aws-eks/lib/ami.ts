import ec2 = require('@aws-cdk/aws-ec2');

/**
 * Properties for EksOptimizedAmi
 */
export interface EksOptimizedAmiProps {
  /**
   * What instance type to retrieve the image for (normal or GPU-optimized)
   *
   * @default Normal
   */
  readonly nodeType?: NodeType;

  /**
   * The Kubernetes version to use
   *
   * @default The latest version
   */
  readonly kubernetesVersion?: string;
}

/**
 * Source for EKS optimized AMIs
 */
export class EksOptimizedAmi extends ec2.GenericLinuxImage implements ec2.IMachineImage {
  constructor(props: EksOptimizedAmiProps = {}) {
    const version = props.kubernetesVersion || LATEST_KUBERNETES_VERSION;
    if (!(version in EKS_AMI)) {
      throw new Error(`We don't have an AMI for kubernetes version ${version}`);
    }
    super(EKS_AMI[version][props.nodeType || NodeType.NORMAL]);
  }
}

const LATEST_KUBERNETES_VERSION = '1.11';

/**
 * Whether the worker nodes should support GPU or just normal instances
 */
export enum NodeType {
  /**
   * Normal instances
   */
  NORMAL = 'Normal',

  /**
   * GPU instances
   */
  GPU = 'GPU',
}

export function nodeTypeForInstanceType(instanceType: ec2.InstanceType) {
  return instanceType.toString().startsWith('p2') || instanceType.toString().startsWith('p3') ? NodeType.GPU : NodeType.NORMAL;
}

/**
 * Select AMI to use based on the AWS Region being deployed
 *
 * TODO: Create dynamic mappign by searching SSM Store
 *
 * @see https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html
 */
const EKS_AMI: {[version: string]: {[type: string]: {[region: string]: string}}} = {
  '1.10': parseTable(`
    US West (Oregon) (us-west-2) 	ami-09e1df3bad220af0b 	ami-0ebf0561e61a2be02
    US East (N. Virginia) (us-east-1) 	ami-04358410d28eaab63 	ami-0131c0ca222183def
    US East (Ohio) (us-east-2) 	ami-0b779e8ab57655b4b 	ami-0abfb3be33c196cbf
    EU (Frankfurt) (eu-central-1) 	ami-08eb700778f03ea94 	ami-000622b1016d2a5bf
    EU (Stockholm) (eu-north-1) 	ami-068b8a1efffd30eda 	ami-cc149ab2
    EU (Ireland) (eu-west-1) 	ami-0de10c614955da932 	ami-0dafd3a1dc43781f7
    Asia Pacific (Tokyo) (ap-northeast-1) 	ami-06398bdd37d76571d 	ami-0afc9d14b2fe11ad9
    Asia Pacific (Seoul) (ap-northeast-2) 	ami-08a87e0a7c32fa649 	ami-0d75b9ab57bfc8c9a
    Asia Pacific (Singapore) (ap-southeast-1) 	ami-0ac3510e44b5bf8ef 	ami-0ecce0670cb66d17b
    Asia Pacific (Sydney) (ap-southeast-2) 	ami-0d2c929ace88cfebe 	ami-03b048bd9d3861ce9
    `),
  '1.11': parseTable(`
    US West (Oregon) (us-west-2) 	ami-0a2abab4107669c1b 	ami-0c9e5e2d8caa9fb5e
    US East (N. Virginia) (us-east-1) 	ami-0c24db5df6badc35a 	ami-0ff0241c02b279f50
    US East (Ohio) (us-east-2) 	ami-0c2e8d28b1f854c68 	ami-006a12f54eaafc2b1
    EU (Frankfurt) (eu-central-1) 	ami-010caa98bae9a09e2 	ami-0d6f0554fd4743a9d
    EU (Stockholm) (eu-north-1) 	ami-06ee67302ab7cf838 	ami-0b159b75
    EU (Ireland) (eu-west-1) 	ami-01e08d22b9439c15a 	ami-097978e7acde1fd7c
    Asia Pacific (Tokyo) (ap-northeast-1) 	ami-0f0e8066383e7a2cb 	ami-036b3969c5eb8d3cf
    Asia Pacific (Seoul) (ap-northeast-2) 	ami-0b7baa90de70f683f 	ami-0b7f163f7194396f7
    Asia Pacific (Singapore) (ap-southeast-1) 	ami-019966ed970c18502 	ami-093f742654a955ee6
    Asia Pacific (Sydney) (ap-southeast-2) 	ami-06ade0abbd8eca425 	ami-05e09575123ff498b
    `),
};

/**
 * Helper function which makes it easier to copy/paste the HTML AMI table into this source.
 *
 * I can't stress enough how much of a temporary solution this should be, but until we
 * have a proper discovery mechanism, this is easier than converting the table into
 * nested dicts by hand.
 */
function parseTable(contents: string): {[type: string]: {[region: string]: string}} {
  const normalTable: {[region: string]: string} = {};
  const gpuTable: {[region: string]: string} = {};

  // Last parenthesized expression that looks like a region
  const extractRegion = /\(([a-z]+-[a-z]+-[0-9]+)\)\s*$/;

  for (const line of contents.split('\n')) {
    if (line.trim() === '') { continue; }

    const parts = line.split('\t');
    if (parts.length !== 3) {
      throw new Error(`Line lost its TABs: "${line}"`);
    }

    const m = extractRegion.exec(parts[0]);
    if (!m) { throw new Error(`Like doesn't seem to contain a region: "${line}"`); }
    const region = m[1];

    normalTable[region] = parts[1].trim();
    gpuTable[region] = parts[2].trim();
  }

  return {
    [NodeType.GPU]: gpuTable,
    [NodeType.NORMAL]: normalTable
  };
}
