// The before step
export function request(...args) {
  console.log(args);
  return {}
}

// The after step
export function response(ctx) {
  return ctx.prev.result
}
