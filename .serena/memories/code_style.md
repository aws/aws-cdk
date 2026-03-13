# AWS CDK - コードスタイルと規約

## TypeScript設定

### コンパイラオプション
プロジェクトはTypeScript strict modeを使用：
```json
{
  "target": "es2022",
  "module": "commonjs",
  "lib": ["es2022"],
  "strict": true,
  "noImplicitAny": true,
  "noImplicitReturns": true,
  "noImplicitThis": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "strictNullChecks": true,
  "strictPropertyInitialization": true,
  "noFallthroughCasesInSwitch": true,
  "alwaysStrict": true
}
```

## 命名規則

### クラス名
- リソースクラス: `Foo` (例: `Bucket`, `Queue`, `Topic`)
- インターフェース: `IFoo` (例: `IBucket`, `IQueue`, `ITopic`)
- Props: `FooProps` (例: `BucketProps`, `QueueProps`, `TopicProps`)
- Abstractベース: `FooBase`

### ファイル構成
- 1ファイル1クラスまたは関連する複数のクラス
- テストファイル: `*.test.ts`
- 統合テストファイル: `integ.*.ts`

## デザインガイドライン

### 設計原則 (docs/DESIGN_GUIDELINES.md より)

1. **モジュール構成**
   - 各AWSサービスは独自のモジュール (`aws-xxx`)
   - L2構文 (高レベル抽象化) を提供

2. **Props設計**
   - フラットな構造を優先
   - 合理的なデフォルト値を提供
   - 型安全性を最優先
   - わかりやすく簡潔な命名

3. **インターフェース**
   - すべてのコンストラクトは`IFoo`インターフェースを実装
   - 参照可能な属性を公開 (`xxxArn`, `xxxName`等)

4. **エラー処理**
   - 可能な限りエラーを回避する設計
   - 明確なエラーメッセージを提供
   - 例外をキャッチしない (fail fast)

5. **ドキュメント**
   - すべてのpublic APIにJSDocコメント
   - 実例を含める
   - READMEには実践的な例を記載

## Linter

### ESLint
- `@aws-cdk/eslint-config` を使用
- プラグイン: typescript-eslint, jest, import, jsdoc
- flat config形式 (ESLint v9)

### pkglint
パッケージ構造チェック：
- package.jsonの必須フィールド確認
- 依存関係の整合性
- ライセンス情報

### awslint
AWS CDK設計ガイドライン準拠チェック：
- 命名規則 (IFoo, FooProps等)
- コンストラクトパターン
- API設計ルール

## コーディング規約

### インポート
```typescript
// 標準ライブラリ
import * as fs from 'fs';
import * as path from 'path';

// 外部パッケージ
import { Construct } from 'constructs';

// 内部パッケージ
import { Resource, IResource } from './base';
```

### クラス定義例
```typescript
/**
 * Properties for Foo
 */
export interface FooProps {
  /**
   * The name of the resource
   * @default - auto-generated
   */
  readonly fooName?: string;
}

/**
 * Interface for Foo
 */
export interface IFoo extends IResource {
  readonly fooArn: string;
  readonly fooName: string;
}

/**
 * A Foo resource
 */
export class Foo extends Resource implements IFoo {
  public readonly fooArn: string;
  public readonly fooName: string;

  constructor(scope: Construct, id: string, props: FooProps = {}) {
    super(scope, id);
    // implementation
  }
}
```

## ベストプラクティス

1. **イミュータビリティ**: propsは`readonly`で定義
2. **デフォルト値**: 合理的なデフォルトを提供してユーザー体験を向上
3. **型安全性**: anyの使用を避け、厳密な型定義
4. **テストカバレッジ**: 新機能には必ずテストを追加
5. **ドキュメント**: publicメソッド・プロパティには必ずJSDocを記載