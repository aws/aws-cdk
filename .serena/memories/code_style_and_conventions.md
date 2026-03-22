# コードスタイルと規約

## TypeScript / jsii 規約
- **jsii 互換**: 公開 API は jsii の型制約に従う (Java/Python/C# バインディング生成のため)
  - `any` 型を公開 API に使わない
  - 非直列化可能な型 (関数型など) を公開 API に使わない
  - `interface` は `I` プレフィックス (例: `IBucket`, `ILambdaFunction`)
- **命名規則**:
  - クラス: PascalCase (例: `Bucket`, `BucketPolicy`)
  - インターフェース: `I` + PascalCase (例: `IBucket`)
  - メソッド/プロパティ: camelCase
  - 定数/Enum: PascalCase
- **型ヒント**: TypeScript なので型を明示する。戻り値型も省略しない
- **JSDoc**: 公開 API には JSDoc コメントを必ず記述する (`/** ... */`)
  - `@attribute` タグ: CloudFormation 属性にマッピングされるプロパティ
  - `@deprecated` タグ: 廃止予定 API

## インポートスタイル
```typescript
// 同一パッケージ内: 相対インポート
import { BucketPolicy } from './bucket-policy';
import type { IBucketNotificationDestination } from './destination';

// aws-cdk-lib 内の他モジュール: 相対インポート (../../)
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { Stack, Resource } from '../../core';

// 型のみのインポートには import type を使用
import type { IGrantable } from '../../aws-iam';
```

## 自動生成ファイル
- `*.generated.ts` (例: `s3.generated.ts`) は CloudFormation spec から自動生成。手動編集禁止。
- `*.d.ts`, `*.js` はビルド成果物。手動編集禁止。

## Breaking Changes の扱い
- 公開 API シグネチャの変更は原則禁止
- 変更が必要な場合は `allowed-breaking-changes.txt` を確認
- 動作変更は `cx-api` の Feature Flag 経由で導入 (既存動作はデフォルトで維持)

## テストスタイル
- フレームワーク: Jest
- テストファイル: `test/*.test.ts`
- `Template.fromStack(stack).hasResourceProperties(...)` パターンでアサーション
- インテグレーションテスト: `integ.*.ts` ファイル (AWS アカウント必要)

## PR コミットメッセージ形式
conventional commits 形式:
```
feat(aws-s3): add new bucket property
fix(aws-lambda): fix memory size validation
chore: update dependencies
```
