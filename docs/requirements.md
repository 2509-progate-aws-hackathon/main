# 概要
## 船舶情報比較・検索アプリ
DB から船舶情報を参照し、比較・検索できるアプリ。

## データ構造
### 船舶情報
LINKS から公開されている一般旅客定期航路事業データより、船のスペック情報のみを使用。（[参照](https://docs.google.com/spreadsheets/d/1UQhn9uAUBD8RsCqH02kBl6HaVYcKM1GP/edit?gid=357426841#gid=357426841)）

| フィールド名 | データ型 | 項目 | 単位 | 入力例 | 秘匿化処理の有無 |
|---|---|---|---|---|---|
| ship_ID | テキスト型 | 船舶ID | - | 55193259388 | |
| ship_kind | テキスト型 | 船舶の種類 | - | 旅客船 | |
| ship_quality | テキスト型 | 船質 | - | 軽合金 | |
| navigation_area | テキスト型 | 航行区域 | - | 沿海区域 | |
| ship_owner_ID | テキスト型 | 船舶保有者ID | - | 9000000001 | |
| purpose | テキスト型 | 用途 | - | 旅客船 | |
| ship_weight | 整数型 | 総トン数 | トン | 19 | |
| capacity_passengers | テキスト型 | 定員(旅客) | 人 | 65 | |
| capacity_crew | テキスト型 | 定員(船員) | 人 | 2 | |
| capacity_other_boarders | テキスト型 | 定員(その他の乗船者) | 人 | 0 | |
| main_engine_type | テキスト型 | 主機の種類 | - | ディーゼル | |
| Continuous_Maximum_Output | 小数型 | 連続最大出力 | | 536ps×2 | |
| Maximum_Speed | 小数型 | 最高速力 | ノット | 25 | |
| Cruising_Speed | 小数型 | 航海速力 | ノット | 21 | |
| Overall_Length | 小数型 | 全長 | m | 18.16 | |
| Width | 小数型 | 幅 | m | 4.51 | |
| Maximum_Height | 小数型 | 最大高 | m | 1.59 | |
| Maximum_(Full_Load)_Draft | 小数型 | 最大（満載）喫水 | m | 1.45 | |
| SHIPYARD_ID | 整数型 | 造船所ID | - | 9000000001 | |
| Radio_Equipment | テキスト型 | 無線設備 | - | あり | |
| Maneuverability_(Turning_Radius) | テキスト型 | 運動性能(旋回径) | - | 50×50 | |
| Maneuverability_(Drift_Distance) | テキスト型 | 運動性能(惰力) | - | 約15230ノット航海速力時 | |
| Special_Maneuvering_Equipment | テキスト型 | 操船上の特殊設備 | - | 1レーダー1基、推進機の数3基、GPS1基 | |
| Barrier-Free_Support_Status | テキスト型 | バリフリ対応状況 | - | バリフリ対応 | |