A transform that replaces strings in a file using a regular expression. Just like `string.replace` but with streams. Desiged for use with [browserify](https://github.com/substack/node-browserify) / [parcelify](https://github.com/rotundasoftware/parcelify).

### stream = replaceStringTransform( file, options );

There are two required options:

* `find` - The string or regular expression to find.
* `replace` - The string to replace `find` with. May also be a function that returns a string. The signature of the function should be the same as the signature of the a function passed as the second argument to [String.prototype.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace), except for with additional `file` argument.

Example:

`before.txt` is:

```
flip
```

We run it through the transform.

```javascript
var t = require( 'replace-string-transform' );

fs.createReadStream( 'before.txt' )
	.pipe( t( file, {
		find : /f(\w{0,2})p/,
		replace : function( file, match, middle ) {
			return 'f' + (middle === 'li' ? 'lo' : 'li') + 'p';
		}
	} )
	.pipe( fs.createWriteStream( 'after.txt' ) );
```

Now `after.txt` is:

```
flop
```

## License

MIT