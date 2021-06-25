const itemList = document.querySelector('#item-list');
const form = document.querySelector('#add-item-form');
// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();


function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let color = document.createElement('span');
    let image = document.createElement('img');
    let imageName = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    imageName.textContent = doc.data().imageName;
    name.textContent = doc.data().name;
    color.textContent = doc.data().color;
    var currImgRef = storageRef.child(doc.id.concat("/").concat(((imageName.textContent))));
    //var currImgRef = storageRef.child(doc.id.concat("/").concat((name.textContent.replace(" ", "_").concat(".png"))));

    console.log("currImgRef is " + currImgRef);
    console.log(name.textContent.replace(" ", "_"));
    firebase.auth().signInAnonymously().then(function() {
        console.log(currImgRef.name);
        currImgRef.getDownloadURL().then(function(url) {
            image.src = url;
        })
    });
  //  img.src = getFromStorage(name.textContent.replace(" ", "_"));

    li.appendChild(name);
    li.appendChild(color);
    li.appendChild(image);

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
    console.log("hullo");
    form.name.value = '';
    form.color.value = '';
})

