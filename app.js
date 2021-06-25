const itemList = document.querySelector('#item-list');
// This is the Add Item button and associated user input fields from index.html
const form = document.querySelector('#add-item-form');
// Get a reference to the storage service
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();

async function addTag(str, id) {
    console.log("hi");
    db.collection('Items').doc(id).collection('tags').add({
        text: str
    });
    console.log("hi 2");
}

async function getTags(doc)  {
    var str = "";
    // Not very elegant, but I searched for an hour for an alternative and couldn't find one!
    db.collection('Items').doc(doc.id)
        .collection('tags').get().then(snapshot => {
            snapshot.docs.forEach( doc => {
                //console.log(doc.data().text);
                str = str.concat("#");
                str = str.concat(doc.data().text);
                str = str.concat(" ");
            })
        console.log(str);
        return str;
        });
}

async function renderItem(doc) {
    // create a list of an item's name, color, and image
    let li = document.createElement('li');
    let name = document.createElement('span');
    let color = document.createElement('span');
    let image = document.createElement('img');
    let tag = document.createElement('input');
    let button = document.createElement('button');
    let tagList = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    color.textContent = doc.data().color;
    tag.defaultValue = "tag";
    button.textContent = "Add Tag";
    getTags(doc).then((value) => {
        console.log("hi");
        console.log(value);
    });

    // items are currently matched to their images by name
    // Daniel is working on an image storage scheme that uses references
    var currImgRef = storageRef.child(name.textContent.replace(" ", "_").concat(".png"));
    firebase.auth().signInAnonymously().then(function() {
        currImgRef.getDownloadURL().then(function(url) {
            image.src = url;
        })
    });

    button.addEventListener('click', addTag(tag.value, doc.id));

    li.appendChild(name);
    li.appendChild(color);
    li.appendChild(tag);
    li.appendChild(button);
    li.appendChild(image);
    li.appendChild(tagList);

    itemList.appendChild(li);
}

// renders each item in the Items collection in Firebase
db.collection('Items').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderItem(doc);
    })
})

// Adds a new item to the Items collection in Firebase
// Currently doesn't add an image or a reference
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // db.collection('Items').add({
    //     name:form.name.value,
    //     color: form.color.value
    // });
    form.name.value = '';
    form.color.value = '';
})

