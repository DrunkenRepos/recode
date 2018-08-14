const recode = require('./recode');
const {argv} = require('yargs')
    .alias('e', 'encoding')
    .alias('t', 'target')
    .alias('s', 'src-encoding')
    .alias('d', 'dir')
    .default('e', 'windows-1252')
    .default('t', 'windows-1252', 'output encoding (-e)')
    .default('s', 'utf8')
    .default('d', '.', 'current working directory')
    .describe('e', 'Encoding used to write the output files.')
    .describe('t', 'Directory containing the output files.')
    .describe('s', 'Encoding used to read the source files.')
    .describe('d', 'Source directory containing the files to recode.')
    .group(['e', 't', 's', 'd'], 'Main Options: ')
    // .string(['e', 't', 's', 'd'])
    .alias('h', 'help')
    .alias('v', 'version')
    .group(['h', 'v'], 'Other Options:');


Promise.resolve(recode({
    encoding: argv.e || 'windows-1252',
    targetDir: argv.t || 'out',
    sourceEncoding: argv.s || argv.e || 'windows-1252',
    directory: argv.d || '.'
})).catch(console.error);

module.exports = recode;