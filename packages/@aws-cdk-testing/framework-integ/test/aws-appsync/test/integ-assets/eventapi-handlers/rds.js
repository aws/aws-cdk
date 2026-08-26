import { toJsonObject, createPgStatement as pg } from '@aws-appsync/utils/rds';
import { util } from '@aws-appsync/utils';

const TABLE_NAME = 'events';

export const onPublish = {
  request: (ctx) => {
    const values = ctx.events.map((event) => {
      return `('${event.id}', ${Object.values(event.payload).map(val => typeof val === 'string' ? `'${val}'` : val).join(',')}, 'rds')`
    }).join(', ');

    const statement = `INSERT INTO ${TABLE_NAME} (event_id, message, ds_type) VALUES ${values} RETURNING *`;
    return pg(statement);
  },
  response: (ctx) => {
    const { error, result } = ctx;
    console.log(ctx);
    if (error) {
      return util.appendError(error.message, error.type, result);
    }

    const parsedRes = toJsonObject(result)[0];
    return parsedRes.map((res) => ({
      id: res.event_id,
      payload: {
        message: res.message,
        ds_type: res.ds_type
      }
    }));
  },
}

export function onSubscribe(ctx) {
  // Reject a subscription attempt
  // util.unauthorized();
}