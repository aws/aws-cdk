// CFN Intrinsic Function Resolver
// Enhanced version with cross-stack reference support

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

const RESOURCE_ATTRIBUTES = {
  'AWS::IAM::Role': {
    'Arn': (name: string) => `arn:aws:iam::123456789012:role/${name}`,
    'RoleId': () => 'AIDACKCEVSQ6C2EXAMPLE'
  },
  'AWS::Lambda::Function': {
    'Arn': (name: string) => `arn:aws:lambda:us-west-2:123456789012:function:${name}`,
    'FunctionName': (name: string) => name
  },
  'AWS::EC2::Instance': {
    'AvailabilityZone': () => 'us-west-2a',
    'PrivateDnsName': () => 'ip-10-0-0-1.us-west-2.compute.internal',
    'PrivateIp': () => '10.0.0.1',
    'PublicDnsName': () => 'ec2-203-0-113-12.us-west-2.compute.amazonaws.com',
    'PublicIp': () => '203.0.113.12'
  },
  'AWS::S3::Bucket': {
    'Arn': (name: string) => `arn:aws:s3:::${name}`,
    'DomainName': (name: string) => `${name}.s3.amazonaws.com`,
    'WebsiteURL': (name: string) => `http://${name}.s3-website-us-west-2.amazonaws.com`
  },
  'AWS::SQS::Queue': {
    'Arn': (name: string) => `arn:aws:sqs:us-west-2:123456789012:${name}`,
    'QueueName': (name: string) => name
  },
  'AWS::SNS::Topic': {
    'Arn': (name: string) => `arn:aws:sns:us-west-2:123456789012:${name}`,
    'TopicName': (name: string) => name
  },
  'AWS::KMS::Key': {
    'Arn': (name: string) => `arn:aws:kms:us-west-2:123456789012:key/${name}`,
    'KeyId': (name: string) => name
  }
};

let globalRegistry: ResourceRegistry = { resources: {}, exports: {}, parameters: {} };

export function setGlobalRegistry(registry: ResourceRegistry): void {
  globalRegistry = registry;
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
      return CLOUDFORMATION_PSEUDOPARAMETERS[obj.Ref as keyof typeof CLOUDFORMATION_PSEUDOPARAMETERS] || obj.Ref;
    }
    
    // Handle Fn::Join
    if (obj['Fn::Join'] || obj['!Join']) {
      const content = obj['Fn::Join'] || obj['!Join'];
      const delimiter = resolveIntrinsics(content[0], cfnResources);
      const parts = content[1].map((part: any) => resolveIntrinsics(part, cfnResources));
      return parts.join(delimiter);
    }
    
    // Handle Fn::Sub
    if (obj['Fn::Sub'] || obj['!Sub']) {
      const content = obj['Fn::Sub'] || obj['!Sub'];
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
      
      // Replace variables first
      for (const [k, v] of Object.entries(variables)) {
        const value = typeof v === 'string' ? v : String(v);
        template = template.replace(new RegExp(`\\$\\{${k}\\}`, 'g'), value);
      }
      
      // Replace AWS pseudoparameters
      for (const [k, v] of Object.entries(CLOUDFORMATION_PSEUDOPARAMETERS)) {
        template = template.replace(new RegExp(`\\$\\{${k}\\}`, 'g'), v);
      }
      
      // Handle .Arn pattern (common false positive fix)
      template = template.replace(/\$\{([\w_-]+\.Arn)\}/g, 'arn:aws:s3:::examplebucket');
      
      // Replace remaining parameters
      template = template.replace(/\$\{([\w_-]+)\}/g, '$1');
      
      return template;
    }
    
    // Handle Fn::GetAtt
    if (obj['Fn::GetAtt'] || obj['!GetAtt']) {
      const content = obj['Fn::GetAtt'] || obj['!GetAtt'];
      let logicalName: string;
      let attributeName: string;
      
      if (typeof content === 'string') {
        [logicalName, attributeName] = content.split('.');
      } else {
        logicalName = content[0];
        attributeName = content[1];
      }
      
      // Try local resources first
      if (cfnResources && cfnResources[logicalName]) {
        const resourceType = cfnResources[logicalName].Type;
        const attributes = RESOURCE_ATTRIBUTES[resourceType as keyof typeof RESOURCE_ATTRIBUTES];
        if (attributes && attributes[attributeName as keyof typeof attributes]) {
          const attrFunc = attributes[attributeName as keyof typeof attributes] as Function;
          return attrFunc(logicalName);
        }
      }
      
      // Try global registry
      if (globalRegistry.resources[logicalName]) {
        const resourceType = globalRegistry.resources[logicalName].Type;
        const attributes = RESOURCE_ATTRIBUTES[resourceType as keyof typeof RESOURCE_ATTRIBUTES];
        if (attributes && attributes[attributeName as keyof typeof attributes]) {
          const attrFunc = attributes[attributeName as keyof typeof attributes] as Function;
          return attrFunc(logicalName);
        }
      }
      
      return `${logicalName}.${attributeName}`;
    }
    
    // Handle Fn::ImportValue
    if (obj['Fn::ImportValue']) {
      const exportName = resolveIntrinsics(obj['Fn::ImportValue'], cfnResources);
      if (globalRegistry.exports[exportName]) {
        return globalRegistry.exports[exportName];
      }
      // Parse export name for common patterns
      if (exportName.includes('PublicIp')) return '203.0.113.12';
      if (exportName.includes('PrivateIp')) return '10.0.0.1';
      if (exportName.includes('Arn')) return 'arn:aws:s3:::example-bucket';
      return `imported-${exportName}`;
    }
    
    // Handle Fn::Select
    if (obj['Fn::Select']) {
      const content = obj['Fn::Select'];
      const index = resolveIntrinsics(content[0], cfnResources);
      const list = resolveIntrinsics(content[1], cfnResources);
      if (Array.isArray(list) && typeof index === 'number') {
        return list[index] || list[0] || 'selected-value';
      }
      return 'selected-value';
    }
    
    // Handle Fn::Split
    if (obj['Fn::Split']) {
      const content = obj['Fn::Split'];
      const delimiter = resolveIntrinsics(content[0], cfnResources);
      const source = resolveIntrinsics(content[1], cfnResources);
      if (typeof source === 'string' && typeof delimiter === 'string') {
        return source.split(delimiter);
      }
      return ['split', 'result'];
    }
    
    // Handle Fn::Cidr
    if (obj['Fn::Cidr']) {
      const content = obj['Fn::Cidr'];
      const ipBlock = resolveIntrinsics(content[0], cfnResources);
      const count = resolveIntrinsics(content[1], cfnResources);
      const cidrBits = resolveIntrinsics(content[2], cfnResources);
      const result = [];
      for (let i = 0; i < Math.min(count, 4); i++) {
        result.push(`10.0.${i * 64}.0/${32 - cidrBits}`);
      }
      return result;
    }
    
    // Handle other functions
    if (obj['Fn::Base64']) {
      const content = resolveIntrinsics(obj['Fn::Base64'], cfnResources);
      return Buffer.from(String(content)).toString('base64');
    }
    if (obj['Fn::GetAZs']) return ['us-west-2a', 'us-west-2b', 'us-west-2c'];
    if (obj['Fn::FindInMap']) return 'mapped-value';
    if (obj['Fn::Not']) return false;
    if (obj['Fn::Contains']) return false;
    
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