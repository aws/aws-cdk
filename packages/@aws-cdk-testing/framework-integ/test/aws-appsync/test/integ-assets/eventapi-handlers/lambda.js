import { util } from '@aws-appsync/utils';

export const onPublish = {
  request: (ctx) => {
    return {
      operation: 'Invoke',
      payload: {
        events: ctx.events
      },
    };
  },
  response: (ctx) => {
    const { error, result } = ctx;
    if (error) {
      return util.appendError(error.message, error.type, result);
    }

    return result;
  },
}

export function onSubscribe(ctx) {
  // Reject a subscription attempt
  // util.unauthorized();
}