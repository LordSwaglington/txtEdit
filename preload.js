const config = require('./scripts/configReader');
const colorTheme = require('./scripts/colorTheme');

window.addEventListener('DOMContentLoaded', () => {
    setTheme();
});

function setTheme() {
    // set color theme
    let themes = config.readDir(__dirname + '/themes/');
    let activeTheme = config.readConfig('color-theme');
    console.log(activeTheme);
    for (let theme of themes) {
        if (theme.name == activeTheme) {
            colorTheme.setColorTheme(theme);
            break;
        }
    }
}
