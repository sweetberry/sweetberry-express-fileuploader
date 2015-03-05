# sweetberry-express-fileuploader

expressでファイルアップロードをするためのmiddlewareです。

## Description

## Usage

* ルーター設置時にoptionsを渡して初期設定可能。

```
options = {
  dstDir:"./public/files",
  maxSize:2147483648,
  tmpDir:"./public/files"
}
```

* 手前の段階でreq.maxSizeに上限を入れておけばリクエストごとにリミット設定可能


* ファイル保存後の情報はreq._fileに生えています。

```
{req._file:{
	key:"保存ファイル名",
	newPath:"ローカル保存パス"}
}
```

## Install

```
npm install sweetberry-express-fileuploader --save
```

## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)

## Author

[sweetberry](https://github.com/sweetberry)