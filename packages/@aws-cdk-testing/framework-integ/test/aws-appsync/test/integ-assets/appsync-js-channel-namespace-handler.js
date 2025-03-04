function enrichEvent(event) {
  return {
    id: event.id,
    payload: {
      ...event.payload,
      newField: 'newField'
    }
  }
}
export function onPublish(ctx) {
  return ctx.events.map(enrichEvent);
}