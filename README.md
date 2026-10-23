# 小林由幸のホームページ（yoshiyukikobayashi.com）

平成中期の個人ホームページ風に作った、研究者としての個人サイトです。
HTMLとCSSだけでできているので、GitHub Pages に置けばそのまま公開できます。サーバー代はかかりません。

## フォルダの中身

| ファイル | 中身 |
|---|---|
| index.html | TOP（ようこそ、What's New!、カウンター、Web拍手） |
| profile.html | 管理人について（プロフィール、略歴、受賞、質問コーナー） |
| research.html | 研究の部屋（3つの部屋） |
| papers.html | 論文置き場（32本、researchmap 2026年10月17日時点） |
| teaching.html | 講義・教育 |
| omikuji.html | 研究おみくじ |
| zakki.html | 雑記帳（工事中） |
| links.html | リンク集、バナー、相互リンク |
| en.html | English |
| 404.html | ページが見つからないときの画面 |
| css/style.css | 全ページ共通の見た目 |
| js/site.js | Web拍手、マウスキラキラ、おみくじ |
| img/ | 管理人のドット絵（photo.png）、背景のベンゼンと鳩（bg-light.svg ／ bg-dark.svg、鳩だけの画像は hato.png）、バナー、工事中の看板、SNS用の画像（ogp.png） |
| CNAME | 独自ドメインの設定（yoshiyukikobayashi.com） |
| robots.txt / sitemap.xml | 検索エンジン向けの案内 |

## 公開の手順

### 1. ドメインを取る（お名前.com）

- yoshiyukikobayashi.com を「ドメインのみ」で申し込みます。レンタルサーバーは要りません。
- 登録年数を選ぶ画面で「Whois情報公開代行」を選んでください。登録者の住所や電話番号が公開されずに済みます。新規登録と同時なら無料で、あとから付けると年1,078円（税込）です（2026年10月時点のお名前.comの案内）。

### 2. GitHub に置く

1. GitHub にログインし、新しいリポジトリを作ります（名前の例：homepage）。公開範囲は Public にします。
2. 「Add file」→「Upload files」で、このフォルダの中身をまるごとアップロードします。
   - `.nojekyll` は見えないことがありますが、無くても動きます。
3. Settings → Pages を開き、Source を「Deploy from a branch」、Branch を「main」と「/(root)」にして Save します。
4. 同じ画面の Custom domain に `yoshiyukikobayashi.com` と入れて Save します。
   - DNS を設定する前に、この手順を済ませてください（GitHub の推奨）。
   - さらに安全にするなら、GitHub 右上のアイコン → Settings → Pages → Add a domain からドメインを検証しておくと、第三者による乗っ取りを防げます（TXT レコードを1つ追加します）。

### 3. お名前.com で DNS を設定する

ネームサーバーはお名前.comのもの（初期設定）のまま、お名前.com Navi の DNS 設定画面で次のレコードを追加します。

| ホスト名 | TYPE | VALUE |
|---|---|---|
| （空欄） | A | 185.199.108.153 |
| （空欄） | A | 185.199.109.153 |
| （空欄） | A | 185.199.110.153 |
| （空欄） | A | 185.199.111.153 |
| www | CNAME | （GitHubのユーザー名）.github.io |

- 最初から入っている A レコード（駐車場ページ向けなど）があれば消します。
- 反映には数時間から最大24時間ほどかかります。
- 反映されたら、GitHub の Settings → Pages で「Enforce HTTPS」にチェックを入れます。
- IPv6 にも対応させたい場合は、AAAA レコード（2606:50c0:8000::153 〜 2606:50c0:8003::153 の4つ）も追加できます。

## 公開前に直すところ

- **メールアドレス**：contact＠yoshiyukikobayashi.com（ImprovMX でメール転送）。2026-10-23 に外部のアドレスから届くのを確かめて、表示を戻しました。迷惑メール対策で、日本語ページは「＠」を全角にして注意書きを付け、en.html は contact [at] yoshiyukikobayashi.com と書いています。mailto: のリンクは付けていません。
- **開設日**：公開する日に合わせて、index.html の What's New! と、各ページのフッター（Since ／ 最終更新）の日付を直してください。
- **好きな食べ物**：profile.html の「ひみつです」はお好みで。

## 更新のしかた

- 文章を直す：GitHub 上でファイルを開き、鉛筆マークで編集して「Commit changes」を押すと、数分で反映されます。
- 写真を替える：img/photo.png を同じ名前の画像で上書きします（正方形がきれいに収まります）。
- 論文が増えたら：papers.html の該当する年のところに、1件分をコピーして書き換えます。researchmap から自動で更新する仕組みは、あとから足せます。

## メモ

- 見出しの書体は Google Fonts の「Mochiy Pop One」と「DotGothic16」です。本文は Windows では MS Pゴシック、Mac ではヒラギノで表示されます。
- アクセスカウンターは飾りです（誰にでも「1人目」と表示します）。本当に数えたい場合は、外部のカウンターサービスにつなぎます。
- Web拍手・マウスキラキラ・おみくじは、見ている人のブラウザの中だけで動き、外部には何も送りません。
- ダークモードの端末では、黒地にネオン色の「夜の平成」版で表示されます。
