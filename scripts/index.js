const ipc = require('electron').ipcRenderer;

window.addEventListener('DOMContentLoaded', () => {
    console.log('dom loaded');
    init();
});

function init() {
    document.getElementById('js-newfile').addEventListener('click', () => {
        ipc.send('newfile');
    });

    document.getElementById('js-openfile').addEventListener('click', () => {
        ipc.send('openfile');
    });
}

/*
function openFile(path) {
    // ipc.send('file', path);
    config.openfile = path;
    location.href = __dirname + '/views/editor.html';
}
*/
