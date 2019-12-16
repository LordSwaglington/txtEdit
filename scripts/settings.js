const ipc = require('electron').ipcRenderer;
const dataReader = require('../scripts/dataReader');
const colorTheme = require('../scripts/colorTheme');

let btnList = [];
let themes = dataReader.readDir(__dirname + '/../themes/');

window.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    // color themes
    addThemeList();

    // fonts
    setDefaulfValues();
    addFontListeners();

    document.getElementById('js-popup-save').addEventListener('click', saveSettings);
    document.getElementById('js-popup-cancel').addEventListener('click', resetSettings);
}

// shows the save popup
function showSaveButton() {
    let popup = document.getElementById('js-popup');

    popup.classList.remove('popup-hidden');
    popup.classList.add('popup-up');

    // reset animation
    popup.style.animation = 'none';
    popup.offsetHeight;
    popup.style.animation = 'popup-up';
}

// hides popup
function hideSaveButton() {
    let popup = document.getElementById('js-popup');

    popup.classList.remove('popup-up');
    popup.classList.add('popup-down', 'popup-hidden');

    // reset animation
    popup.style.animation = 'none';
    popup.offsetHeight;
    popup.style.animation = 'popup-down';
}

// writes settings to config
function saveSettings() {
    let basefont = document.getElementById('base-font');
    let h1font = document.getElementById('h1-font');
    let h2font = document.getElementById('h2-font');
    let h3font = document.getElementById('h3-font');

    dataReader.writeConfig('font-size-base', basefont.value);
    dataReader.writeConfig('font-size-h1', h1font.value);
    dataReader.writeConfig('font-size-h2', h2font.value);
    dataReader.writeConfig('font-size-h3', h3font.value);

    hideSaveButton();
}

function resetSettings() {
    hideSaveButton();
    activeTheme = getActiveTheme();
    changeTheme(activeTheme);
}

//#region color settings

// fills html theme list
// with themes found in themes folder
function addThemeList() {
    let themeList = document.getElementById('js-theme-list');
    // clear list for refresh
    themeList.innerHTML = '';

    // create list
    // put default themes on top
    for (let i in themes) {
        if (themes[i]['sort-top'] == true) {
            let element = `
            <li id="js-theme-${i}" class="list-item">${themes[i].name}
                <span class="color-box-container">
                <span class="color-box" style="background-color: 
                    ${themes[i].colors['--color-highlight-0']};"></span>
                <span class="color-box" style="background-color: 
                    ${themes[i].colors['--main-color-front-0']}"></span>
                <span class="color-box" style="background-color: 
                    ${themes[i].colors['--main-color-back-0']}"></span>
            </span>
            </li>`;
            themeList.innerHTML += element;
        }
    }

    themeList.innerHTML += '<hr class="hr2" />';

    for (let i in themes) {
        if (themes[i]['sort-top'] == false) {
            let element = `
            <li id="js-theme-${i}" class="list-item">${themes[i].name} 
            <span class="color-box-container">    
                <span class="color-box" style="background-color: 
                    ${themes[i].colors['--color-highlight-0']};"></span>
                <span class="color-box" style="background-color: 
                    ${themes[i].colors['--main-color-front-0']}"></span>
                <span class="color-box" style="background-color: 
                    ${themes[i].colors['--main-color-back-0']}"></span>
            </span>
            </li>`;
            themeList.innerHTML += element;
        }
    }

    // add event listeners
    for (let i in themes) {
        let element = document.getElementById(`js-theme-${i}`);
        element.addEventListener('click', function() {
            changeTheme(themes[i]);
            showSaveButton();
        });

        btnList.push(element);
    }

    updateActiveBtn();
}

// used to change theme in realtime
function changeTheme(theme) {
    colorTheme.setColorTheme(theme);
    activeTheme = theme;

    colorTheme.saveColorTheme(theme);
    updateActiveBtn();
}

// gets current theme
function getActiveTheme() {
    let aTheme = dataReader.readConfig('color-theme');
    for (let theme of themes) {
        if (theme.name == aTheme) {
            colorTheme.setColorTheme(theme);
            break;
        }
    }

    return aTheme;
}

// updates the buttons to show active theme
function updateActiveBtn() {
    activeTheme = getActiveTheme();

    for (let i in btnList) {
        if (themes[i].name == activeTheme) {
            btnList[i].classList.add('list-item-active');
        } else {
            btnList[i].classList.remove('list-item-active');
        }
    }
}

//#endregion

//#region font settings

// set default values
function setDefaulfValues() {
    let basefont = document.getElementById('base-font');
    let h1font = document.getElementById('h1-font');
    let h2font = document.getElementById('h2-font');
    let h3font = document.getElementById('h3-font');

    basefont.value = dataReader.readConfig('font-size-base');
    h1font.value = dataReader.readConfig('font-size-h1');
    h2font.value = dataReader.readConfig('font-size-h2');
    h3font.value = dataReader.readConfig('font-size-h3');
}

// adds event listeners
function addFontListeners() {
    let basefont = document.getElementById('base-font');
    let h1font = document.getElementById('h1-font');
    let h2font = document.getElementById('h2-font');
    let h3font = document.getElementById('h3-font');

    basefont.addEventListener('change', function() {
        document.documentElement.style.setProperty(
            '--font-size-base',
            `${clampNumbers(basefont.value, 1, 100)}px`
        );
        basefont.value = clampNumbers(basefont.value, 1, 100);
    });

    h1font.addEventListener('change', function() {
        document.documentElement.style.setProperty(
            '--font-size-head1',
            `${clampNumbers(h1font.value, 1, 100)}px`
        );
        h1font.value = clampNumbers(h1font.value, 1, 100);
    });

    h2font.addEventListener('change', function() {
        document.documentElement.style.setProperty(
            '--font-size-head2',
            `${clampNumbers(h2font.value, 1, 100)}px`
        );
        h2font.value = clampNumbers(h2font.value, 1, 100);
    });

    h3font.addEventListener('change', function() {
        document.documentElement.style.setProperty(
            '--font-size-head3',
            `${clampNumbers(h3font.value, 1, 100)}px`
        );
        h3font.value = clampNumbers(h3font.value, 1, 100);
    });
}

// used to clamp input values
function clampNumbers(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

//#endregion
