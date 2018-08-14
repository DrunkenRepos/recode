const fs          = require('fs');
const path        = require('path');
const {encode}    = require('single-byte');
const readdirDeep = require('readdir-deep');

async function checkDirectory(dir) {
    if (!fs.existsSync(dir)) {
        await checkDirectory(path.dirname(dir));
        await fs.promises.mkdir(dir);
    } else if (!fs.lstatSync(dir).isDirectory())
        throw new Error('Specified path already exists and is not a valid directory');
    return dir;
}

async function recode({encoding, targetDir, sourceEncoding, directory, filter}) {
    const files = (await readdirDeep(directory || '.')).filter(filter || (() => true));
    targetDir      = path.resolve(process.cwd(), targetDir);
    
    for (let f of files)
        await checkDirectory(path.resolve(targetDir, path.dirname(f)));
    
    return await Promise.all(files.map(async file =>
        await fs.promises.writeFile(
            path.join(targetDir, file),
            encode(encoding, await fs.promises.readFile(file, sourceEncoding || 'utf8')),
            'binary')));
}

module.exports = recode;




