const ipc = require('electron').ipcRenderer;
const config = require(__dirname + '/scripts/configReader');
const fs = require('fs');

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

    showRecentFiles();
}

function showRecentFiles() {
    let container = document.getElementById('js-recent');
    let files = config.readConfig('files-recent');
    let titleLength = 12;

    if (files == undefined || files.length == 0) {
        document.getElementById('js-recent-container').style.display = 'none';
        return;
    }

    // remove files that dont exist
    for (let i = 0; i < files.length; i++) {
        if (!fs.existsSync(files[i])) {
            files.splice(i, 1);
        }
    }

    // write to config with deleted files removed
    config.writeConfig('files-recent', files);

    // add html
    for (let i = 0; i < files.length; i++) {
        let parts = files[i].split('\\');
        let title = parts[parts.length - 1];
        if (title.length > titleLength) {
            title = title.substring(0, titleLength - 3) + '...';
        }

        container.innerHTML += `<div class="box" id="file-${i}">
                    <p>${title}</p>
                    <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    >
                    <defs>
                    <path d="M2 2L14 2L14 3L2 3L2 2Z" id="aFJ11kZFw"></path>
                    <path d="M5 4L11 4L11 5L5 5L5 4Z" id="a2ttmkM8nc"></path>
                    <path d="M2 6L14 6L14 7L2 7L2 6Z" id="e2XtEvT6iB"></path>
                    <path d="M5 8L11 8L11 9L5 9L5 8Z" id="a2CBhPVnDU"></path>
                    <path d="M2 10L14 10L14 11L2 11L2 10Z" id="a31JvWfQAF"></path>
                    <path d="M5 12L11 12L11 13L5 13L5 12Z" id="betC0YJbi"></path>
                    </defs>
                    <g>
                    <g>
                    <g>
                    <use
                    xlink:href="#aFJ11kZFw"
                    opacity="1"
                    fill="#000000"
                    fill-opacity="1"
                    ></use>
                    </g>
                    <g>
                    <use
                    xlink:href="#a2ttmkM8nc"
                    opacity="1"
                    fill="#000000"
                    fill-opacity="1"
                    ></use>
                    </g>
                    <g>
                    <use
                    xlink:href="#e2XtEvT6iB"
                    opacity="1"
                    fill="#000000"
                    fill-opacity="1"
                    ></use>
                    </g>
                    <g>
                    <use
                    xlink:href="#a2CBhPVnDU"
                    opacity="1"
                    fill="#000000"
                    fill-opacity="1"
                    ></use>
                    </g>
                    <g>
                    <use
                    xlink:href="#a31JvWfQAF"
                    opacity="1"
                    fill="#000000"
                    fill-opacity="1"
                    ></use>
                    </g>
                    <g>
                    <use
                    xlink:href="#betC0YJbi"
                    opacity="1"
                    fill="#000000"
                    fill-opacity="1"
                    ></use>
                    </g>
                    </g>
                    </g>
                    </svg>
                    </div>`;
    }
}
