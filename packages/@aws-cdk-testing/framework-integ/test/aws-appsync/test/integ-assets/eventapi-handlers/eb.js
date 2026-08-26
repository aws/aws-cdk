import { util } from '@aws-appsync/utils';

export const onPublish = {
  request: (ctx) => {
    const events = ctx.events.map((event) => ({
      source: 'appsync.eventapi',
      detail: {
        id: event.id,
        ...event.payload,
      },
      detailType: 'AppSyncEvent',
    }));
  
    return {
      operation: "PutEvents",
      events: events,
    };
  },
  response: (ctx) => {
    const { error, result } = ctx;
    if (error) {
      return util.appendError(error.message, error.type, result);
    }

    return ctx.events.map((event, index) => ({
      id: event.id,
      payload: {
        ...event.payload,
        ...ctx.result.Entries[index],
      }
    }));
  },
}

export function onSubscribe(ctx) {
  // Reject a subscription attempt
  // util.unauthorized();
}