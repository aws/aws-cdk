import cdk = require('@aws-cdk/cdk');
import { BaseInstanceProps, InstanceBase } from './instance';
import { NamespaceType } from './namespace';
import { IService } from './service';
import { CfnInstance } from './servicediscovery.generated';

// tslint:disable-next-line:no-empty-interface
export interface NonIpInstanceBaseProps extends BaseInstanceProps {
}

export interface NonIpInstanceProps extends NonIpInstanceBaseProps {
  /**
   * The Cloudmap service this resource is registered to.
   */
  service: IService;
}

export class NonIpInstance extends InstanceBase {
  /**
   * The Id of the instance
   */
  public readonly instanceId: string;

  /**
   * The Cloudmap service to which the instance is registered.
   */
  public readonly service: IService;

  constructor(scope: cdk.Construct, id: string, props: NonIpInstanceProps) {
    super(scope, id);

    if (props.service.namespace.type !== NamespaceType.Http) {
      throw new Error('This type of instance can only be registered for HTTP namespaces.');
    }

    if (props.customAttributes === undefined) {
      throw new Error('You must specify at least one custom attribute for this instance type.');
    }

    const resource = new CfnInstance(this, 'Resource', {
      instanceId: props.instanceId,
      serviceId: props.service.serviceId,
      instanceAttributes: {
        ...props.customAttributes
      }
    });

    this.service = props.service;
    this.instanceId = resource.instanceId;
  }
}
