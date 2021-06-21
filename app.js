const itemList = document.querySelector('#item-list');
const form = document.querySelector('#add-item-form');
// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref()

function getFromStorage(stringName) {
    imgRef = storageRef.child(stringName.concat(".png"));
    /*imgRef.getDownloadURL().then(function(url) {
  var pulledProfileImage = url;
  dataArray.push(pulledProfileImage);
});*/
    firebase.auth().signInAnonymously().then(function() {
        imgRef.getDownloadURL().then(function(url) {
            console.log("hi, daniel!");
            var pulledImage = url;
            return pulledImage;
            //return url
        }) /*                          {
            // Once we have the download URL, we set it to our img element
            document.querySelector('img').src = url;
            console.log("please print :D");
        }).catch(function(error) {
            // If anything goes wrong while getting the download URL, log the error
            console.error(error);
            console.log("hullo hullo");
        });*/
    });
}

function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let color = document.createElement('span');
    let img = document.createElement('img');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    color.textContent = doc.data().color;
    img.src = getFromStorage(name.textContent.replace(" ", "_"));

    li.appendChild(name);
    li.appendChild(color);
    li.appendChild(img);

    itemList.appendChild(li);
}

db.collection('Items').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    })
})

/*form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('Items').add({
        name:form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
})*/

imgRef2 = storageRef.child("cowimage.jpeg");
firebase.auth().signInAnonymously().then(function() {
    imgRef2.getDownloadURL().then(function(url) {
        console.log("hi, daniel again!");
        document.querySelector('img').src = url;
        //return url
    })
});