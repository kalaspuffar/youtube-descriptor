const low	= require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter);

const titleElement = document.getElementById('title');
const descriptionElement = document.getElementById('description');
const tagsElement = document.getElementById('tags');
const titleButton = document.getElementById('title_button');
const descriptionButton = document.getElementById('description_button');
const tagsButton = document.getElementById('tags_button');

const addItemButton = document.getElementById('add_item');
const copyItemButton = document.getElementById('copy_item');
const deleteItemButton = document.getElementById('delete_item');

var currentVideo = -1;

titleElement.addEventListener('change', updateValue);
descriptionElement.addEventListener('change', updateValue);
tagsElement.addEventListener('change', updateValue);

titleButton.addEventListener('click', () => {
    titleElement.select();
    document.execCommand('copy');
});

descriptionButton.addEventListener('click', () => {
    descriptionElement.select();
    document.execCommand('copy');
});

tagsButton.addEventListener('click', () => {
    tagsElement.select();
    document.execCommand('copy');
});

function updateValue(e) {
    if(e.target.id == 'title') {
        db.get('videos')
            .find({ id: currentVideo })
            .assign({ title: e.target.value})
            .write();
        reload();
    }

    if(e.target.id == 'description') {
        db.get('videos')
            .find({ id: currentVideo })
            .assign({ description: e.target.value})
            .write();
    }

    if(e.target.id == 'tags') {
        db.get('videos')
            .find({ id: currentVideo })
            .assign({ tags: e.target.value})
            .write();
    }
}

function handleClick(e) {
    currentVideo = e.target.dataset.id;

    const video = db.get('videos')
        .find({ id: currentVideo }).value();

    titleElement.value = video.title;
    descriptionElement.value = video.description;
    tagsElement.value = video.tags;

    var allItems = document.querySelectorAll('li');
    allItems.forEach((item) => {
        item.className = "";
    });

    e.target.className = "selected";
}

function reload() {
    const allTheVideos = db.get('videos').value();
    document.getElementById('list').innerHTML = '';
    allTheVideos.map((video) => {
        var element = document.createElement('li');
        element.dataset.id = video.id;
        element.innerHTML = video.title;
        element.onclick = handleClick;
        return element;
    }).forEach(element => {
        document.getElementById('list').appendChild(element);
    });
}

reload();

addItemButton.addEventListener('click', () => {
    currentVideo = Math.random().toString(36);
    db.get('videos')
        .push({
            id: currentVideo,
            title: 'New item (' + currentVideo + ')',
            description: '',
            tags: ''
        })
        .write();
    titleElement.value = 'New item (' + currentVideo + ')';
    descriptionElement.value = '';
    tagsElement.value = '';

    reload();
});

copyItemButton.addEventListener('click', () => {
    db.get('videos')
        .push({
            id: Math.random().toString(36),
            title: titleElement.value,
            description: descriptionElement.value,
            tags: tagsElement.value
        })
        .write();
    reload();
});

deleteItemButton.addEventListener('click', () => {
    db.get('videos')
        .remove({
            id: currentVideo
        })
        .write();

    titleElement.value = '';
    descriptionElement.value = '';
    tagsElement.value = '';
    reload();
});