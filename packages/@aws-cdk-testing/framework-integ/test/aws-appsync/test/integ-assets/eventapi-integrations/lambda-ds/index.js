/**
 * 
 * @param {Object} event json object that contains the action and channel
 * @returns {Object}
 */
exports.handler = async function(event) {
  return event.events.map((e) => ({
    id: e.id,
    payload: {
      ...e.payload,
      custom: "Hello from Lambda!"
    }
  }));
}