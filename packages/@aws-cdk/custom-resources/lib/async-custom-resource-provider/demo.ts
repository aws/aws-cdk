import { AsyncResourceHandler, BeginResult, CompleteResourceEvent, CompleteResult, ResourceEvent } from './api';

// tslint:disable:no-console

export class MyResourceHandler implements AsyncResourceHandler {
  public begin(event: ResourceEvent): BeginResult {
    console.log(`start creating resource of type ${event.ResourceType}`);
    return {
      PhysicalResourceId: 'my-resource-id'
    };
  }

  public complete(event: CompleteResourceEvent): CompleteResult {
    console.log(`checking if ${event.PhysicalResourceId} has been created`);

    throw new Error('error when creating the resource');

    return {
      complete: true
    };
  }
}