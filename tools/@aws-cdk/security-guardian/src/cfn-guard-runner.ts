import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';

function reverseFilenames(xmlContent: string, fileMapping: Map<string, string>): string {
  return xmlContent.replace(/<testsuite name="([^"]*)"/g, (match, safeName) => {
    let currentName = safeName;
    let resolved = fileMapping.get(currentName);
    
    while (resolved && resolved !== currentName) {
      currentName = resolved;
      resolved = fileMapping.get(currentName);
    }
    
    const finalName = currentName;
    return `<testsuite name="${finalName}" file="${finalName}"`;
  });
}

export function postProcessXml(outputFile: string, fileMapping: Map<string, string>, type: string): void {
  if (fs.existsSync(outputFile)) {
    const xmlContent = fs.readFileSync(outputFile, 'utf8');
    let correctedXml = reverseFilenames(xmlContent, fileMapping);
    
    correctedXml = correctedXml.replace(/<failure message="([^"]*)"/g, (match, message) => {
      return `<failure message="[Type: ${type}] ${message}"`;
    });
    
    fs.writeFileSync(outputFile, correctedXml);
  }
}

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
        // Extract and concatenate all custom messages from {{...}} in the body
        const customMsgMatch = content.match(/##ERROR:([\s\S]*?)##/);
        const customMsg = customMsgMatch ? customMsgMatch[1] : messageAttr;
        let splitContent = content.replace(/##ERROR:([\s\S]*?)##/g, '');
        splitContent = splitContent.replace(/Check was not compliant as property/g, '\nCheck was not compliant as property');
        return `<failure message="${customMsg}">${splitContent}</failure>`;
      }
    );
    
    fs.writeFileSync(xmlFilePath, xmlContent);
    core.info(`Enhanced XML file with split failure content: ${xmlFilePath}`);
  } catch (err) {
    core.warning(`Failed to enhance XML file ${xmlFilePath}: ${(err as Error).message}`);
  }
}

export async function runCfnGuardValidation(
  dataDir: string,
  ruleSetPath: string,
  outputFile: string,
  type: string,
  fileMapping: Map<string, string>,
  enhanceXml: boolean = true
): Promise<boolean> {
  try {
    await exec.exec('sh', [
      '-c',
      `cfn-guard validate --data "${dataDir}" --rules "${ruleSetPath}" --output-format junit --structured --show-summary none > "${outputFile}"`
    ]);
    
    if (enhanceXml) {
      enhanceXmlWithFormattedFailures(outputFile);
    }
    postProcessXml(outputFile, fileMapping, type);
    
    core.info(`✅ CFN-Guard (${type}) validation passed`);
    return true;
  } catch (err) {
    core.warning(`⚠️ CFN-Guard (${type}) validation found issues`);
    
    if (enhanceXml) {
      enhanceXmlWithFormattedFailures(outputFile);
    }
    postProcessXml(outputFile, fileMapping, type);
    
    return false;
  }
}