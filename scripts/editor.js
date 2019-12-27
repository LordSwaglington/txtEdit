// requires
const ipc = require('electron').ipcRenderer;
const fs = require('fs');

const showdown = require('showdown');
const converter = new showdown.Converter();

// variables
let path;

let marktextarea;
let htmltextarea;

let tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'blockquote', 'li'];

// init
window.addEventListener('DOMContentLoaded', () => {
    console.log('dom loaded');
    init();
});

function init() {
    // get elements
    marktextarea = document.getElementById('js-marktext');
    htmltextarea = document.getElementById('js-htmltext');

    // add input listeners
    // used to sync text views
    marktextarea.addEventListener('input', () => {
        toHtml();
    });
    htmltextarea.addEventListener('input', () => {
        toMark();
    });

    // add listeners
    document.getElementById('js-exit').addEventListener('click', () => exitToMainPage());
    document.getElementById('js-save').addEventListener('click', () => saveFile());
    document.getElementById('js-saveas').addEventListener('click', () => saveFileAs());

    document.getElementById('js-window-0').addEventListener('click', () => setEditorMode(0));
    document.getElementById('js-window-1').addEventListener('click', () => setEditorMode(1));
    document.getElementById('js-window-2').addEventListener('click', () => setEditorMode(2));

    // buttons
    for (let i = 0; i < tags.length; i++) {
        document.getElementById(`js-text-${tags[i]}`).addEventListener('click', () => {
            replaceSelectionWithHtml(`<${tags[i]}>${getSelectionText()}</${tags[i]}>`);
            toMark();
        });
    }

    // code buttons
    document.getElementById('js-text-code').addEventListener('click', () => {
        replaceSelectionWithHtml(`<code>${getSelectionText()}</code>`);
        toMark();
    });
    document.getElementById('js-text-codeblock').addEventListener('click', () => {
        replaceSelectionWithHtml(`<pre><code>${getSelectionText()}</code></pre>`);
        toMark();
    });

    // set editor view to html
    setEditorMode(1);

    // loads file if one is loaded
    path = ipc.sendSync('getfilepath');
    if (path != null) {
        let file = fs.readFileSync(path, 'utf8').toString();
        loadFile(file);
    }
}

// loads txt file into view
function loadFile(file) {
    marktextarea.innerHTML = file;
    htmltextarea.innerHTML = converter.makeHtml(file);
}

// saves view into txt file
function saveFile() {
    if (path == null || path == undefined) {
        path = ipc.sendSync('getsavepath');

        if (path == null || path == undefined) {
            return;
        }
    }

    let data = marktextarea.value;

    fs.writeFileSync(path, data);
}

// saves view into txt file with changable path
function saveFileAs() {
    let newPath = ipc.sendSync('getsavepath');

    if (newPath == null || newPath == undefined) {
        return;
    } else {
        path = newPath;
    }

    let data = marktextarea.value;

    fs.writeFileSync(path, data);
}

// sets editor view mode
// 0=mark / 1=html / 2=both
function setEditorMode(mode) {
    let div0 = document.getElementById('js-marktext');
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

// converts html to markdown
function toHtml() {
    console.log('converting to html');
    htmltextarea.innerHTML = converter.makeHtml(marktextarea.value);
}

// converts markdown to html
function toMark() {
    console.log('converting to mark');
    marktextarea.value = converter.makeMarkdown(htmltextarea.innerHTML);
}

// back to main menu
function exitToMainPage() {
    location.href = '../index.html';
}

// returns selected text
function getSelectionText() {
    let text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != 'Control') {
        text = document.selection.createRange().text;
    }
    return text;
}

function replaceSelectionWithHtml(html) {
    var range;
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        var div = document.createElement('div');
        div.innerHTML = html;
        var frag = document.createDocumentFragment(),
            child;
        while ((child = div.firstChild)) {
            frag.appendChild(child);
        }
        range.insertNode(frag);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.pasteHTML(html);
    }
}
