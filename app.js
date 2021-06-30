const itemList = document.querySelector('#item-list');
// This is the Add Item button and associated user input fields from index.html
const form = document.querySelector('#add-item-form');
// Get a reference to the storage service
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();

async function getTags(doc)  {
    var str = "";
    // Not very elegant, but I searched for an hour for an alternative and couldn't find one!
    await db.collection('Items').doc(doc.id)
        .collection('tags').orderBy("text").get().then(snapshot => {
            console.log("hi");
            snapshot.docs.forEach( doc => {
                str = str.concat("#");
                str = str.concat(doc.data().text);
                str = str.concat(" ");
            })
        })
        .catch((error) => {
            console.log("Error in getTags for document " + doc.id + "\n", error);
        })
    return str;
}
function renderItem(doc) {
    // create html elements for the name, color, 
    // image, and list of tags
    let li = document.createElement('li');
    let name = document.createElement('span');
    let color = document.createElement('span');
    let image = document.createElement('img');
    let tagList = document.createElement('span');

    //retrieve image, name, and color
    let imageName = doc.data().imageName;
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    color.textContent = doc.data().color;
    var currImgRef = storageRef.child(doc.id.concat("/").concat(((imageName))));
    // tag.defaultValue = "tag";
    // button.textContent = "Add Tag";
    
    //retrieve tags
    getTags(doc).then(str => {
        tagList.textContent = str;
    })
    .catch((error) => {
        console.log("Error getting tags for " + name.textContent + "\n", error);
    });

    //sign into firebase anonymously and retrieve the image by its url
    firebase.auth().signInAnonymously().then(function() {
        currImgRef.getDownloadURL().then(function(url) {
            image.src = url;
        })
        .catch((error) => {
            console.log("Error getting image of " + name.textContent + "by url " + url + "\n", error);
        })
        .catch((error) => {
            console.log("Sign in error\n", error);
        })
    });

    //put all the item's info and its image into a list to be rendered
    li.appendChild(name);
    li.appendChild(color);
    li.appendChild(image);
    li.appendChild(tagList);

    itemList.appendChild(li);
}

// render each item in the Items collection in Firebase
db.collection('Items').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderItem(doc);
    })
})
.catch((error) => {
    console.log("Error getting Items collection from Firestore\n", error);
})

// Adds a tag to an item in Firebase
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Gets the item with the same name the user entered
    db.collection('Items').where("name", "==", form.itemName.value).get()
    .then((querySnapshot) => {
        // Adds tag to the tags collection of the item
        // Creates tags collection if none is present
        if(!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                db.collection('Items').doc(doc.id).collection('tags').add({
                    text: form.tagName.value
                });
            })
        }
        else {
            console.log("Tried to tag item that does not exist")
        }
    })
    .catch((error) => {
        console.log("Error getting user's item: ", error);
    });
})

