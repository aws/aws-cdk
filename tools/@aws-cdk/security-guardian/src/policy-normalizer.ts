// IAM Policy Normalizer
// Based on Amazon's AcatCfnLintUtils policy normalizer

import { resolveIntrinsics } from './cfn-resolver';

export class IAMPolicyNormalizer {
  private cfnResources: Record<string, any>;

  constructor(cfnResources: Record<string, any> = {}) {
    this.cfnResources = cfnResources;
  }

  private normalizeGeneric(value: any): any {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }
    
    if (Array.isArray(value)) {
      return value.map(item => this.normalizeGeneric(item));
    }
    
    if (typeof value === 'object' && value !== null) {
      // Try to resolve as CFN intrinsic function
      const resolved = resolveIntrinsics(value, this.cfnResources);
      if (resolved !== value) {
        return resolved;
      }
      
      // Recursively normalize object properties
      const normalized: any = {};
      for (const [k, v] of Object.entries(value)) {
        normalized[this.normalizeGeneric(k)] = this.normalizeGeneric(v);
      }
      return normalized;
    }
    
    return null;
  }

  private normalizeStatement(statement: any, fieldsToNormalize: string[]): any {
    const normalized = { ...statement };
    
    for (const field of fieldsToNormalize) {
      if (field in statement) {
        normalized[field] = this.normalizeGeneric(statement[field]);
      }
    }
    
    return normalized;
  }

  normalizeIAMPolicy(policy: any, fieldsToNormalize: string[] = ['Principal', 'Resource']): any {
    if (!policy || !policy.Statement) {
      return policy;
    }

    const statements = Array.isArray(policy.Statement) ? policy.Statement : [policy.Statement];
    const normalizedStatements = statements.map((stmt: any) => 
      this.normalizeStatement(stmt, fieldsToNormalize)
    );

    return {
      Version: policy.Version || '2012-10-17',
      Statement: normalizedStatements
    };
  }

  private fieldNeedsNormalization(fieldValue: any): boolean {
    if (Array.isArray(fieldValue)) {
      return fieldValue.some(v => this.fieldNeedsNormalization(v));
    }
    
    if (typeof fieldValue === 'object' && fieldValue !== null) {
      // Check if it's a CFN intrinsic function
      const resolved = resolveIntrinsics(fieldValue, this.cfnResources);
      if (resolved !== fieldValue) {
        return true;
      }
      
      return Object.values(fieldValue).some(v => this.fieldNeedsNormalization(v));
    }
    
    return false;
  }

  getUnnormalizedFields(policy: any): Set<string> {
    const needNormalization = new Set<string>();
    
    if (!policy || !policy.Statement) {
      return needNormalization;
    }

    const statements = Array.isArray(policy.Statement) ? policy.Statement : [policy.Statement];
    
    for (const statement of statements) {
      for (const [fieldName, fieldValue] of Object.entries(statement)) {
        if (this.fieldNeedsNormalization(fieldValue)) {
          needNormalization.add(fieldName);
        }
      }
    }
    
    return needNormalization;
  }
}