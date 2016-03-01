/*
 *The MIT License (MIT)
 *
 *Copyright (c) 2015 Peter Williamson
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy
 *of this software and associated documentation files (the "Software"), to deal
 *in the Software without restriction, including without limitation the rights
 *to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *copies of the Software, and to permit persons to whom the Software is
 *furnished to do so, subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in all
 *copies or substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *SOFTWARE.
 */
var q 		= require('q'),
	readline= require('readline');
	fs 		= require('fs');

module.exports = {
	read: function( path ) {
		// set up promise and create file reader
		var deferred = new q.defer(),
			conf = {},
			filereader,
			lineReader;

		if( typeof path === 'undefined' ) {
			deferred.reject( 'No path supplied' );
		} else {
			filereader = fs.createReadStream( path );
			
			filereader.on('error', function( err ) {
				console.log( 'Could not read conf file', path);
			});

			lineReader = readline.createInterface({
				input: filereader
			});

			// add line to promise if it looks valid
			lineReader.on('line', function (line) {
				/**
				 * lines need an = sign, with optional content after
				 * the var name on the left hand side needs to start 
				 * with a-z, A-Z or _
				 * PLEASE UPDATE THIS COMMENT IF YOU UPDATE THE REGEX
				 */
				if( line.match( /^[a-zA-Z_][a-zA-Z0-9$_\-]*=.*$/ ) ) {
					var arrLine = line.split( '=' );
					conf[ arrLine[ 0 ] ] = arrLine[ 1 ];
				}
			});

			// resolve promise at end of file
			lineReader.on('close', function () {
			  	deferred.resolve( conf );
			});
		}

		return deferred.promise;
	}
}
