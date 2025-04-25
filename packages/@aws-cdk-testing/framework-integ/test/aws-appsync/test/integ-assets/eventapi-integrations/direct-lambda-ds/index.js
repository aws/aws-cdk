/**
 * 
 * @param {Object} event json object that contains the action and channel
 * @returns {Object}
 */
export const handler = async (event) => {
  if (event.info.operation === 'PUBLISH') {
    // go off and do something async
    return {};
  } else if (event.info.operation === 'SUBSCRIBE') {
    const segments = event.info.channel.segments;
    if (segments.includes("invalid")) {
      throw new Error("You are not authorized to subscribe to this channel");
    }
    return null;
  }
};
