# WebStorm セットアップガイド（aws-cdk）

このドキュメントでは、aws-cdk プロジェクトの開発に合わせた WebStorm の設定手順をまとめます。

---

## 1. ESLint の設定

`Settings` → `Languages & Frameworks` → `JavaScript` → `Code Quality Tools` → `ESLint`

| 項目 | 値 |
|------|-----|
| Enable | ✅ ON |
| Configuration | `Manual ESLint configuration` |
| ESLint package | `<リポジトリルート>/node_modules/eslint` |
| Configuration file | `Automatic search`（flat config を自動検出） |
| Working directory | 空欄でOK |

> **補足**: このプロジェクトは ESLint 9.x の flat config 形式（`eslint.config.mjs`）を使用しています。
> WebStorm 2024.1 以降が必要です。

---

## 2. コードスタイルの設定

`Settings` → `Editor` → `Code Style` → `TypeScript`

### Tabs and Indents タブ

| 設定 | 値 |
|------|-----|
| Use tab character | ❌ OFF（スペース使用） |
| Tab size | `2` |
| Indent | `2` |
| Continuation indent | `2` |

### Spaces タブ

| 設定 | 値 |
|------|-----|
| Within > Object literal braces | ✅ ON（`{ key: 'value' }` の内側にスペース） |
| Within > Array brackets | ❌ OFF（`[1, 2, 3]` の内側にスペースなし） |

### Punctuation タブ

| 設定 | 値 |
|------|-----|
| Use semicolons | `Always` |
| Use single quotes | ✅ ON |
| Trailing commas | `Add when multiline` |

### Wrapping and Braces タブ

| 設定 | 値 |
|------|-----|
| Brace placement | `End of line`（1tbs スタイル） |
| Keep when reformatting > Line breaks | ✅ ON |

### 行の最大長

`Settings` → `Editor` → `Code Style`

| 設定 | 値 |
|------|-----|
| Hard wrap at | `150` |

### 末尾スペースとファイル末尾の改行

`Settings` → `Editor` → `General`

| 設定 | 値 |
|------|-----|
| Strip trailing spaces on save | `All` |
| Ensure every saved file ends with a line break | ✅ ON |

---

## 3. 保存時に ESLint 自動修正を実行する

`Settings` → `Languages & Frameworks` → `JavaScript` → `Code Quality Tools` → `ESLint`

| 設定 | 値 |
|------|-----|
| Run eslint --fix on save | ✅ ON |

> **補足**: `import/order`（インポート順序）などの ESLint ルールは WebStorm の `Reformat Code`（`Ctrl+Alt+L`）では修正されません。
> 保存時の自動修正を有効にすることで、これらも自動的に整形されます。

---

## 4. 動作確認

設定完了後、以下で正しく連動しているか確認してください。

1. `packages/aws-cdk-lib/aws-eks-v2/test/addon.test.ts` を開く
2. インポート順序が崩れている行に赤波線が表示されれば ESLint 連動は成功
3. ファイル保存時にインポートの順序が自動修正されれば自動修正も成功

### CLI での確認（個別ファイル）

```bash
cd packages/aws-cdk-lib
yarn eslint aws-eks-v2/test/addon.test.ts
```

### CLI での確認（自動修正あり）

```bash
cd packages/aws-cdk-lib
yarn eslint aws-eks-v2/test/addon.test.ts --fix
```
