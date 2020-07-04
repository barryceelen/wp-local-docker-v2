const { readdirSync, chmodSync } = require( 'fs' );
const { join } = require( 'path' );

function getDirectories( dir ) {
    const files = readdirSync( dir, { withFileTypes: true } );
    const results = [];
	
    for ( const file of files ) {
        if ( file.isDirectory() && file.name !== '.git' ) {
            const fullpath = join( dir, file.name );
            results.push( fullpath, ...getDirectories( fullpath ) );
        }
    }

    return results;
}

module.exports = function makeMoveRepository( chalk, spinner, { remove, move }, root ) {
    return async ( from, to ) => {
        const dest = join( root, to );

        spinner.start( `Moving cloned repository to ${ chalk.cyan( to ) }...` );
        await remove( dest );
        await move( from, dest );
        spinner.succeed( `The cloned respository is moved to ${ chalk.cyan( to ) }...` );

        chmodSync( dest, 0o755 );
        getDirectories( dest ).forEach( ( dir ) => {
            chmodSync( dir, 0o755 );
        } );

        spinner.succeed( 'Directory permisions have been updated to 0755...' );
    };
};
