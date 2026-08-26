import { util } from '@aws-appsync/utils';

const TABLE = 'event-messages';

export const onPublish = {
  request: (ctx) => {
    return {
      operation: 'BatchPutItem',
      tables: {
        [TABLE]: ctx.events.map((event) => util.dynamodb.toMapValues({
            ...event.payload,
            ddb: true,
            eventId: event.id
        })),
      },
    };
  },
  response: (ctx) => {
    const { error, result } = ctx;
    if (error) {
        return util.appendError(error.message, error.type, result);
    }
    return ctx.result.data[TABLE].map((item) => ({
        id: item.eventId,
        payload: {
            ...item
        }
    }));
  },
}

export function onSubscribe(ctx) {
  // Reject a subscription attempt
  // util.unauthorized();
}