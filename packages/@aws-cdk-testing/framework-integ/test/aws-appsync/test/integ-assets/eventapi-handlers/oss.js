import { util } from '@aws-appsync/utils';

const INDEX_NAME = 'movies';

export const onPublish = {
  request: (ctx) => {
    const docs = ctx.events.map(event => ({
      _index: INDEX_NAME,
      _id: event.payload.id
    }));

    return {
      operation: "GET",
      path: "/_mget",
      params: {
        body: { docs }
      }
    };
  },
  response: (ctx) => {
    const { error, result } = ctx;

    if (error) {
      return util.appendError(error.message, error.type, result);
    }

    return result.docs.map((item, idx) => {
      if (item.found) {
        return {
          id: ctx.events[idx].id,
          payload: {
            ...item._source
          }
        }
      } else {
        return ctx.events[idx]
      }
    });
  },
}

export function onSubscribe(ctx) {
  // Reject a subscription attempt
  // util.unauthorized();
}