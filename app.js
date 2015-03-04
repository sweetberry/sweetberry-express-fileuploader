var express = require( 'express' );
var path = require( 'path' );
var util = require( 'util' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );

var fileUploader = require( './lib/fileUploader' );

var app = express();

app.set( 'x-powered-by', false );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended: false} ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.post( '/post', fileUploader(), function ( req, res ) {
  res.status( 200 );
  res.write( 'received upload:\n\n' );
  res.end( util.inspect( req._file ) );
} );

// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
  var err = new Error( 'Not Found' );
  err.status = 404;
  next( err );
} );

// error handlers

// development error handler
// will print stacktrace
if (app.get( 'env' ) === 'development') {
  //noinspection JSUnusedLocalSymbols
  app.use( function ( err, req, res, next ) {
    res.status( err.status || 500 );
    res.json( {
      error: err.message,
      detail: err
    } );
  } );
}

// production error handler
// no stacktraces leaked to user
//noinspection JSUnusedLocalSymbols
app.use( function ( err, req, res, next ) {
  res.status( err.status || 500 );
  res.json( {
    error: err.message
  } );
} );

module.exports = app;
