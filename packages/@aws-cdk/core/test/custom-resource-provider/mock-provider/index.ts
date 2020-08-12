/* eslint-disable no-console */

export function handler(event: any) {
  console.log('I am a custom resource');
  console.log(event);
  return {
    PhysicalResourceId: event.ResourceProperties.physicalResourceId,
    Data: event.ResourceProperties.attributes,
  };
}