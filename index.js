const {existsSync, lstatSync: stat, promises: fsp} = require('fs');
const {resolve, dirname, join, basename, extname } = require('path');
const {encode} = require('single-byte');
const glob     = require('tiny-glob');

/**
 * Create a directory and its parent directroies if they do not exist.
 *
 * @param {string} dir The directory to create
 * @returns {string} The created directory
 */
async function mkdir(dir) {
    if (!existsSync(dir)) {
        await mkdir(dirname(dir));
        await fsp.mkdir(dir);
    } else if (!stat(dir).isDirectory())
        throw new Error('Specified path already exists and is not a valid directory');
    return dir;
}

/**
 * Read files, re-encode their content to a specific encoding and save
 * the file with that encoding.
 *
 * @param {Object} args Arguments object
 * @param {string} args.outEncoding Output files encoding
 * @param {string} args.globStr Glob matching the files to re-encode
 * @param {string} [args.outDir] Output directory
 * @param {string} [args.cwd] Path to use as the current working directory
 * @param {string} [args.srcEncoding] Source files encoding
 * @param {function} [args.filter] Function used to filter the files to re-encode
 * @param {boolean} [args.dotFiles] Whether to include files starting with a period (.) or not
 * @param {string} [args.prefix] Prefix to add to the output files name
 * @param {string} [args.suffix] Suffix to add to the output files name
 * @returns 
 */
async function recode({ outEncoding, globStr, outDir, cwd, srcEncoding, filter, dotFiles, prefix, suffix }) {
    const files = (await glob(globStr || './**/*', { filesOnly: true, dot: dotFiles, cwd })).filter(filter || (() => true));
    outDir      = outDir && resolve(cwd || process.cwd(), outDir);
    
    return await Promise.all(files.map(async file => {
        file = (prefix||'') + basename(file, extname(file)) + (suffix||'') + extname(file);
        file = join(cwd || process.cwd(), file);
        const out = outDir && join(await mkdir(join(outDir, dirname(file))), basename(file));
        
        const c1= '\x1b[1;93m', c2 = '\x1b[0;94m', c3 = '\x1b[1;95m', r = '\x1b[m';
        if (process.argv.includes('--verbose'))
            console.log(`${c1}Encoding ${c2}${file}${c1} [${c3}${srcEncoding || 'utf8'}${c1}]  \u25ba  ${c2}${out || file}${r} [${c3}${outEncoding}${c1}]`);

        await fsp.writeFile(out || file, encode(outEncoding, await fsp.readFile(file, srcEncoding || 'utf8')), 'binary');
    }));
}

module.exports = recode;




