/**
 * Parses the value of "Value" and reflects it back as attribute.
 */
export async function handler(event: any) {
  return {
    Data: {
      Value: JSON.parse(event.ResourceProperties.Value),
    },
  };
}