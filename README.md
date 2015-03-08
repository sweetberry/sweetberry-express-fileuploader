# sweetberry-express-fileuploader

expressでファイルアップロードをするためのmiddlewareです。

## Description

## Usage

* ルーター設置時にoptionsを渡して初期設定可能。

```
options = {
  dstDir:"./public/files",
  maxSize:2147483648, //2GB
  tmpDir:"./public/files"
}
```

* 手前の段階でreq.maxSizeに上限Byteを入れておけばリクエストごとにリミット設定可能

* 手前の段階でreq.subDirにフォルダ名文字列を入れておけばリクエストごとにサブフォルダ作成可能

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