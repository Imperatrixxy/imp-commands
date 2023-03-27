const getFiles = require('./getFiles');

class FeatureHandler {
    constructor(instance, featuresDir, client) {
        this.readFiles(instance, featuresDir, client);
    }

    async readFiles(instance, featuresDir, client) {
        const files = getFiles(featuresDir);

        for (const file of files) {
            const feature = require(file);

            if (feature instanceof Function) {
                await feature(instance, client);
            }
        }
    }
}

module.exports = FeatureHandler;