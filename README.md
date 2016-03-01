# bash-conf

Read a simple bash config file (simple variables and values) and convert into a Javascript object.

This allows you to keep API keys, Database names etc out your source code and in a shareable location that both bash and node scripts can read.

## Example config

It's intended to read a simple text file like this:

```bash
EMPTY_VAR=
FOO=BAR
this line will be ignored
```

Which has been used in a bash script like this:

```
# set vars
. /path/to/config/file.cfg
export FOO
```

## Usage

```javascript
var path = process.argv[ 2 ],
	bashConf = require('../bash-conf/bash-conf.js');

bashConf
	.read( path )
	.then(function( data ) {
		console.log( 'what is foo', data.FOO );
		console.log( 'this should be empty -> [', data.EMPTY_VAR, ']' );
	})
	.catch( function( err ) {
		console.log( err );
	});
```

## Error Handling

Lines that don't match the regex pattern are simply ignored and not parsed.

### Missing config path

```bash
$ node test.js
No path supplied
```

### Invalid config path

```bash
$ node test.js aintnofile.cfg
Could not read conf file aintnofile.cfg
```
