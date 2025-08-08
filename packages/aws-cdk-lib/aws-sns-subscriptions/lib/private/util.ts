import * as sns from '../../../aws-sns';
import { ArnFormat, IResource, Token, Stack } from '../../../core';

export function regionFromArn(topic: sns.ITopic, resource: IResource): string | undefined {
  // no need to specify `region` for topics defined within the same stack.
  if (topic instanceof sns.Topic) {
    if (topic.stack !== resource.stack) {
      // only if we know the region, will not work for
      // env agnostic stacks
      if (!Token.isUnresolved(topic.env.region) && topic.env.region !== resource.env.region) {
        return topic.env.region;
      }
    }
    return undefined;
  }
  return Stack.of(topic).splitArn(topic.topicArn, ArnFormat.SLASH_RESOURCE_NAME).region;
}
