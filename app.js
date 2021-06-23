const itemList = document.querySelector('#item-list');
// This is the Add Item button and associated user input fields from index.html
const form = document.querySelector('#add-item-form');
// Get a reference to the storage service
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();

function renderItem(doc) {
    // create a list of an item's name, color, and image
    let li = document.createElement('li');
    let name = document.createElement('span');
    let color = document.createElement('span');
    let image = document.createElement('img');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    color.textContent = doc.data().color;

    // items are currently matched to their images by name
    // Daniel is working on an image storage scheme that uses references
    var currImgRef = storageRef.child(name.textContent.replace(" ", "_").concat(".png"));
    firebase.auth().signInAnonymously().then(function() {
        currImgRef.getDownloadURL().then(function(url) {
            image.src = url;
        })
    });

    li.appendChild(name);
    li.appendChild(color);
    li.appendChild(image);

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
    db.collection('Items').add({
        name:form.name.value,
        color: form.color.value
    });
    form.name.value = '';
    form.color.value = '';
})

