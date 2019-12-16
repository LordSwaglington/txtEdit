const ipc = require('electron').ipcRenderer;
const fs = require('fs');

const showdown = require('showdown');
const converter = new showdown.Converter();
/*converter.setOption('simpleLineBreaks', true);*/

let path;

let rawtextarea;
let htmtextarea;

window.addEventListener('DOMContentLoaded', () => {
    console.log('dom loaded');
    init();
});

function init() {
    path = ipc.sendSync('getfilepath');

    rawtextarea = document.getElementById('js-rawtext');
    htmtextarea = document.getElementById('js-htmltext');

    rawtextarea.addEventListener('input', function() {
        toHtml();
    });
    htmtextarea.addEventListener('input', function() {
        toRaw();
    });

    document.getElementById('js-exit').addEventListener('click', () => exitToMainPage());
    document.getElementById('js-save').addEventListener('click', () => saveFile());
    document.getElementById('js-saveas').addEventListener('click', () => saveFileAs());

    document.getElementById('js-window-0').addEventListener('click', () => setEditorMode(0));
    document.getElementById('js-window-1').addEventListener('click', () => setEditorMode(1));
    document.getElementById('js-window-2').addEventListener('click', () => setEditorMode(2));

    setEditorMode(1);

    if (path != null) {
        let file = fs.readFileSync(path, 'utf8').toString();
        loadFile(file);
    }
}

function loadFile(file) {
    rawtextarea.innerHTML = file;
    htmtextarea.innerHTML = converter.makeHtml(file);
}

function saveFile() {
    if (path == null || path == undefined) {
        path = ipc.sendSync('getsavepath');

        if (path == null || path == undefined) {
            return;
        }
    }

    let data = rawtextarea.value;

    fs.writeFileSync(path, data);
}

function saveFileAs() {
    let newPath = ipc.sendSync('getsavepath');

    if (newPath == null || newPath == undefined) {
        return;
    } else {
        path = newPath;
    }

    let data = rawtextarea.value;

    fs.writeFileSync(path, data);
}

// 0=raw / 1=html / 2=both
function setEditorMode(mode) {
    let div0 = document.getElementById('js-rawtext');
    let div1 = document.getElementById('js-htmltext-container');
    let div2 = document.getElementById('divider');
    let btn0 = document.getElementById('js-window-0');
    let btn1 = document.getElementById('js-window-1');
    let btn2 = document.getElementById('js-window-2');

    div0.classList.add('hidden');
    div1.classList.add('hidden');
    div2.classList.add('hidden');
    btn0.classList.remove('editor-btn-active');
    btn1.classList.remove('editor-btn-active');
    btn2.classList.remove('editor-btn-active');

    switch (mode) {
        case 0:
            div0.classList.remove('hidden');
            btn0.classList.add('editor-btn-active');
            break;
        case 1:
            div1.classList.remove('hidden');
            btn1.classList.add('editor-btn-active');
            break;
        case 2:
            div0.classList.remove('hidden');
            div1.classList.remove('hidden');
            div2.classList.remove('hidden');
            btn2.classList.add('editor-btn-active');
            break;
    }
}

function toHtml() {
    console.log('converting to html');
    htmtextarea.innerHTML = converter.makeHtml(rawtextarea.value);
}

function toRaw() {
    console.log('converting to raw');
    rawtextarea.value = converter.makeMarkdown(htmtextarea.innerHTML);
}

function exitToMainPage() {
    location.href = '../index.html';
}
