var through = require('through');

module.exports = function( file, options ) {
	var data = '';

	return through( write, end );

	function write( buf ) {
		var _this = this;
		var res = buf.toString( 'utf8' );

		var replace;
		if( typeof options.replace === 'function' )
			replace = function() {
				var args = Array.prototype.slice.call( arguments );
				args.unshift( file );

				return options.replace.apply( this, args );
			};
		else replace = options.replace;

		res = res.replace( options.find, replace );

		this.queue( new Buffer( res, 'utf8' ) );
	}

	function end() {
		this.queue( null );
	}
};