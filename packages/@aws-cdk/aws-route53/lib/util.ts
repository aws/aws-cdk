/**
 * Validates a zone name is valid by Route53 specifc naming rules,
 * and that there is no trailing dot in the name.
 *
 * @param zoneName the zone name to be validated.
 * @returns +zoneName+
 * @throws ValidationError if the name is not valid.
 */
export function validateZoneName(zoneName: string) {
  if (zoneName.endsWith('.')) {
    throw new ValidationError('zone name must not end with a trailing dot');
  }
  if (zoneName.length > 255) {
    throw new ValidationError('zone name cannot be more than 255 bytes long');
  }
  if (zoneName.split('.').find(label => label.length > 63)) {
    throw new ValidationError('zone name labels cannot be more than 63 bytes long');
  }
  if (!zoneName.match(/^[a-z0-9!"#$%&'()*+,/:;<=>?@[\\\]^_`{|}~.-]+$/i)) {
    throw new ValidationError('zone names can only contain a-z, 0-9, -, ! " # $ % & \' ( ) * + , - / : ; < = > ? @ [ \ ] ^ _ ` { | } ~ .');
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
