const itemList = document.querySelector('#item-list');
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
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
})


/*firebase.auth().signInAnonymously().then(function() {
    console.log("hi, adam!");
    imgRef.getDownloadURL().then(function(url)                           {
        // Once we have the download URL, we set it to our img element
        document.querySelector('img').src = url;
        //document.getElementsByClassName("coffee_shop_img");
        console.log("please print :D");
    }).catch(function(error) {
        // If anything goes wrong while getting the download URL, log the error
        console.error(error);
        console.log("hullo hullo");
    });
});*/