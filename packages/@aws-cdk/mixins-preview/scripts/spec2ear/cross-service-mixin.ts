import { Module, ClassType, Type, Stability, expr, stmt, $this, ThingSymbol, ExternalModule, MemberVisibility } from '@cdklabs/typewriter';
import { TypeScriptRenderer } from '@cdklabs/typewriter/lib/renderer/typescript';
import { MIXINS_CORE, MIXINS_KMS, type EncryptionAtRestData } from './helpers';
import { CONSTRUCTS } from '@aws-cdk/spec2cdk/lib/cdk/cdk';
import * as fs from 'node:fs';
import * as path from 'node:path';

export async function generateCrossServiceMixin(outputPath: string, encryptionData: EncryptionAtRestData): Promise<void> {
  // Services to skip (SAM/Serverless resources don't have CDK modules)
  const skipServices = new Set(['serverless', 'sam']);

  // Categorize resources by KMS key support
  type KmsSupport = 'required' | 'optional' | 'none';
  const resourcesByService = new Map<string, { cfnType: string; resourceName: string; kmsSupport: KmsSupport }[]>();

  for (const cfnType of Object.keys(encryptionData)) {
    const match = cfnType.match(/^AWS::(\w+)::(\w+)$/);
    if (!match) continue;

    const [, service, resource] = match;
    const serviceLower = service.toLowerCase();
    if (skipServices.has(serviceLower)) continue;

    const config = encryptionData[cfnType];
    const kmsKeyProp = config.properties.find(p => p.purpose === 'kms-key-id');
    let kmsSupport: KmsSupport = 'none';
    if (kmsKeyProp) {
      kmsSupport = kmsKeyProp.required ? 'required' : 'optional';
    }

    const moduleName = `aws-${serviceLower}`;
    if (!resourcesByService.has(moduleName)) {
      resourcesByService.set(moduleName, []);
    }
    resourcesByService.get(moduleName)!.push({ cfnType, resourceName: resource, kmsSupport });
  }

  // Create module
  const module = new Module('@aws-cdk/mixins-preview/mixins/encryption-at-rest');

  // Import core types
  CONSTRUCTS.import(module, 'constructs');
  MIXINS_CORE.import(module, 'core', { fromLocation: '../core' });
  MIXINS_KMS.import(module, 'kms');

  // Import service modules
  const sortedServices = [...resourcesByService.keys()].sort();
  for (const moduleName of sortedServices) {
    const alias = moduleName.replace(/-/g, '_');
    const serviceModule = new ExternalModule(`@aws-cdk/mixins-preview/services/${moduleName}/mixins`);
    serviceModule.import(module, alias, { fromLocation: `../services/${moduleName}/mixins` });
  }

  // Build factory entries based on KMS support
  const factoryEntries: string[] = [];
  for (const moduleName of sortedServices) {
    const alias = moduleName.replace(/-/g, '_');
    const resources = resourcesByService.get(moduleName)!;
    for (const { cfnType, resourceName, kmsSupport } of resources) {
      const mixinClass = `${alias}.Cfn${resourceName}EncryptionAtRestMixin`;
      switch (kmsSupport) {
        case 'required':
          // KMS key required - only create if key provided
          factoryEntries.push(`  '${cfnType}': (key?: kms.IKey) => key ? new ${mixinClass}(key) : undefined,`);
          break;
        case 'optional':
          // KMS key optional - pass through
          factoryEntries.push(`  '${cfnType}': (key?: kms.IKey) => new ${mixinClass}(key),`);
          break;
        case 'none':
          // No KMS support - don't pass key
          factoryEntries.push(`  '${cfnType}': () => new ${mixinClass}(),`);
          break;
      }
    }
  }

  // Calculate resource count
  const resourceCount = [...resourcesByService.values()].reduce((acc, r) => acc + r.length, 0);

  // Create the EncryptionAtRest class
  const encryptionAtRestClass = new ClassType(module, {
    export: true,
    name: 'EncryptionAtRest',
    extends: MIXINS_CORE.Mixin,
    implements: [MIXINS_CORE.IMixin],
    docs: {
      summary: 'Cross-service encryption at rest mixin.',
      remarks: `Applies encryption at rest configuration to any supported AWS resource.\nSupports ${resourceCount} CloudFormation resource types across ${resourcesByService.size} AWS services.`,
      stability: Stability.External,
      example: [
        '// Apply to a single resource',
        "const bucket = new s3.CfnBucket(scope, 'Bucket');",
        'Mixins.of(bucket).apply(new EncryptionAtRest());',
        '',
        '// Apply to all resources in a scope',
        'Mixins.of(scope).apply(new EncryptionAtRest());',
        '',
        '// With customer-managed KMS key',
        "const key = new kms.Key(scope, 'Key');",
        'Mixins.of(scope).apply(new EncryptionAtRest(key));',
      ].join('\n'),
    },
  });

  // Add static property
  encryptionAtRestClass.addProperty({
    name: 'SUPPORTED_RESOURCE_TYPES',
    type: Type.arrayOf(Type.STRING),
    static: true,
    immutable: true,
    initializer: expr.directCode('Object.keys(MIXIN_FACTORIES)'),
    docs: { summary: 'Returns the list of supported CloudFormation resource types.' },
  });

  // Add instance properties
  encryptionAtRestClass.addProperty({
    name: 'kmsKey',
    type: MIXINS_KMS.IKey,
    protected: true,
    immutable: true,
    optional: true,
  });

  encryptionAtRestClass.addProperty({
    name: 'mixinCache',
    type: Type.ambient('Map<string, core.IMixin>'),
    visibility: MemberVisibility.Private,
    immutable: true,
    initializer: expr.directCode('new Map<string, core.IMixin>()'),
  });

  // Constructor
  const ctor = encryptionAtRestClass.addInitializer({
    docs: { summary: 'Creates a cross-service encryption at rest mixin.' },
  });

  const kmsKeyParam = ctor.addParameter({
    name: 'kmsKey',
    type: MIXINS_KMS.IKey,
    optional: true,
    documentation: 'Optional KMS key for customer-managed encryption. If not provided, uses AWS managed keys where applicable. Resources that require a KMS key will be skipped if none is provided.',
  });

  ctor.addBody(
    expr.sym(new ThingSymbol('super', module)).call(),
    stmt.assign($this.kmsKey, kmsKeyParam),
  );

  // supports method
  const supportsMethod = encryptionAtRestClass.addMethod({
    name: 'supports',
    returnType: Type.BOOLEAN,
    docs: { summary: 'Check if this mixin supports the given construct.' },
  });

  supportsMethod.addParameter({
    name: 'construct',
    type: CONSTRUCTS.IConstruct,
  });

  supportsMethod.addBody(
    stmt.constVar(expr.ident('cfnType'), expr.directCode('(construct as any).cfnResourceType')),
    stmt.ret(expr.directCode('cfnType !== undefined && cfnType in MIXIN_FACTORIES')),
  );

  // applyTo method
  const applyToMethod = encryptionAtRestClass.addMethod({
    name: 'applyTo',
    returnType: Type.VOID,
    docs: { summary: 'Apply encryption at rest configuration to the construct.' },
  });

  applyToMethod.addParameter({
    name: 'construct',
    type: CONSTRUCTS.IConstruct,
  });

  applyToMethod.addBody(
    stmt.constVar(expr.ident('cfnType'), expr.directCode('(construct as any).cfnResourceType')),
    stmt.if_(expr.directCode('!cfnType || !(cfnType in MIXIN_FACTORIES)')).then(stmt.ret()),
    stmt.constVar(expr.ident('mixin'), expr.directCode('this.mixinCache.get(cfnType) ?? MIXIN_FACTORIES[cfnType](this.kmsKey)')),
    stmt.if_(expr.not(expr.ident('mixin'))).then(stmt.ret()),
    expr.directCode('this.mixinCache.set(cfnType, mixin)'),
    expr.directCode('mixin.applyTo(construct)'),
  );

  // Render module
  const renderer = new TypeScriptRenderer({ disabledEsLintRules: ['@stylistic/max-len'] });
  const rendered = renderer.render(module);

  // Insert factory map after imports (find the class definition and insert before it)
  const factoryMap = `\nconst MIXIN_FACTORIES: Record<string, (key?: kms.IKey) => core.IMixin | undefined> = {\n${factoryEntries.sort().join('\n')}\n};\n`;
  const classIndex = rendered.indexOf('/**\n * Cross-service');
  const output = rendered.slice(0, classIndex) + factoryMap + rendered.slice(classIndex);

  const outputFile = path.join(outputPath, '..', 'mixins', 'encryption-at-rest.generated.ts');
  await fs.promises.writeFile(outputFile, output);
}
