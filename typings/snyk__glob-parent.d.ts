// Type definitions for glob-parent 5.1
// Project: https://github.com/gulpjs/glob-parent
// Definitions by: mrmlnc <https://github.com/mrmlnc>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "@snyk/glob-parent"{
    function globParent(pattern: string, options?: globParent.Options): string;

    namespace globParent {
        interface Options {
            flipBackslashes?: boolean;
        }
    }
    export = globParent;
}
