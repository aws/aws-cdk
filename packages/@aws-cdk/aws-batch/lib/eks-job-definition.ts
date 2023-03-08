import * as eks from '@aws-cdk/aws-eks';
import { Construct } from 'constructs';
import { IJobDefinition, JobDefinitionBase, JobDefinitionProps } from './job-definition-base';

interface IEksJobDefinition extends IJobDefinition {
  pod: batch.IEksPod;
  platform?: Platform;
}

enum Platform {
  // TODO
}

class EksPod {
  containers: batch.EksContainerDefinition[]
  dnsPolicy?: DnsPolicy
  useHostNetwork?: boolean
  serviceAccount?: string

  addContainer(batch.EksContainerDefinition)
}

class EksPod {
  containers: batch.EksContainerDefinition[]
  dnsPolicy?: DnsPolicy
  useHostNetwork?: boolean
  serviceAccount?: string

  addContainer(batch.EksContainerDefinition)
}

class EksContainerDefinition {
  image: string
  args?: string[]
  command?: string[]
  env?: { [key:string]: string }
  imagePullPolicy?: ImagePullPolicy
  name?: string
  resources?: EksContainerResources
  priveleged?: boolean
  readonlyFileSystem?: boolean
  runAsGroup?: number
  runAsRoot?: boolean
  runAsUser?: number
  volumes?: EksVolume[]

  addVolume(...EksVolume[])
}

// TODO: EksContainerResources has no definition
abstract class EksVolume {
  name: string;
  mountPath?: string;
  readonly?: boolean;
}

class EmptyDirVolume extends EksVolume {
  medium?: MediumType;
  sizeLimit?: number;
}

class HostPathVolume extends EksVolume {
  path: string;
}

class SecretPathVolume extends EksVolume {
  secret: string;
  optional?: boolean;
}

interface EksJobDefinitionProps {
  pod: batch.IEksPod;
  platform?: Platform;
}

class EksJobDefinition implements IEksJobDefinition {
  constructor(readonly props: EksJobDefinitionProps = {}) {}
}