# CDK プロジェクト Linter・フォーマッター設定ガイド

AWS CDK公式リポジトリで使用されているLinterとコードフォーマッターを自分のCDKプロジェクトに適用するための完全ガイド

---

## 目次

1. [使用されているツール概要](#1-使用されているツール概要)
2. [自分のCDKプロジェクトへの適用手順](#2-自分のcdkプロジェクトへの適用手順)
3. [WebStorm統合手順](#3-webstorm統合手順)
4. [設定のスコープについて](#4-設定のスコープについて)
5. [トラブルシューティング](#5-トラブルシューティング)

---

## 1. 使用されているツール概要

### 1.1 ESLint (主要なLinter)

- **設定パッケージ**: `@aws-cdk/eslint-config`
- **使用プラグイン**:
  - `typescript-eslint` - TypeScript対応
  - `@cdklabs/eslint-plugin` - CDK専用ルール（オプション）
  - `@stylistic/eslint-plugin` - コードスタイル
  - `eslint-plugin-import` - import文の検証
  - `eslint-plugin-jest` - Jestテスト用
  - `eslint-plugin-jsdoc` - JSDocコメント検証

### 1.2 Jest

- テストフレームワーク兼カバレッジツール
- カバレッジ閾値: branches/statements 80%

### 1.3 markdownlint-cli

- READMEなどのMarkdownファイルのlinting

### 1.4 TypeScript

- 厳格なコンパイラオプション設定

---

## 2. 自分のCDKプロジェクトへの適用手順

### ステップ1: 必要なパッケージのインストール

```bash
# ESLint関連
npm install --save-dev \
  eslint@^9 \
  typescript-eslint@^8 \
  @stylistic/eslint-plugin@^5 \
  eslint-import-resolver-node@^0.3.9 \
  eslint-import-resolver-typescript@^2.7.1 \
  eslint-plugin-import@^2.32.0 \
  eslint-plugin-jest@^28 \
  eslint-plugin-jsdoc@^50.8.0

# Jest関連(テストを使用する場合)
npm install --save-dev \
  jest@^29.7.0 \
  ts-jest@^29.4.6 \
  @types/jest@^29.5.14 \
  jest-junit@^13.2.0

# MarkdownLint
npm install --save-dev markdownlint-cli@^0.47.0

# TypeScript
npm install --save-dev typescript@~5.5.4
```

### ステップ2: ESLint設定ファイルの作成

プロジェクトルートに `eslint.config.mjs` を作成:

```javascript
import { defineConfig } from 'eslint/config';
import typescriptEslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import stylistic from '@stylistic/eslint-plugin';
import jest from 'eslint-plugin-jest';
import jsdoc from 'eslint-plugin-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(
  { ignores: ['**/*.js', 'node_modules/', 'cdk.out/', 'dist/'] },
  {
    name: 'my-cdk-project',
    files: ['**/*.ts'],
    ignores: ['**/*.d.ts', '**/*.generated.ts'],
    plugins: {
      '@stylistic': stylistic,
      jest,
      jsdoc,
    },
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        projectService: true,
      },
    },
    extends: [
      typescriptEslint.configs.base,
      jest.configs['flat/recommended'],
      importPlugin.flatConfigs.typescript,
    ],
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        node: {},
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // エラーハンドリング
      'no-throw-literal': ['error'],

      // TypeScript
      '@typescript-eslint/no-require-imports': ['error'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],

      // コードスタイル
      '@stylistic/indent': ['error', 2],
      'quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/no-extra-semi': ['error'],
      'comma-spacing': ['error', { before: false, after: true }],
      'no-multi-spaces': ['error'],
      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'keyword-spacing': ['error'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'space-before-blocks': 'error',
      'curly': ['error', 'multi-line', 'consistent'],
      'eol-last': ['error', 'always'],
      '@stylistic/spaced-comment': ['error', 'always', {
        'exceptions': ['/', '*'],
        'markers': ['/']
      }],
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
      'no-trailing-spaces': ['error'],
      'dot-notation': ['error'],
      'no-bitwise': ['error'],
      'max-len': ['error', {
        code: 150,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
      }],

      // Import
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          'test/**',
          '**/test/**',
        ],
        optionalDependencies: false,
      }],
      'import/no-unresolved': ['error'],
      'import/order': ['error', {
        groups: ['builtin', 'external'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      'import/no-duplicates': ['error'],

      // JSDoc
      'jsdoc/require-param-description': ['error'],
      'jsdoc/require-property-description': ['error'],
      'jsdoc/require-returns-description': ['error'],
      'jsdoc/check-alignment': ['error'],

      // Jest overrides
      'jest/expect-expect': 'off',
      'jest/no-conditional-expect': 'off',
      'jest/no-done-callback': 'off',
      'jest/no-standalone-expect': 'off',
      'jest/valid-expect': 'off',
      'jest/valid-title': 'off',
      'jest/no-disabled-tests': 'error',
      'jest/no-focused-tests': 'error',
    },
  }
);
```

### ステップ3: TypeScript設定

プロジェクトルートに `tsconfig.json` を作成（または既存のものを更新）:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["es2022"],
    "declaration": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "inlineSourceMap": true,
    "inlineSources": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "esModuleInterop": false,
    "isolatedModules": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "cdk.out"]
}
```

### ステップ4: Jest設定

プロジェクトルートに `jest.config.js` を作成:

```javascript
module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/test/**/?(*.)+(test).ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  maxWorkers: '50%',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      statements: 80,
    },
  },
  collectCoverage: true,
  coverageReporters: [
    'text-summary',
    'cobertura',
    'html',
  ],
  coveragePathIgnorePatterns: [
    '\\.generated\\.[jt]s$',
    '<rootDir>/test/',
    '/node_modules/',
  ],
  reporters: [
    'default',
    ['jest-junit', {
      suiteName: 'jest tests',
      outputDirectory: 'coverage'
    }],
  ],
};
```

### ステップ5: package.jsonにスクリプトを追加

```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "lint:md": "markdownlint '**/*.md' --ignore node_modules",
    "format": "eslint . --ext .ts --fix"
  }
}
```

### ステップ6: MarkdownLint設定（オプション）

プロジェクトルートに `.markdownlintrc.json` を作成:

```json
{
  "default": true,
  "MD013": {
    "line_length": 120,
    "code_blocks": false
  }
}
```

### ステップ7: .gitignoreの更新

```gitignore
# Build outputs
lib/
dist/
cdk.out/
*.js
*.d.ts
*.tsbuildinfo

# Test coverage
coverage/
.nyc_output/

# IDE
.idea/
*.iml
*.iws
*.ipr
.vscode/

# Dependencies
node_modules/
```

### ステップ8: 実行確認

```bash
# Lintチェック
npm run lint

# 自動修正
npm run lint:fix

# Markdownチェック
npm run lint:md

# テスト実行
npm run test

# ビルド
npm run build
```

---

## 3. WebStorm統合手順

### ステップ1: ESLint設定

1. **Settings/Preferences**を開く（`Ctrl+Alt+S` / `Cmd+,`）
2. **Languages & Frameworks → JavaScript → Code Quality Tools → ESLint**に移動
3. 以下のように設定：

```
☑ Automatic ESLint configuration

Working directories: {project}

☑ Run eslint --fix on save

Additional options:
  --max-warnings 0
```

**手動設定の場合:**

```
☑ Manual ESLint configuration
  - ESLint package: {プロジェクトルート}/node_modules/eslint
  - Configuration file: {プロジェクトルート}/eslint.config.mjs

☑ Run eslint --fix on save
```

### ステップ2: TypeScript設定

1. **Settings → Languages & Frameworks → TypeScript**
2. 以下を設定：

```
☑ TypeScript Language Service
  - TypeScript: {プロジェクト}/node_modules/typescript
  - Options: --strict

☑ Recompile on changes
☑ Show project errors

TSConfig: {プロジェクトルート}/tsconfig.json
```

### ステップ3: Jest統合

1. **Settings → Languages & Frameworks → JavaScript → Jest**
2. 設定：

```
☑ Enable Jest

Jest package: {プロジェクトルート}/node_modules/jest

Configuration file: {プロジェクトルート}/jest.config.js

Jest options: --coverage --maxWorkers=50%
```

### ステップ4: 実行設定の作成

1. **Run → Edit Configurations**
2. **+** → **Jest**を選択
3. 設定：

```
Name: All Tests

Configuration:
  - Jest package: {プロジェクトルート}/node_modules/jest
  - Working directory: {プロジェクトルート}
  - Jest options: --coverage
  - Configuration file: {プロジェクトルート}/jest.config.js
```

### ステップ5: コードスタイル設定

1. **Settings → Editor → Code Style → TypeScript**
2. 以下の設定を調整：

```
Tabs and Indents:
  - Tab size: 2
  - Indent: 2
  - Continuation indent: 2

Spaces:
  ☐ Before method parentheses
  ☑ Around operators
  ☐ Within brackets
  ☑ Within braces

Punctuation:
  ☑ Use single quotes
  ☑ Trailing comma: Add when multiline
  ☑ Use semicolon to terminate statements: Always
```

**プロジェクト固有の設定にする:**

1. **Scheme**のドロップダウンの横にある⚙アイコンをクリック
2. **Copy to Project...**を選択

### ステップ6: 保存時のアクション設定

1. **Settings → Tools → Actions on Save**
2. 以下を有効化：

```
☑ Reformat code
  - File types: TypeScript, TypeScript JSX

☑ Optimize imports
  - File types: TypeScript

☑ Run eslint --fix
  - File types: TypeScript
```

### ステップ7: ファイルウォッチャー設定（オプション）

1. **Settings → Tools → File Watchers**
2. **+** → **TypeScript**を選択
3. 設定：

```
Name: TypeScript

File type: TypeScript

Scope: Project Files

Program: $ProjectFileDir$/node_modules/.bin/tsc

Arguments: -p tsconfig.json --noEmit

Output paths to refresh: $ProjectFileDir$/lib

☑ Auto-save edited files to trigger the watcher
☐ Trigger the watcher on external changes
☑ Show console: On error
```

### ステップ8: 除外設定

プロジェクトツールウィンドウで以下のディレクトリを右クリック → **Mark Directory as → Excluded**:

- `node_modules`
- `cdk.out`
- `dist`
- `lib`（生成されたJSファイル）
- `coverage`

### ステップ9: npm実行構成の作成

1. **Run → Edit Configurations**
2. **+** → **npm**を選択
3. 以下の構成を作成：

**Lint実行:**
```
Name: npm: lint
Command: run
Scripts: lint
```

**Lint修正:**
```
Name: npm: lint:fix
Command: run
Scripts: lint:fix
```

**ビルド:**
```
Name: npm: build
Command: run
Scripts: build
```

**テスト:**
```
Name: npm: test
Command: run
Scripts: test
```

### ステップ10: プラグインのインストール（オプション）

**Settings → Plugins**から以下をインストール：

1. **AWS Toolkit** - CDK対応、CloudFormationサポート
2. **.ignore** - .gitignoreファイルのサポート
3. **Markdown** - Markdownプレビュー（通常は標準搭載）

### ステップ11: 動作確認

1. TypeScriptファイルを開く
2. わざとエラーを入れる（例：セミコロン忘れ）
3. 黄色い波線が表示されることを確認
4. `Alt+Enter`で修正候補を確認
5. `Ctrl+S`（保存）でESLintが自動修正することを確認

---

## 4. 設定のスコープについて

### 4.1 プロジェクトスコープ（現在のプロジェクトのみ）

以下の設定は**プロジェクト単位**で保存され、他のプロジェクトには影響しません：

| 設定項目 | 保存場所 |
|---------|---------|
| ESLint設定 | `.idea/workspace.xml` または `.idea/jsLinters/eslint.xml` |
| TypeScript設定 | `.idea/workspace.xml` |
| Jest設定 | `.idea/workspace.xml` |
| 実行構成 | `.idea/runConfigurations/` |
| ファイルウォッチャー | `.idea/watcherTasks.xml` |
| 除外設定 | `.idea/modules.xml` |

### 4.2 IDE全体スコープ（すべてのプロジェクト）

以下の設定は**IDE全体**に適用されます：

| 設定項目 | 保存場所 |
|---------|---------|
| コードスタイル（デフォルト） | `~/.config/JetBrains/WebStorm{version}/codestyles/` |
| キーマップ | `~/.config/JetBrains/WebStorm{version}/keymaps/` |
| プラグイン | `~/.config/JetBrains/WebStorm{version}/plugins/` |
| テーマ・外観 | IDE設定内 |
| Actions on Save | `~/.config/JetBrains/WebStorm{version}/options/` |

### 4.3 プロジェクト固有にする方法

**コードスタイル:**
1. `Settings → Editor → Code Style → TypeScript`
2. **Scheme**の⚙アイコン → **Copy to Project...**
3. `.idea/codeStyles/`にプロジェクト固有の設定が保存される

### 4.4 チーム共有のベストプラクティス

`.gitignore`を以下のように設定：

```gitignore
# WebStorm - ユーザー固有の設定は除外
.idea/workspace.xml
.idea/usage.statistics.xml
.idea/shelf/
.idea/tasks.xml
.idea/dictionaries/

# WebStorm - チームで共有する設定
!.idea/codeStyles/
!.idea/inspectionProfiles/
!.idea/runConfigurations/
!.idea/jsLinters/
```

---

## 5. トラブルシューティング

### 5.1 ESLintが動作しない

**解決方法:**

1. **Help → Find Action → Restart ESLint Service**を実行
2. `node_modules`を削除して`npm install`を再実行
3. **File → Invalidate Caches / Restart**を実行
4. ESLint設定でパスが正しいか確認

### 5.2 TypeScriptエラーが表示されない

**解決方法:**

1. **Settings → Languages & Frameworks → TypeScript**で**Recompile on changes**を確認
2. **TypeScript Tool Window**（下部）でエラーを確認
3. `tsconfig.json`のパスが正しいか確認
4. TypeScriptサービスを再起動

### 5.3 Jestが認識されない

**解決方法:**

1. **Settings → Languages & Frameworks → JavaScript → Jest**で設定を確認
2. Jest packageのパスが正しいか確認
3. `jest.config.js`が存在するか確認
4. `npm install`を再実行

### 5.4 保存時に自動修正されない

**解決方法:**

1. **Settings → Tools → Actions on Save**で**Run eslint --fix**が有効か確認
2. ESLint設定で**Run eslint --fix on save**が有効か確認
3. ファイルがESLintの対象になっているか確認（`files`パターン）

### 5.5 インポートエラーが表示される

**解決方法:**

1. `eslint.config.mjs`の`settings`セクションを確認
2. `eslint-import-resolver-typescript`がインストールされているか確認
3. `tsconfig.json`のパスが正しいか確認

---

## 便利なキーボードショートカット

| アクション | Windows/Linux | macOS |
|-----------|---------------|-------|
| ESLint修正を実行 | `Ctrl+Alt+Shift+E` | `Cmd+Option+Shift+E` |
| コードフォーマット | `Ctrl+Alt+L` | `Cmd+Option+L` |
| Importの最適化 | `Ctrl+Alt+O` | `Cmd+Option+O` |
| テスト実行 | `Ctrl+Shift+F10` | `Ctrl+Shift+R` |
| ファイル内検索 | `Ctrl+F` | `Cmd+F` |
| プロジェクト全体検索 | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| Quick Fix | `Alt+Enter` | `Option+Enter` |

---

## まとめ

この手順により、AWS CDK公式リポジトリと同等の厳格なコード品質管理が可能になります。

**主な利点:**
- コードスタイルの統一
- TypeScriptの厳格なチェック
- テストカバレッジの自動計測
- 保存時の自動フォーマット
- チーム全体での設定共有

必要に応じて、ルールをプロジェクトの要件に合わせて調整してください。

---

**最終更新日:** 2026-02-13
**対象バージョン:** WebStorm 2024.x, ESLint 9.x, TypeScript 5.5.x
