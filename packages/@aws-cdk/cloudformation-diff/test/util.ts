export function template(resources: {[key: string]: any}) {
  return { Resources: resources };
}

export function resource(type: string, properties: {[key: string]: any}) {
  return { Type: type, Properties: properties };
}

export function role(properties: {[key: string]: any}) {
  return resource('AWS::IAM::Role', properties);
}

export function policy(properties: {[key: string]: any}) {
  return resource('AWS::IAM::Policy', properties);
}

export function poldoc(...statements: any[]) {
  return {
    Version: '2012-10-17',
    Statement: statements,
  };
}
