import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';

// Extensible exemption rules for different AWS resources
const EXEMPTION_RULES = {
  'AWS::KMS::Key': {
    docs: 'https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html#key-policy-default',
    isDefaultPolicy: (statement: any) => (
      statement.Sid === 'Enable IAM User Permissions' &&
      statement.Effect === 'Allow' &&
      statement.Action === 'kms:*' &&
      statement.Resource === '*'
    )
  }
  // Add more resources here as needed:
  // 'AWS::S3::Bucket': { ... },
  // 'AWS::SNS::Topic': { ... }
};

export async function runScan(dataDir: string) {
  let issuesFound = 0;
  let matches: Array<{ filePath: string, statements: any[], resourceType?: string }> = [];
  let totalFiles = 0;

  function hasRootPrincipal(principal: any): boolean {
    if (typeof principal !== 'object' || principal == null) return false;
    
    const awsPrincipal = principal.AWS;
    
    // Check Fn::Join patterns
    if (typeof awsPrincipal === 'object' && awsPrincipal['Fn::Join']) {
      const joinArgs = awsPrincipal['Fn::Join'];
      if (Array.isArray(joinArgs) && joinArgs.length === 2) {
        const parts = joinArgs[1];
        if (Array.isArray(parts)) {
          const joined = parts.map(p => typeof p === 'string' ? p : '').join('');
          return joined.endsWith(':root');
        }
      }
    }
    
    // Check direct string patterns
    if (typeof awsPrincipal === 'string') {
      return awsPrincipal.includes(':root');
    }
    
    // Check arrays
    if (Array.isArray(awsPrincipal)) {
      return awsPrincipal.some(p => typeof p === 'string' && p.includes(':root'));
    }
    
    return false;
  }

  function hasCrossAccountWildcard(principal: any): boolean {
    if (typeof principal !== 'object' || principal == null) return false;
    
    const awsPrincipal = principal.AWS;
    
    // Check for cross-account wildcards like "arn:aws:iam::*:root" or "*"
    if (typeof awsPrincipal === 'string') {
      return awsPrincipal === '*' || awsPrincipal.includes('arn:aws:iam::*');
    }
    
    if (Array.isArray(awsPrincipal)) {
      return awsPrincipal.some(p => 
        typeof p === 'string' && (p === '*' || p.includes('arn:aws:iam::*'))
      );
    }
    
    return false;
  }

  function shouldExemptStatement(statement: any, resourceType: string): boolean {
    const rule = EXEMPTION_RULES[resourceType as keyof typeof EXEMPTION_RULES];
    if (!rule) return false;
    
    if (rule.isDefaultPolicy(statement) && hasRootPrincipal(statement.Principal)) {
      core.info(`Exempting ${resourceType} default policy (see: ${rule.docs})`);
      return true;
    }
    
    return false;
  }

  function isDangerousRootAccess(statement: any, resourceType?: string): boolean {
    if (typeof statement !== 'object' || statement == null) return false;
    if (statement.Effect !== 'Allow') return false;
    if (!statement.Principal) return false;

    // Always flag cross-account wildcards - these are dangerous
    if (hasCrossAccountWildcard(statement.Principal)) {
      return true;
    }

    // Check for root access
    if (!hasRootPrincipal(statement.Principal)) {
      return false;
    }

    // Apply exemptions for known safe default policies
    if (resourceType && shouldExemptStatement(statement, resourceType)) {
      return false;
    }

    // Flag all other root access
    return true;
  }

  function findMatchingStatements(obj: any, resourceType?: string): any[] {
    const results: any[] = [];

    if (Array.isArray(obj)) {
      for (const item of obj) {
        results.push(...findMatchingStatements(item, resourceType));
      }
    } else if (typeof obj === 'object' && obj !== null) {
      // Detect resource type from CloudFormation template structure
      if (obj.Type && typeof obj.Type === 'string') {
        resourceType = obj.Type;
      }
      
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'Statement') {
          const stmts = Array.isArray(value) ? value : [value];
          for (const stmt of stmts) {
            if (isDangerousRootAccess(stmt, resourceType)) {
              results.push({ statement: stmt, resourceType });
            }
          }
        } else {
          results.push(...findMatchingStatements(value, resourceType));
        }
      }
    }

    return results;
  }

  function walkDir(dir: string, fileCallback: (filePath: string) => void) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath, fileCallback);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        fileCallback(fullPath);
      }
    }
  }

  core.info(`Scanning JSON files in: ${dataDir}`);

  walkDir(dataDir, filePath => {
    totalFiles++;
    core.info(`Processing: ${filePath}`);
    let data;

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(content);
    } catch (err) {
      core.warning(`Skipping ${filePath}: ${(err as Error).message}`);
      return;
    }

    const found = findMatchingStatements(data);
    if (found.length > 0) {
      core.info(`Match found in: ${filePath} (statements: ${found.length})`);
      
      // Extract statements and resource types
      const statements = found.map(f => f.statement || f);
      const resourceType = found.find(f => f.resourceType)?.resourceType;
      
      matches.push({ filePath, statements, resourceType });
      issuesFound += found.length;
    }
  });

  // Build human-readable detailed output
  let detailedOutput = '';
  for (const match of matches) {
    detailedOutput += `File: ${match.filePath}`;
    if (match.resourceType) {
      detailedOutput += ` (Resource: ${match.resourceType})`;
    }
    detailedOutput += '\n';
    
    for (const stmt of match.statements) {
      detailedOutput += `${JSON.stringify(stmt, null, 2)} |n| `;
    }
    detailedOutput += '='.repeat(60) + '\n';
  }

  // Set the output for GitHub Actions
  core.info(`detailed_output ${detailedOutput.trim()}`);

  core.info('\n Scan complete!');
  core.info(` Files scanned : ${totalFiles}`);
  core.info(` Matches found : ${matches.length}`);

  return issuesFound;
}
