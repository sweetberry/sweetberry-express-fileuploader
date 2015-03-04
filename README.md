sweetberry-express-fileuploader
====

expressでファイルアップロードをするためのmiddlewareです。

## Description

## Usage

* ルーター設置時にoptionsを渡して初期設定可能。
* 手前の段階でreq.maxSizeに上限を入れておけばリクエストごとにリミット設定可能
* ファイル保存後の情報はreq._fileに生えています。

## Install

```
npm install sweetberry-express-fileuploader --save
```

## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)

## Author

[sweetberry](https://github.com/sweetberry)