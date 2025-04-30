exports.handler = async (context) => {
  if (context.info.operation === 'PUBLISH') {
    return { 
      events: context.events.map((ev) => {
        // Transform the event
        return {
          id: ev.id,
          payload: {
            ...ev.payload,
            with: `hello world from ${ev.id}`
          }
        }
      })
    }
  } else if (context.info.operation === 'SUBSCRIBE') {

  } else {
    throw new Error('Unknown operation');
  }
};