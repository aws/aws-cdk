import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import { enhanceXmlWithFormattedFailures } from './xml-processor';

function reverseFilenames(xmlContent: string, fileMapping: Map<string, string>): string {
  return xmlContent.replace(/<testsuite name="([^"]*)"/g, (match, safeName) => {

    let currentName = safeName;
    let resolved = fileMapping.get(currentName);
    
    // Recursively resolve until no more mappings exist
    while (resolved && resolved !== currentName) {
      currentName = resolved;
      resolved = fileMapping.get(currentName);
    }
    
    const finalName = currentName;
    
    return `<testsuite name="${finalName}" file="${finalName}"`;
  });
}

function postProcessXml(outputFile: string, fileMapping: Map<string, string>, type: string): void {
  if (fs.existsSync(outputFile)) {
    const xmlContent = fs.readFileSync(outputFile, 'utf8');
    let correctedXml = reverseFilenames(xmlContent, fileMapping);
    
    // Add type suffix to failure messages
    correctedXml = correctedXml.replace(/<failure message="([^"]*)"/g, (match, message) => {
      return `<failure message="${message} for Type: ${type}"`;
    });
    
    fs.writeFileSync(outputFile, correctedXml);
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