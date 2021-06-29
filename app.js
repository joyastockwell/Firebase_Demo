const itemList = document.querySelector('#item-list');
// This is the Add Item button and associated user input fields from index.html
const form = document.querySelector('#add-item-form');
// This is the color filter button
const colorForm = document.querySelector('#filter-by-color-form')
// Get a reference to the storage service
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();

async function getTags(doc)  {
    var str = "";
    // Not very elegant, but I searched for an hour for an alternative and couldn't find one!
    await db.collection('Items').doc(doc.id)
        .collection('tags').get().then(snapshot => {
            snapshot.docs.forEach( doc => {
                str = str.concat("#");
                str = str.concat(doc.data().text);
                str = str.concat(" ");
            })
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

//    let imageName = document.createElement('span');
//    let tag = document.createElement('input');
//    let button = document.createElement('button');

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
    });

    // items are currently matched to their images by name
    // Daniel is working on an image storage scheme that uses references
    //var currImgRef = storageRef.child(name.textContent.replace(" ", "_").concat(".png"));
    firebase.auth().signInAnonymously().then(function() {
        currImgRef.getDownloadURL().then(function(url) {
            image.src = url;
        })
    });
    // .catch( error => {
    //     console.log("Error getting image of item " + name.textContent, error);
    // });

    // button.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     db.collection('Items').doc(doc.id).collection('tags').add({
    //         text: tag.value
    //     });
    //     button.value="tag";
    // })

    li.appendChild(name);
    li.appendChild(color);
    // li.appendChild(tag);
    // li.appendChild(button);
    li.appendChild(image);
    li.appendChild(tagList);

    itemList.appendChild(li);
}


// renders each item in the Items collection in Firebase
db.collection('Items').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data().color);
        if(currColor == "" || currColor == "all") renderItem(doc);
        else if(currColor == doc.data().color) renderItem(doc);
    })
})

// Adds a tag to an item in Firebase
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Gets the item with the same name the user entered
    db.collection('Items').where("name", "==", form.itemName.value).get()
    .then((querySnapshot) => {
        // TODO: Adds tag to item
        if(!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                db.collection('Items').doc(doc.id).collection('tags').add({
                    text: form.tagName.value
                });
            })
            db.collection('users').doc('UnssDuX1ywdCwTFIqMOT').update({
                preferredColor: "pink"
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

colorForm.addEventListener('submit', (e) => {
    e.preventDefault();
        //Goes into this when user submits a color to be filtered
        db.collection('users').doc('UnssDuX1ywdCwTFIqMOT').update({
            preferredColor: colorForm.colorName.value //Accesses the color submitted
        }) 
})