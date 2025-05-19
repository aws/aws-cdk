import { util } from '@aws-appsync/utils';

export const onPublish = {
  request: (ctx) => {
    return {
      "version": "2018-05-29",
      "method": "GET",
      "params": {
        "headers": {
          "Content-Type": "application/json"
        }
      },
      "resourcePath": `/prod/random`
    };
  },
  response: (ctx) => {
    const { error, result } = ctx;
    if (error) {
      return util.appendError(error.message, error.type, result);
    }
    const randomValue = result.body;
    return ctx.events.map((event) => ({
      id: event.id,
      payload: {
        ...event.payload,
        random: randomValue
      }
    }));
  },
}

export function onSubscribe(ctx) {
  // Reject a subscription attempt
  // util.unauthorized();
}