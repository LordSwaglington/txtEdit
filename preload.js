const dataReader = require('./scripts/dataReader');
const colorTheme = require('./scripts/colorTheme');

window.addEventListener('DOMContentLoaded', () => {
    setTheme();
});

function setTheme() {
    // set color theme
    let themes = dataReader.readDir(__dirname + '/themes/');
    let activeTheme = dataReader.readConfig('color-theme');
    console.log(activeTheme);
    for (let theme of themes) {
        if (theme.name == activeTheme) {
            colorTheme.setColorTheme(theme);
            break;
        }
    }
}
