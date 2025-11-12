import * as core from '@actions/core';

export interface ParsedFailure {
  rule: string;
  type: string;
  resource: string;
  line: number;
  column: number;
  property: string;
  message: string;
}

export function parseFailureMessage(failureMessage: string, ruleFromAttribute?: string): ParsedFailure[] {
  const failures: ParsedFailure[] = [];
  
  // Extract rule and type from the beginning - handle the concatenated format
  let ruleMatch = failureMessage.match(/^([A-Z_]+) for Type: (\w+)/);
  let rule: string, type: string;
  
  if (ruleMatch) {
    [, rule, type] = ruleMatch;
  } else if (ruleFromAttribute) {
    // Try to extract from attribute if not found in content
    const attrMatch = ruleFromAttribute.match(/^([A-Z_]+) for Type: (\w+)/);
    if (!attrMatch) return failures;
    [, rule, type] = attrMatch;
  } else {
    return failures;
  }
  
  // Split by "Check was not compliant" to separate individual failures
  const checks = failureMessage.split('Check was not compliant as property ').slice(1);
  
  for (const check of checks) {
    try {
      // Extract property path - find the complete bracketed property
      const propertyStart = check.indexOf('[');
      const propertyEnd = check.indexOf(']', propertyStart + 1);
      if (propertyStart === -1 || propertyEnd === -1) continue;
      
      // Find the actual end by counting brackets
      let bracketCount = 0;
      let actualEnd = propertyStart;
      for (let i = propertyStart; i < check.length; i++) {
        if (check[i] === '[') bracketCount++;
        if (check[i] === ']') {
          bracketCount--;
          if (bracketCount === 0) {
            actualEnd = i;
            break;
          }
        }
      }
      
      const property = check.substring(propertyStart + 1, actualEnd);
      
      // Extract path with line and column info
      const pathMatch = check.match(/Path=([^\[]+)\[L:(\d+),C:(\d+)\]/);
      if (!pathMatch) continue;
      
      const [, resourcePath, lineStr, columnStr] = pathMatch;
      const line = parseInt(lineStr, 10);
      const column = parseInt(columnStr, 10);
      
      // Extract resource name from path
      const resourceMatch = resourcePath.match(/\/Resources\/([^\/]+)/);
      const resource = resourceMatch ? resourceMatch[1] : resourcePath.trim();
      
      // Extract the descriptive message - get text after the property bracket and before "Value traversed to"
      const beforeValue = check.split('Value traversed to')[0];
      const messageStart = actualEnd + 1; // After the closing bracket
      const message = beforeValue.substring(messageStart).trim();
      
      failures.push({
        rule,
        type,
        resource,
        line,
        column,
        property,
        message
      });
    } catch (err) {
      core.warning(`Failed to parse failure check: ${err}`);
    }
  }
  
  return failures;
}

export function formatFailures(failures: ParsedFailure[]): string {
  if (failures.length === 0) return '';
  
  const { rule, type } = failures[0];
  let output = `Rule: ${rule} (Type: ${type})\n`;
  output += '='.repeat(50) + '\n\n';
  
  failures.forEach((failure, index) => {
    output += `${index + 1}. Resource: ${failure.resource}\n`;
    output += `   Location: Line ${failure.line}, Column ${failure.column}\n`;
    output += `   Property: ${failure.property}\n`;
    output += `   Issue: ${failure.message}\n\n`;
  });
  
  return output;
}

export function createIndividualFailureXml(failures: ParsedFailure[], fileName: string): string {
  if (failures.length === 0) return '';
  
  const { rule, type } = failures[0];
  
  return failures.map(failure => {
    const message = `${rule}: ${failure.message} (Property: ${failure.property})`;
    return `<failure message="${escapeXml(message)}" type="${type}" file="${fileName}" line="${failure.line}" column="${failure.column}"></failure>`;
  }).join('\n');
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}