import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';

function reverseFilenames(xmlContent: string, fileMapping: Map<string, string>): string {
  return xmlContent.replace(/<testsuite name="([^"]*)"/g, (match, safeName) => {
    const originalName = fileMapping.get(safeName) || safeName;
    return `<testsuite name="${originalName}" file="${originalName}"`;
  });
}

function postProcessXml(outputFile: string, fileMapping: Map<string, string>): void {
  if (fs.existsSync(outputFile)) {
    const xmlContent = fs.readFileSync(outputFile, 'utf8');
    const correctedXml = reverseFilenames(xmlContent, fileMapping);
    fs.writeFileSync(outputFile, correctedXml);
  }
}

export async function runCfnGuardValidation(
  dataDir: string,
  ruleSetPath: string,
  outputFile: string,
  type: string,
  fileMapping: Map<string, string>
): Promise<boolean> {
  try {
    await exec.exec('sh', [
      '-c',
      `cfn-guard validate --data "${dataDir}" --rules "${ruleSetPath}" --output-format junit --structured --show-summary none > "${outputFile}"`
    ]);
    
    postProcessXml(outputFile, fileMapping);
    
    core.info(`✅ CFN-Guard (${type}) validation passed`);
    return true;
  } catch (err) {
    core.warning(`⚠️ CFN-Guard (${type}) validation found issues`);
    
    postProcessXml(outputFile, fileMapping);
    
    return false;
  }
}