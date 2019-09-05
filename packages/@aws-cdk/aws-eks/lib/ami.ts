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

const LATEST_KUBERNETES_VERSION = '1.13';

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
    US East (Ohio) (us-east-2) 	ami-0523ec257fff1261d 	ami-006382264ad5fc773
    US East (N. Virginia) (us-east-1) 	ami-01c1c96b9aa69de37 	ami-0f1b9925c9ace2043
    US West (Oregon) (us-west-2) 	ami-021dd1fb7ba7e6e51 	ami-0c3c59a4a7bea5678
    Asia Pacific (Mumbai) (ap-south-1) 	ami-04c2ed5ff15a580f4 	ami-0ea42cc96a8375851
    Asia Pacific (Tokyo) (ap-northeast-1) 	ami-02ffa4511b4baa5fa 	ami-00f64026212ad62c0
    Asia Pacific (Seoul) (ap-northeast-2) 	ami-06295f3e6390dae00 	ami-060b7aed71dfaa5f5
    Asia Pacific (Singapore) (ap-southeast-1) 	ami-07f8ccb046b3ce697 	ami-029b65710f075da3d
    Asia Pacific (Sydney) (ap-southeast-2) 	ami-03ebcd449b224e0a3 	ami-0f13220d49a34e787
    EU (Frankfurt) (eu-central-1) 	ami-0c40973ffcf8bca40 	ami-08d32cef88aa48343
    EU (Ireland) (eu-west-1) 	ami-06a96b4cfd627430b 	ami-058a8eec818dc3910
    EU (London) (eu-west-2) 	ami-03356e704fb004162 	ami-0cd6f7f1f7ceedc27
    EU (Paris) (eu-west-3) 	ami-0eb77a4ca7135122b 	ami-01e3c54f23b6b02b3
    EU (Stockholm) (eu-north-1) 	ami-028df8ba9b8603bdd 	ami-0d1ee923abbb8cf6c
    `),
  '1.11': parseTable(`
    US East (Ohio) (us-east-2)	ami-0e565ff1ccb9b6979	ami-0f9e62727a55f68d3
    US East (N. Virginia) (us-east-1)	ami-08571c6cee1adbb62	ami-0c3d92683a7946ac3
    US West (Oregon) (us-west-2)	ami-0566833f0c8e9031e	ami-058b22acd515ec20b
    Asia Pacific (Hong Kong) (ap-east-1)	ami-0e2e431905d176277	ami-0baf9ac8446e87fb5
    Asia Pacific (Mumbai) (ap-south-1)	ami-073c3d075aeb53d1f	ami-0c709282458d1114c
    Asia Pacific (Tokyo) (ap-northeast-1)	ami-0644b094efc34d888	ami-023f507ec007de487
    Asia Pacific (Seoul) (ap-northeast-2)	ami-0ab0067299faa5229	ami-0ccbbe6530310b01d
    Asia Pacific (Singapore) (ap-southeast-1)	ami-087f58c635bb8283b	ami-0341435cf966cb837
    Asia Pacific (Sydney) (ap-southeast-2)	ami-06caef7a88fd74af2	ami-0987b07bd338f97db
    EU (Frankfurt) (eu-central-1)	ami-099b3f8db68693895	ami-060f13bd7397f782d
    EU (Ireland) (eu-west-1)	ami-06b60c5852910e7b5	ami-0d84963dfda5af073
    EU (London) (eu-west-2)	ami-0b56c1f39e4b1eb8e	ami-0189e53a00d37a0b6
    EU (Paris) (eu-west-3)	ami-036237d1951bfeabc	ami-0baea83f5f5d2abfe
    EU (Stockholm) (eu-north-1)	ami-0612e10dfe00c5ff6	ami-0d5b7823e58094232
    `),
  '1.12': parseTable(`
    US East (Ohio) (us-east-2)	ami-0ebb1c51e5fe9c376	ami-0b42bfc7af8bb3abc
    US East (N. Virginia) (us-east-1)	ami-01e370f796735b244	ami-0eb0119f55d589a03
    US West (Oregon) (us-west-2)	ami-0b520e822d42998c1	ami-0c9156d7fcd3c2948
    Asia Pacific (Hong Kong) (ap-east-1)	ami-0aa07b9e8bfcdaaff	ami-0a5e7de0e5d22a988
    Asia Pacific (Mumbai) (ap-south-1)	ami-03b7b0e3088a72394	ami-0c1bc87ff613a979b
    Asia Pacific (Tokyo) (ap-northeast-1)	ami-0f554256ac7b33081	ami-0e2f87975f5aa9908
    Asia Pacific (Seoul) (ap-northeast-2)	ami-066a40f5f0e0b90f4	ami-08101c357b41e9f9a
    Asia Pacific (Singapore) (ap-southeast-1)	ami-06a42a7479836d402	ami-0420c66a82472f4b2
    Asia Pacific (Sydney) (ap-southeast-2)	ami-0f93997f60ca40d26	ami-04a085528a6af6499
    EU (Frankfurt) (eu-central-1)	ami-04341c15c2f941589	ami-09c45f4e40a56254b
    EU (Ireland) (eu-west-1)	ami-018b4a3f81f517183	ami-04668c090ff8c1f50
    EU (London) (eu-west-2)	ami-0fd0b45d54f80a0e9	ami-0b925567bd252e74c
    EU (Paris) (eu-west-3)	ami-0b12420c7f7281432	ami-0f975ac243bcd0da0
    EU (Stockholm) (eu-north-1)	ami-01c1b0b8dcbd02b11	ami-093da2874a5426ce3
    `),
  '1.13': parseTable(`
    US East (Ohio) (us-east-2)	ami-027683840ad78d833	ami-0af8403c143fd4a07
    US East (N. Virginia) (us-east-1)	ami-0d3998d69ebe9b214	ami-0484012ada3522476
    US West (Oregon) (us-west-2)	ami-00b95829322267382	ami-0d24da600cc96ae6b
    Asia Pacific (Hong Kong) (ap-east-1)	ami-03f8634a8fd592414	ami-080eb165234752969
    Asia Pacific (Mumbai) (ap-south-1)	ami-0062e5b0411e77c1a	ami-010dbb7183ab64b39
    Asia Pacific (Tokyo) (ap-northeast-1)	ami-0a67c71d2ab43d36f	ami-069303796840f8155
    Asia Pacific (Seoul) (ap-northeast-2)	ami-0d66d2fefbc86831a	ami-04f71dc710ff5baf4
    Asia Pacific (Singapore) (ap-southeast-1)	ami-06206d907abb34bbc	ami-0213fc532b1c2e05f
    Asia Pacific (Sydney) (ap-southeast-2)	ami-09f2d86f2d8c4f77d	ami-01fc0a4c67f82532b
    EU (Frankfurt) (eu-central-1)	ami-038bd8d3a2345061f	ami-07b7cbb235789cc31
    EU (Ireland) (eu-west-1)	ami-0199284372364b02a	ami-00bfeece5b673b69f
    EU (London) (eu-west-2)	ami-0f454b09349248e29	ami-0babebc79dbf6016c
    EU (Paris) (eu-west-3)	ami-00b44348ab3eb2c9f	ami-03136b5b83c5b61ba
    EU (Stockholm) (eu-north-1)	ami-02218be9004537a65	ami-057821acea15c1a98
    `),
    '1.14': parseTable(`
    US East (Ohio) (us-east-2) 	ami-0b031080918049726 	ami-04d77fc8fef1aaca2
    US East (N. Virginia) (us-east-1) 	ami-03e43ca3afc5d79a3 	ami-06191d186b526c958
    US West (Oregon) (us-west-2) 	ami-076c743acc3ec4159 	ami-06a627486f5cdcfc5
    Asia Pacific (Hong Kong) (ap-east-1) 	ami-00542b29e27204f2f 	N/A*
    Asia Pacific (Mumbai) (ap-south-1) 	ami-05bc2d5c9ce03d871 	ami-03807add4352f6e91
    Asia Pacific (Tokyo) (ap-northeast-1) 	ami-07965c80cb853df83 	ami-015bb79419d174bd5
    Asia Pacific (Seoul) (ap-northeast-2) 	ami-01d6aeb8c614a0845 	ami-0d755d74fc8224a9b
    Asia Pacific (Singapore) (ap-southeast-1) 	ami-06a770d3ab2a8d907 	ami-0588cc83f0a817cec
    Asia Pacific (Sydney) (ap-southeast-2) 	ami-05b461c33a8e8b5b4 	ami-0eddf7bdcd5a0214a
    EU (Frankfurt) (eu-central-1) 	ami-0bbac7cbcb41a55f5 	ami-048c8692923c91566
    EU (Ireland) (eu-west-1) 	ami-0a7313ee6c5ea3183 	ami-01c2a548e95a8867f
    EU (London) (eu-west-2) 	ami-0c9806e57a54faf9f 	ami-07cb972305fc401eb
    EU (Paris) (eu-west-3) 	ami-0f5705ccd7919964d 	ami-0fc79430cca30a71e
    EU (Stockholm) (eu-north-1) 	ami-064a74cffcc25767f 	ami-0f689c98b9f8bee3b
    Middle East (Bahrain) (me-south-1) 	ami-0cd9f426956a966c7 	N/A*
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
