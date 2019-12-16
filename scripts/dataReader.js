const fs = require('fs');
const pathToConfig = __dirname + '/../data/config.json';

module.exports = {
    readFile: function(fileName) {
        let str = fs.readFileSync(fileName);
        let jsonData = JSON.parse(str);

        return jsonData;
    },
    readDir: function(dirName) {
        let jsonData = [];
        let files = fs.readdirSync(dirName);
        for (let i in files) {
            jsonData.push(this.readFile(dirName + files[i]));
        }
        return jsonData;
    },
    readConfig: function(key = null) {
        let config = this.readFile(pathToConfig);
        if (key === null) {
            return config;
        } else {
            return config[key];
        }
    },
    writeConfig: function(key, value) {
        let output = this.readFile(pathToConfig);
        output[key] = value;

        fs.writeFileSync(pathToConfig, JSON.stringify(output));
    }
};
