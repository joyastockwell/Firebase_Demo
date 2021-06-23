//import UploadForm from './UploadForm';
const itemList = document.querySelector('#item-list');
//console.log(UploadForm);
const form = document.querySelector('#add-item-form');
// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref()
/*var imgRef = storageRef.child('Watermelon.jpg');
console.log(imgRef);*/

function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let color = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    color.textContent = doc.data().color;

    li.appendChild(name);
    li.appendChild(color);

    itemList.appendChild(li);
}

db.collection('Items').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    })
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('Items').add({
        name:form.name.value,
        color: form.color.value
    });
    form.name.value = '';
    form.color.value = '';
})
