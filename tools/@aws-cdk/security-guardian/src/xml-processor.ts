import * as fs from 'fs';
import * as core from '@actions/core';
import { parseFailureMessage, formatFailures, createIndividualFailureXml } from './failure-parser';

export function enhanceXmlWithFormattedFailures(xmlFilePath: string): void {
  if (!fs.existsSync(xmlFilePath)) {
    core.warning(`XML file not found: ${xmlFilePath}`);
    return;
  }
  
  try {
    let xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
    
    // Extract file name from testsuite for annotations
    const testsuiteMatch = xmlContent.match(/<testsuite[^>]*name="([^"]*)"/);  
    const fileName = testsuiteMatch ? testsuiteMatch[1] : 'unknown';
    
    // Find all failure elements and enhance them - handle both message attribute and content
    xmlContent = xmlContent.replace(
      /<failure message="([^"]*)">([\s\S]*?)<\/failure>/g,
      (match, messageAttr, content) => {
        // Try content first (where the actual failure message is), then message attribute
        const rawMessage = content.trim() || messageAttr;
        
        const decodedMessage = rawMessage
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
        
        const failures = parseFailureMessage(decodedMessage, messageAttr);
        
        if (failures.length > 0) {
          return createIndividualFailureXml(failures, fileName);
        }
        
        return match;
      }
    );
    
    fs.writeFileSync(xmlFilePath, xmlContent);
    core.info(`Enhanced XML file with individual failure annotations: ${xmlFilePath}`);
  } catch (err) {
    core.warning(`Failed to enhance XML file ${xmlFilePath}: ${(err as Error).message}`);
  }
}