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
      return `<failure message="${message} for Type: ${type}"`;
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
    
    postProcessXml(outputFile, fileMapping, type);
    if (enhanceXml) {
      enhanceXmlWithFormattedFailures(outputFile);
    }
    
    core.info(`✅ CFN-Guard (${type}) validation passed`);
    return true;
  } catch (err) {
    core.warning(`⚠️ CFN-Guard (${type}) validation found issues`);
    
    postProcessXml(outputFile, fileMapping, type);
    if (enhanceXml) {
      enhanceXmlWithFormattedFailures(outputFile);
    }
    
    return false;
  }
}