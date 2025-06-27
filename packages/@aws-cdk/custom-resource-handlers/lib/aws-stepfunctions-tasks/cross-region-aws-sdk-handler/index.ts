/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */

type Event = {
  /**
   * AWS Region name to call the service
   */
  region: string;

  /**
   * AWS service name (must be in AWS SDK for JS v3 style)
   */
  service: string;

  /**
   * AWS API endpoint
   */
  endpoint: string;

  /**
   * API Action name (must be in camelCase or PascalCase)
   */
  action: string;

  /**
   * request parameters to call the API (must be in AWS SDK for JS v3 style)
   */
  parameters?: any;
};

// reference: code from CDK AwsCustomResource
function findV3ClientConstructor(pkg: object) {
  const filtered = Object.entries(pkg).filter(([name]) => {
    // Services expose a base __Client class that we don't want ever
    return name.endsWith('Client') && name !== '__Client';
  }) as [string,
    {
      new (config: any): {
        send: (command: any) => Promise<any>;
        config: any;
      };
    }][];
  if (filtered.length == 0) {
    throw new Error('There is no *Client class in the package.');
  }
  if (filtered.length > 1) {
    throw new Error(`There are more than one *Client classes in the package: ${filtered.map(r=>r[0]).join(',')}`);
  }
  return filtered[0][1];
}

function camelToPascal(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function findCommandClass(pkg: object, action: string) {
  const commandName = `${camelToPascal(action)}Command`;
  const Command = Object.entries(pkg).find(([name]) => name.toLowerCase() === commandName.toLowerCase())?.[1] as {
    new (input: any): any;
  };
  if (!Command) {
    throw new Error(`Unable to find command named: ${commandName} for action: ${action} in service package`);
  }
  return Command;
}

export const handler = async (event: Event) => {
  // Log the event to understand the incoming request structure
  console.log('Event: ', event);

  try {
    // esbuild-disable unsupported-require-call -- not esbuildable but that's fine
    const pkg = require(`@aws-sdk/client-${event.service}`);
    const Client = findV3ClientConstructor(pkg);
    const Command = findCommandClass(pkg, event.action);

    const client = new Client({ region: event.region, endpoint: event.endpoint });
    const command = new Command(event.parameters ?? {});
    const res = await client.send(command);

    // Special handling for Lambda invoke responses
    if (res.Payload && (res.Payload instanceof Uint8Array || res.Payload instanceof Buffer)) {
      try {
        const payloadString = new TextDecoder().decode(res.Payload);
        res.Payload = JSON.parse(payloadString);
      } catch (error) {
        // If parsing fails, keep as decoded string
        res.Payload = new TextDecoder().decode(res.Payload);
      }
    }

    // Serialize the entire response to ensure all other binary data is handled
    const serializedRes = JSON.stringify(res);
    return JSON.parse(serializedRes);
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};
