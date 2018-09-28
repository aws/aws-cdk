export interface ContainerDefinition {
  name: string;
  image: string;

  command?: string[];
  cpu?: number;
  disableNetworking?: boolean;
  dnsSearchDomains?: string[];
  dnsServers?: string[];
  dockerLabels?: string[];
  dockerSecurityOptions?: string[];
  entryPoint?: string[];
  essential?: boolean;
  hostname?: string;
  links?: string[];
  logConfiguration?: LogConfiguration[];
  memory?: number;
  memoryReservation?: number;
  privileged?: boolean;
  readonlyRootFilesystem?: boolean;
  user?: string;
  workingDirectory?: string
}

export interface LogConfiguration {
  logDriver: string;
  // options?:
}

// environment?: list of key-value;
// extraHosts?: hostEntry[];
// healthCheck?: healthCheck;
// linuxParameters: linuxParam[];
// mountPoints?: mountPoint[];
// portMappings?: portMapping[];
// ulimits?: ulimit[];
// volumesFrom?: volumeFrom[];
