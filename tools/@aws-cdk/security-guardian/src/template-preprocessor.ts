import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import { resolveIntrinsics, buildResourceRegistry, setGlobalRegistry } from './cfn-resolver';
import { IAMPolicyNormalizer } from './policy-normalizer';

function processTemplate(obj: any, cfnResources: Record<string, any>): any {
  // First resolve intrinsics at this level
  const resolved = resolveIntrinsics(obj, cfnResources);
  
  if (typeof resolved !== 'object' || resolved === null) {
    return resolved;
  }

  if (Array.isArray(resolved)) {
    return resolved.map(item => processTemplate(item, cfnResources));
  }

  const processed: any = {};
  for (const [key, value] of Object.entries(resolved)) {
    if (key === 'PolicyDocument' || key === 'AssumeRolePolicyDocument' || key === 'Policy') {
      // Normalize policies after resolving intrinsics
      const normalizer = new IAMPolicyNormalizer(cfnResources);
      const unnormalizedFields = normalizer.getUnnormalizedFields(value);
      const defaultFields = ['Principal', 'Resource'];
      const fieldsToNormalize = new Set([...defaultFields, ...unnormalizedFields]);
      
      if (fieldsToNormalize.size > 0) {
        core.info(`Normalizing fields: ${Array.from(fieldsToNormalize).join(', ')} in ${key}`);
      }
      processed[key] = normalizer.normalizeIAMPolicy(value, Array.from(fieldsToNormalize));
    } else {
      // Recursively process all other values
      processed[key] = processTemplate(value, cfnResources);
    }
  }

  return processed;
}

function walkDir(dir: string, callback: (filePath: string) => void) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      callback(fullPath);
    }
  }
}

export function preprocessTemplates(sourceDir: string, targetDir: string): { files: string[], mapping: Map<string, string> } {

  const processedFiles: string[] = [];
  const resolvedMapping = new Map<string, string>();
  const allTemplates: Record<string, any> = {};

  // Phase 1: Load all templates
  core.info('Phase 1: Loading all templates for cross-stack analysis');
  walkDir(sourceDir, (filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const template = JSON.parse(content);
      const templateName = path.basename(filePath, '.json');
      allTemplates[templateName] = template;
    } catch (err) {
      core.warning(`Failed to load ${filePath}: ${(err as Error).message}`);
    }
  });

  // Phase 2: Build resource registry
  core.info('Phase 2: Building cross-stack resource registry');
  const registry = buildResourceRegistry(allTemplates);
  setGlobalRegistry(registry);
  core.info(`Registry built: ${Object.keys(registry.resources).length} resources, ${Object.keys(registry.exports).length} exports`);

  // Phase 3: Process templates with full context
  core.info('Phase 3: Processing templates with resolved intrinsics');
  walkDir(sourceDir, (filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const template = JSON.parse(content);
      
      // Extract CFN resources for context
      const cfnResources = template.Resources || {};
      
      // Process template with intrinsic resolution and policy normalization
      const processedTemplate = processTemplate(template, cfnResources);
      
      // Write resolved template to target directory
      const relativePath = path.relative(sourceDir, filePath);
      const targetPath = path.join(targetDir, relativePath);
      
      // Ensure target directory exists
      const targetDirPath = path.dirname(targetPath);
      const sourceFilePath = path.join(sourceDir, path.basename(filePath));
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
      }
      
      fs.writeFileSync(targetPath, JSON.stringify(processedTemplate, null, 2));
      processedFiles.push(path.basename(filePath));
      resolvedMapping.set(path.resolve(targetPath), path.resolve(sourceFilePath));
      
      core.info(`Processed: ${path.basename(filePath)} → resolved copy`);
    } catch (err) {
      core.warning(`Failed to process ${filePath}: ${(err as Error).message}`);
    }
  });
  
  return { files: processedFiles, mapping: resolvedMapping };
}