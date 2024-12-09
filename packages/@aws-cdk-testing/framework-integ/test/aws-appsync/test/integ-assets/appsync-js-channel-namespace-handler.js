export function onPublish(ctx) {
  return ctx.events.filter((event) => event.payload.odds > 0)
}