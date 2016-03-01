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
