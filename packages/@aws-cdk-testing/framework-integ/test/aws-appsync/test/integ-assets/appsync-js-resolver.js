import { util } from '@aws-appsync/utils'

export function request(ctx) {
  const id = util.autoId()
  const name = ctx.args.name;

  ctx.args.input = {
    id,
    name,
  }

  return {
    version: '2018-05-29',
    operation: 'PutItem',
    key: { id: util.dynamodb.toDynamoDB(ctx.args.input.id) },
    attributeValues: util.dynamodb.toMapValues(ctx.args.input),
  };
}

export function response(ctx) {
  return ctx.result;
}
