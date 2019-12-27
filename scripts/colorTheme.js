const config = require('../scripts/configReader');

module.exports = {
    setColorTheme: function(theme) {
        console.log(`theme set to ${theme.name}`);
        let colors = theme.colors;
        for (let key of Object.keys(colors)) {
            document.documentElement.style.setProperty(key, colors[key]);
        }
    },
    saveColorTheme: function(theme) {
        config.writeConfig('color-theme', theme.name);
    }
};
