// CFN Intrinsic Function Resolver
// Enhanced version with cross-stack reference support
// AWS CloudFormation Intrinsic Functions Reference:
// https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/intrinsic-function-reference.html
//
// Supported Functions:
// - Ref: Returns the value of the specified parameter or resource
// - Fn::Join: Appends a set of values into a single value, separated by delimiter
// - Fn::Sub: Substitutes variables in an input string with values you specify
// - Fn::GetAtt: Returns the value of an attribute from a resource in the template
// - Fn::ImportValue: Returns the value of an output exported by another stack
// - Fn::Select: Returns a single object from a list of objects by index
// - Fn::Split: Splits a string into a list of string values
// - Fn::Cidr: Returns an array of CIDR address blocks
// - Fn::Base64: Returns the Base64 representation of the input string
// - Fn::Not: Returns true for a condition that evaluates to false
// - Fn::Contains: Returns true if a specified string matches at least one value in a list
// - Fn::GetAZs: Returns an array that lists Availability Zones for a specified region
// - Fn::FindInMap: Returns the value corresponding to keys in a two-level nested map
//
// Note: CDK-generated templates are assumed to be syntactically correct

interface ResourceRegistry {
  resources: Record<string, any>;
  exports: Record<string, string>;
  parameters: Record<string, any>;
}

const CLOUDFORMATION_PSEUDOPARAMETERS = {
  'AWS::URLSuffix': 'amazonaws.com',
  'AWS::StackName': 'teststack',
  'AWS::StackId': 'arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123',
  'AWS::Region': 'us-west-2',
  'AWS::Partition': 'aws',
  'AWS::AccountId': '123456789012'
};

// Security-critical resource attributes for accurate policy validation
const SECURITY_RESOURCE_ATTRIBUTES: Record<string, Record<string, any>> = {
  'AWS::IAM::Role': {
    'Arn': (name: string) => `arn:aws:iam::123456789012:role/${name}`,
    'RoleId': () => 'AIDACKCEVSQ6C2EXAMPLE'
  },
  'AWS::IAM::User': {
    'Arn': (name: string) => `arn:aws:iam::123456789012:user/${name}`,
    'UserId': () => 'AIDACKCEVSQ6C2EXAMPLE'
  },
  'AWS::IAM::Policy': {
    'Arn': (name: string) => `arn:aws:iam::123456789012:policy/${name}`,
    'PolicyId': () => 'ANPAI23HZ27SI6FQMGNQ2'
  },
  'AWS::KMS::Key': {
    'Arn': (name: string) => `arn:aws:kms:us-west-2:123456789012:key/${name}`,
    'KeyId': (name: string) => name
  },
  'AWS::S3::Bucket': {
    'Arn': (name: string) => `arn:aws:s3:::${name}`,
    'BucketName': (name: string) => name,
    'DomainName': (name: string) => `${name}.s3.amazonaws.com`,
    'WebsiteURL': (name: string) => `http://${name}.s3-website-us-west-2.amazonaws.com`
  },
  'AWS::SNS::Topic': {
    'Arn': (name: string) => `arn:aws:sns:us-west-2:123456789012:${name}`,
    'TopicName': (name: string) => name
  },
  'AWS::SQS::Queue': {
    'Arn': (name: string) => `arn:aws:sqs:us-west-2:123456789012:${name}`,
    'QueueName': (name: string) => name,
    'QueueUrl': (name: string) => `https://sqs.us-west-2.amazonaws.com/123456789012/${name}`
  },
  'AWS::Lambda::Function': {
    'Arn': (name: string) => `arn:aws:lambda:us-west-2:123456789012:function:${name}`,
    'FunctionName': (name: string) => name
  },
  'AWS::SecretsManager::Secret': {
    'Arn': (name: string) => `arn:aws:secretsmanager:us-west-2:123456789012:secret:${name}`,
    'Name': (name: string) => name
  },
  'AWS::ECR::Repository': {
    'Arn': (name: string) => `arn:aws:ecr:us-west-2:123456789012:repository/${name}`,
    'RepositoryName': (name: string) => name,
    'RepositoryUri': (name: string) => `123456789012.dkr.ecr.us-west-2.amazonaws.com/${name}`
  }
};

let globalRegistry: ResourceRegistry = { resources: {}, exports: {}, parameters: {} };

export function setGlobalRegistry(registry: ResourceRegistry): void {
  globalRegistry = registry;
}

function resolveRef(obj: any): any {
  // Check pseudoparameters first
  if (CLOUDFORMATION_PSEUDOPARAMETERS[obj.Ref as keyof typeof CLOUDFORMATION_PSEUDOPARAMETERS]) {
    return CLOUDFORMATION_PSEUDOPARAMETERS[obj.Ref as keyof typeof CLOUDFORMATION_PSEUDOPARAMETERS];
  }
  // Check template parameters
  if (globalRegistry.parameters[obj.Ref]) {
    return globalRegistry.parameters[obj.Ref];
  }
  return obj.Ref;
}

function resolveJoin(content: any, cfnResources?: Record<string, any>): string {
  const delimiter = resolveIntrinsics(content[0], cfnResources);
  const listValue = resolveIntrinsics(content[1], cfnResources);
  const list = Array.isArray(listValue) ? listValue : [listValue];
  const parts = list.map((part: any) => String(resolveIntrinsics(part, cfnResources)));
  return parts.join(delimiter);
}

function resolveSub(content: any, cfnResources?: Record<string, any>): string {
  let template: string;
  let variables: Record<string, any> = {};
  
  if (typeof content === 'string') {
    template = content;
  } else {
    template = resolveIntrinsics(content[0], cfnResources);
    if (content.length > 1) {
      for (const [k, v] of Object.entries(content[1])) {
        variables[k] = resolveIntrinsics(v, cfnResources);
      }
    }
  }
  
  // First, temporarily replace literal escapes with placeholders
  const literalPlaceholders: Record<string, string> = {};
  let placeholderCounter = 0;
  template = template.replace(/\$\{!([^}]+)\}/g, (match, literal) => {
    const placeholder = `__LITERAL_${placeholderCounter++}__`;
    literalPlaceholders[placeholder] = `\${${literal}}`;
    return placeholder;
  });
  
  // Replace variables first
  for (const [k, v] of Object.entries(variables)) {
    const value = typeof v === 'string' ? v : String(v);
    template = template.replace(new RegExp(`\\$\\{${k}\\}`, 'g'), value);
  }
  
  // Replace AWS pseudoparameters
  for (const [k, v] of Object.entries(CLOUDFORMATION_PSEUDOPARAMETERS)) {
    const escapedKey = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    template = template.replace(new RegExp(`\\$\\{${escapedKey}\\}`, 'g'), v);
  }
  
  // Replace template parameters
  for (const [k, v] of Object.entries(globalRegistry.parameters)) {
    const escapedKey = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    template = template.replace(new RegExp(`\\$\\{${escapedKey}\\}`, 'g'), String(v));
  }
  
  // Replace remaining parameters (CDK templates are well-formed)
  template = template.replace(/\$\{([\w_:-]+)\}/g, '$1');
  
  // Finally, restore literal escapes
  for (const [placeholder, literal] of Object.entries(literalPlaceholders)) {
    template = template.replace(new RegExp(placeholder, 'g'), literal);
  }
  
  return template;
}

function resolveGetAtt(content: any, cfnResources?: Record<string, any>): any {
  let logicalName: string;
  let attributeName: string;
  
  if (typeof content === 'string') {
    [logicalName, attributeName] = content.split('.');
  } else {
    logicalName = content[0];
    attributeName = content[1];
  }
  
  // Get resource type from cfnResources for accurate attribute resolution
  const resourceType = cfnResources?.[logicalName]?.Type;
  
  return getDefaultAttributeValue(logicalName, attributeName, resourceType);
}

function getDefaultAttributeValue(logicalName: string, attributeName: string, resourceType?: string): any {
  // Check security-critical resources first
  if (resourceType && SECURITY_RESOURCE_ATTRIBUTES[resourceType]) {
    const attributes = SECURITY_RESOURCE_ATTRIBUTES[resourceType];
    if (attributes[attributeName]) {
      const attrValue = attributes[attributeName];
      return typeof attrValue === 'function' ? attrValue(logicalName) : attrValue;
    }
  }
  
  // Pattern-based fallback for other resources
  if (attributeName.toLowerCase().includes('arn')) return `arn:aws:service:us-west-2:123456789012:resource/${logicalName}`;
  if (attributeName.toLowerCase().includes('keys') || attributeName.toLowerCase().includes('list')) return ['item1', 'item2'];
  if (attributeName.toLowerCase().includes('url') || attributeName.toLowerCase().includes('endpoint')) return `https://${logicalName}.amazonaws.com`;
  if (attributeName.toLowerCase().includes('id')) return `${logicalName}-id-12345`;
  if (attributeName.toLowerCase().includes('name')) return logicalName;
  return `${logicalName}.${attributeName}`; // Generic fallback
}

function resolveImportValue(exportName: string): any {
  if (globalRegistry.exports[exportName]) {
    return globalRegistry.exports[exportName];
  }
  // Parse export name for common patterns
  if (exportName.includes('PublicIp')) return '203.0.113.12';
  if (exportName.includes('PrivateIp')) return '10.0.0.1';
  if (exportName.includes('Arn')) return 'arn:aws:s3:::example-bucket';
  return `imported-${exportName}`;
}

function resolveSelect(content: any, cfnResources?: Record<string, any>): any {
  const index = resolveIntrinsics(content[0], cfnResources);
  const list = resolveIntrinsics(content[1], cfnResources);
  if (Array.isArray(list) && typeof index === 'number' && index >= 0 && index < list.length) {
    return list[index];
  }
  return 'selected-value';
}

function resolveSplit(content: any, cfnResources?: Record<string, any>): string[] {
  const delimiter = resolveIntrinsics(content[0], cfnResources);
  const source = resolveIntrinsics(content[1], cfnResources);
  if (typeof source === 'string' && typeof delimiter === 'string') {
    return source.split(delimiter);
  }
  return ['split', 'result'];
}

function resolveCidr(content: any, cfnResources?: Record<string, any>): string[] {
  const ipBlock = resolveIntrinsics(content[0], cfnResources);
  const count = resolveIntrinsics(content[1], cfnResources);
  const cidrBits = resolveIntrinsics(content[2], cfnResources);
  const result = [];
  for (let i = 0; i < Math.min(count, 4); i++) {
    result.push(`10.0.${i * 64}.0/${32 - cidrBits}`);
  }
  return result;
}

function resolveBase64(content: any, cfnResources?: Record<string, any>): string {
  const resolved = resolveIntrinsics(content, cfnResources);
  return Buffer.from(String(resolved)).toString('base64');
}

function resolveNot(content: any, cfnResources?: Record<string, any>): boolean {
  const condition = resolveIntrinsics(content, cfnResources);
  return !condition;
}

function resolveContains(content: any, cfnResources?: Record<string, any>): boolean {
  const list = resolveIntrinsics(content[0], cfnResources);
  const value = resolveIntrinsics(content[1], cfnResources);
  if (Array.isArray(list)) {
    return list.includes(value);
  }
  return false;
}

export function resolveIntrinsics(obj: any, cfnResources?: Record<string, any>): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => resolveIntrinsics(item, cfnResources));
  }
  
  if (typeof obj === 'object') {
    // Handle Ref
    if (obj.Ref) {
      return resolveRef(obj);
    }
    
    // Handle Fn::Join
    if (obj['Fn::Join'] || obj['!Join']) {
      const content = obj['Fn::Join'] || obj['!Join'];
      return resolveJoin(content, cfnResources);
    }
    
    // Handle Fn::Sub
    if (obj['Fn::Sub'] || obj['!Sub']) {
      const content = obj['Fn::Sub'] || obj['!Sub'];
      return resolveSub(content, cfnResources);
    }
    
    // Handle Fn::GetAtt
    if (obj['Fn::GetAtt'] || obj['!GetAtt']) {
      const content = obj['Fn::GetAtt'] || obj['!GetAtt'];
      return resolveGetAtt(content, cfnResources);
    }
    
    // Handle Fn::ImportValue
    if (obj['Fn::ImportValue'] || obj['!ImportValue']) {
      const exportName = resolveIntrinsics(obj['Fn::ImportValue'] || obj['!ImportValue'], cfnResources);
      return resolveImportValue(exportName);
    }
    
    // Handle Fn::Select
    if (obj['Fn::Select'] || obj['!Select']) {
      return resolveSelect(obj['Fn::Select'] || obj['!Select'], cfnResources);
    }
    
    // Handle Fn::Split
    if (obj['Fn::Split'] || obj['!Split']) {
      return resolveSplit(obj['Fn::Split'] || obj['!Split'], cfnResources);
    }
    
    // Handle Fn::Cidr
    if (obj['Fn::Cidr'] || obj['!Cidr']) {
      return resolveCidr(obj['Fn::Cidr'] || obj['!Cidr'], cfnResources);
    }
    
    // Handle other functions
    if (obj['Fn::Base64'] || obj['!Base64']) {
      return resolveBase64(obj['Fn::Base64'] || obj['!Base64'], cfnResources);
    }
    if (obj['Fn::Not'] || obj['!Not']) {
      return resolveNot(obj['Fn::Not'] || obj['!Not'], cfnResources);
    }
    if (obj['Fn::Contains'] || obj['!Contains']) {
      return resolveContains(obj['Fn::Contains'] || obj['!Contains'], cfnResources);
    }
    if (obj['Fn::GetAZs'] !== undefined || obj['!GetAZs'] !== undefined) return ['us-west-2a', 'us-west-2b', 'us-west-2c'];
    if (obj['Fn::FindInMap'] || obj['!FindInMap']) return 'mapped-value';
    
    // Recursively resolve nested objects
    const resolved: any = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveIntrinsics(value, cfnResources);
    }
    return resolved;
  }
  
  return obj;
}

export function buildResourceRegistry(templates: Record<string, any>): ResourceRegistry {
  const registry: ResourceRegistry = { resources: {}, exports: {}, parameters: {} };
  
  for (const [templateName, template] of Object.entries(templates)) {
    // Collect resources
    if (template.Resources) {
      Object.assign(registry.resources, template.Resources);
    }
    
    // Collect exports
    if (template.Outputs) {
      for (const [outputName, output] of Object.entries(template.Outputs)) {
        const outputObj = output as any;
        if (outputObj.Export && outputObj.Export.Name) {
          const exportName = resolveIntrinsics(outputObj.Export.Name);
          const exportValue = resolveIntrinsics(outputObj.Value, template.Resources);
          registry.exports[exportName] = exportValue;
        }
      }
    }
    
    // Collect parameters
    if (template.Parameters) {
      for (const [paramName, param] of Object.entries(template.Parameters)) {
        const paramObj = param as any;
        registry.parameters[paramName] = paramObj.Default || `param-${paramName}`;
      }
    }
  }
  
  return registry;
}