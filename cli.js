#!/usr/bin/env node
'use strict';

const recode = require('.');
const {argv} = require('yargs')
    .alias('g', 'glob')
    .alias('e', 'encoding')
    .alias('t', ['target', 'out'])
    .alias('s', 'src-encoding')
    .alias('d', ['cwd', 'src'])
    .alias('n', 'prefix')
    .alias('m', 'suffix')
    .alias('x', 'dot-files')
    .describe('g', 'Glob pattern matching files to re-encode.')
    .describe('e', 'Encoding used to write the output files.')
    .describe('t', 'Directory where the re-encoded files will be placed. (default: same as source)')
    .describe('s', 'Encoding used to read the source files. (default: UTF-8)')
    .describe('d', 'Directory used as the current working directory. (default: ./)')
    .describe('n', 'Prefix to add to output files')
    .describe('m', 'Suffix to add to output files')
    .describe('x', 'Allow files which name starts with a period (.) to be included.')
    .group(['g', 'e', 't', 's', 'd', 'n', 'm', 'x'], 'Main Options: ')
    .alias('h', 'help')
    .alias('v', 'version')
    .describe('trace', 'Print stack trace on error')
    .describe('verbose', 'Verbose console output')
    .group(['h', 'v', 'trace', 'verbose'], 'Other Options:')
    .boolean(['h', 'v', 'trace', 'verbose'])
    .demandOption(['e', 'g'])
    .strict()
    .fail(function (msg, err, yargs) {
        if (process.argv.filter(a => a !== '--trace').length <= 2) {
            console.log(yargs.help());
            process.exit(0);
        }
        console.error(`\x1b[1;31mERROR: \x1b[;31m${msg}\x1b[;33m\nUse -h for usage information\x1b[m`);
        if (process.argv.includes('--trace')) console.error(err || new Error(msg));
        process.exit(1);
    });


recode({
    outEncoding: argv.e,
    outDir: argv.t,
    srcEncoding: argv.s || 'utf8',
    globStr: argv.g,
    cwd: argv.d,
    prefix: argv.n,
    suffix: argv.m,
    dotFiles: argv.x
}).then(() => {
    console.log('\x1b[1;92mDone!\x1b[m');
}).catch(err => {
    console.error(`\x1b[1;31m${err.message}\x1b[m`);
    if (argv.trace) console.error(err);
    process.exit(1);
});