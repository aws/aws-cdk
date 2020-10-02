import { ServiceExtension, ServiceBuild } from './extension-interfaces';


/**
 * Modifies the service to assign a public to each task.
 */
export class AssignPublicIpExtension extends ServiceExtension {
  constructor() {
    super('public-ip');
  }

  public modifyServiceProps(props: ServiceBuild) {
    return {
      ...props,
      assignPublicIp: true,
    } as ServiceBuild;
  }
}
