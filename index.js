const fs = require('fs');

const getBuffersForAllFilesInDirectory = (dir) => {
    const buffers = fs.readdirSync(dir).map(file => fs.readFileSync(`${dir}/${file}`)).reduce((acc, buffer) => {
        acc.push(buffer);
        return acc;
    }, []);
    return buffers;
};

const calculateBufferLength = (buffers) => {
    return buffers.reduce((acc, buffer) => {
        acc += buffer.length;
        return acc;
    }, 0);
}

const fuseFiles = (inputFilesPath, outputFilePath) => {
    try {
        let buffers = [];
        for (const inputFilePath of inputFilesPath) {
            const stats = fs.statSync(inputFilePath);
            if (stats.isDirectory()) {
                buffers = buffers.concat(getBuffersForAllFilesInDirectory(inputFilePath));
            } else {
                buffers.push(fs.readFileSync(inputFilePath));
            }
        }
        const bufferLength = calculateBufferLength(buffers);
        const concatenatedBuffer = Buffer.concat(buffers, bufferLength);
        fs.writeFileSync(outputFilePath, concatenatedBuffer);            
    } catch(error) {
        throw error;
    }
}

module.exports = fuseFiles;