var mkdirp = require( 'mkdirp' );
var formidable = require( 'formidable' );
var filesize = require( 'file-size' );
var fs = require( 'fs' );
var path = require( 'path' );

/**
 *
 * @param {Object} [options]
 * @param {String} [options.dstDir]
 * @param {Number} [options.maxSize]
 * @param {String} [options.tempDir]
 * @return {Function}
 */
exports = module.exports = function fileUploader ( options ) {
  var opt = options || {};
  var dstDir = opt.dstDir || "./public/files";
  var maxSize = opt.maxSize || 2 * 1024 * 1024 * 1024;   // 2GB
  var tmpDir = opt.tempDir || dstDir;

  return function fileUploader ( req, res, next ) {
    req._dstDir = dstDir;
    req.maxSize = req.maxSize || maxSize; //事前に設定済みならスルー
    var form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.uploadDir = tmpDir;
    form.keepExtensions = true;

    /**
     *
     * @param req
     * @returns {Promise}
     */
    function maxSizeCheck ( req ) {
      return new Promise( function ( resolve, reject ) {
        var size = req.headers['content-length'];
        if (size >= req.maxSize) {
          var err = new Error( 'Request Entity Too Large. Limit is '
          + filesize( req.maxSize ).human( {jedec: true} ) );
          err.status = 413;
          reject( err );
        } else {
          resolve( req );
        }
      } );
    }

    /**
     *
     * @param req
     * @returns {Promise}
     */
    function formParse ( req ) {
      return new Promise( function ( resolve, reject ) {
        mkdirp( req._dstDir, function ( err ) {
          if (err) {
            reject( err );
          }
          else {
            form.on( 'file', function ( name, file ) {
              var err;
              if (!file.size) {
                fs.unlinkSync( './' + file.path );
                err = new Error( 'Length Required' );
                err.status = 411;
                reject( err );
              } else if (!file.name) {
                fs.unlinkSync( './' + file.path );
                err = new Error( 'Your file is nameless' );
                err.status = 400;
                reject( err );
              }
            } );
            form.parse( req, function ( err, fields, files ) {
              if (err) {
                reject( err );
              } else {

                //key作成。 >> file名からupload_を引く
                files.file.key = path.basename( files.file.path ).split( 'upload_' )[1];

                //tempFilePath を保存
                files.file.tempPath = './' + files.file._writeStream.path;

                //targetDirPath を作成
                //noinspection JSUnresolvedVariable
                var subDir = req.subDir || "";
                var targetDirPath = path.join( req._dstDir, subDir, files.file.key.slice( 0, 2 ) );

                //newFilePath を保存
                files.file.newPath = targetDirPath + '/' + files.file.key;
                req._file = files.file;
                resolve( req )
              }
            } );
          }
        } );
      } )
    }

    /**
     * 保存先フォルダを作成。保存先パスをreqのnewPathに生やす。
     * @param req
     * @returns {Promise}
     */
    function makeTargetDir ( req ) {
      var file = req._file;
      return new Promise( function ( resolve, reject ) {
        mkdirp( path.dirname( file.newPath ), function ( err ) {
          if (err) {
            reject( err );
          } else {
            resolve( req );
          }
        } )
      } );
    }

    /**
     *
     * @param req
     * @returns {Promise}
     */
    function renameUploadFile ( req ) {
      var file = req._file;
      return new Promise( function ( resolve, reject ) {
        fs.rename( file.tempPath, file.newPath, function ( err ) {
          if (err) {
            reject( err );
          } else {
            resolve( req );
          }
        } );
      } );
    }

    Promise.resolve( req )
        .then( maxSizeCheck )
        .then( formParse )
        .then( makeTargetDir )
        .then( renameUploadFile )
        .then( function () {
          next();
        } )
        .catch( function ( err ) {
          next( err );
        } );

  };
};