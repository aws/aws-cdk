// The before step
export function request(...args) {
  return {}
}

// The after step
export function response(ctx) {
  return ctx.prev.result
}
