# AWS CDK コードスタイルと規約

## TypeScript 設定
- `strict: true`（`strictNullChecks`、`strictPropertyInitialization` 含む）
- `noImplicitAny: true`
- `noUnusedLocals: true`、`noUnusedParameters: true`
- `target: es2022`、`module: commonjs`
- `isolatedModules: true`

## コードスタイル (ESLint で強制)

### インデントと空白
- インデント: **2スペース**
- 行末スペース禁止
- ファイル末尾に改行必須
- 最大行長: **150文字**（URL、文字列、コメント、正規表現は除外）

### 引用符とセミコロン
- 文字列: **シングルクォート**（エスケープ回避時はダブルクォート可）
- セミコロン: **必須**

### インポート
- `import { foo } from 'bar'` 形式を使用（`require()` 形式は禁止）
- 型のみのインポートは `import type` を使用
- インポート順: builtin → external、アルファベット順
- 同一モジュールからの重複インポート禁止

### オブジェクトと配列
- オブジェクトの波括弧内にスペース: `{ key: 'value' }`
- 配列の括弧内にスペースなし: `[1, 2, 3]`
- 複数行の末尾にトレーリングカンマ（`'always-multiline'`）

### クラスとメンバーの順序
1. public static field
2. public static method
3. protected static field
4. protected static method
5. private static field
6. private static method
7. field (instance)
8. constructor
9. method (instance)

### 命名規則（jsii による強制）
- クラス・インターフェース・型: PascalCase
- 変数・メソッド・プロパティ: camelCase
- 定数: UPPER_CASE 可
- enum メンバー: PascalCase または UPPER_CASE
- L1 コンストラクト: `Cfn` プレフィックス（例: `CfnBucket`）

## jsii の公開 API 制約
- union types (`string | number`) は公開 API で使用不可
- TypeScript 固有の機能（conditional types 等）は公開 API で使用不可
- 多言語バインディングで表現できる型のみ使用可能

## テスト規約
- テストファイル: `**/test/**/*.test.ts`
- テストタイムアウト: 60秒
- カバレッジ要件: branches 35%, statements 55%
- スキップテスト (`test.skip`) と限定テスト (`test.only`) は PR で検出されエラー

## コンストラクトライブラリ固有のルール
- `console.log` 禁止（ライブラリコード内）
- デフォルトの `Error` をスロー禁止（専用エラークラスを使用）
- `md5` ハッシュの直接使用禁止（`md5hash()` 関数を使用）

## ドキュメント (JSDoc)
- パラメータの説明必須 (`@param`)
- プロパティの説明必須 (`@property`)
- 返り値の説明必須 (`@returns`)

## 設計ガイドライン
- 詳細は `docs/DESIGN_GUIDELINES.md` を参照（awslint で強制）
