import * as fs from 'fs';
import * as core from '@actions/core';

export function enhanceXmlWithFormattedFailures(xmlFilePath: string): void {
  if (!fs.existsSync(xmlFilePath)) {
    core.warning(`XML file not found: ${xmlFilePath}`);
    return;
  }
  
  try {
    let xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
    
    // Split failure content into new lines based on "Check was not compliant as property"
    xmlContent = xmlContent.replace(
      /<failure message="([^"]*)">([\s\S]*?)<\/failure>/g,
      (match, messageAttr, content) => {
        const splitContent = content.replace(/Check was not compliant as property/g, '\nCheck was not compliant as property');
        return `<failure message="${messageAttr}">${splitContent}</failure>`;
      }
    );
    
    fs.writeFileSync(xmlFilePath, xmlContent);
    core.info(`Enhanced XML file with split failure content: ${xmlFilePath}`);
  } catch (err) {
    core.warning(`Failed to enhance XML file ${xmlFilePath}: ${(err as Error).message}`);
  }
}