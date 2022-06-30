import { EndpointProps } from './index';

export function validateEndpointProps(props: EndpointProps) {
  const defaultNameMaxLength: number = 63;
  const defaultNamePattern: RegExp = /^[a-zA-Z0-9](-*[a-zA-Z0-9]){0,62}/;
  validateName('Endpoint name', props.endpointName, defaultNameMaxLength, defaultNamePattern);
  validateName('Endpoint config name', props.endpointConfigName, defaultNameMaxLength, defaultNamePattern);
}

function validateName(label: string, name: string | undefined, maxLength: number, pattern: RegExp) {
  if (name === undefined) { return; }

  if (name.length > maxLength) {
    throw new Error(`${label} can not be longer than ${maxLength} characters.`);
  }
  if (!pattern.test(name)) {
    throw new Error(`${label} can contain only letters, numbers, hyphens with no spaces.`);
  }
}
