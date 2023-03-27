const fs = require('fs');
const path = require('path');

function getFiles(filePath, foldersOnly = false) {
    const files = fs.readdirSync(filePath, {
        withFileTypes: true,
    });

    const suffix = '.js';
    let theFiles = [];

    for(const file of files) {
        const fileName = path.join(filePath, file.name);
        if (file.isDirectory()) {
            if (foldersOnly) {
                theFiles.push(fileName);
            } else {
                theFiles = [
                    ...theFiles,
                    ...getFiles(fileName),
                ]
            }
        } else if (fileName.endsWith(suffix)) {
            theFiles.push(fileName);
        }
    }

    return theFiles;
}

module.exports = getFiles;