// tslint:disable: no-console

/**
 * Called for every resource lifecycle event.
 *
 * @property event CloudFormation custom resource event.
 * @returns updates to the event. Merged with the original event when
 * `isComplete` is called. When the handler returns `event` it include
 * `PhysicalResourceId`, either from this operation (for "Create") or from a
 * previous one (for "Update" or "Delete").
 */
exports.onEvent = async (event: any): Promise<any> => {
  console.log('handler', JSON.stringify(event, undefined, 2));

  return {
    PhysicalResourceId: 'NewPhysicalResourceId',
    Data: {
      MyAttribute: 'MyAttributeValue'
    }
  };
};

/**
 * Called immediately after `handler` and at the specified waiter interval
 * to determine if the operation has finished. As long as this returns `false`,
 * this method will be called again until the alloted timeout. When it returns
 * `true`, the operation will be considered successful.
 */
exports.isComplete = async (event: any): Promise<boolean> => {
  console.log('isComplete', JSON.stringify(event, undefined, 2));
  return true;
};