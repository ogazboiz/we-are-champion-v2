//javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";


const appSettings = {
    apiKey: "AIzaSyAm-erYMkpKujaSzayqXU98Yb4O6USBBIs",
    authDomain: "playground-6276d.firebaseapp.com",
    databaseURL: "https://playground-6276d-default-rtdb.firebaseio.com/",
    projectId: "playground-6276d",
    storageBucket: "playground-6276d.appspot.com",
    messagingSenderId: "68077905857",
    appId: "1:68077905857:web:41b61d97bf32e596af3140"
  };

const app = initializeApp(appSettings)
const database = getDatabase(app)
const commentListInDB = ref(database, "commentList")
const commentEl = document.getElementById('comment')
const buttonEl = document.getElementById('button')
const listEL  = document.getElementById("listComment")
const senderEl = document.getElementById('sender');
const recipientEl = document.getElementById('recipient');



buttonEl.addEventListener('click', function () {
    let inputValue = commentEl.value
    let senderValue = senderEl.value;
    let recipientValue = recipientEl.value;
    let messageData = {
        sender: senderValue,
        recipient: recipientValue,
        comment: inputValue
    };
    push(commentListInDB, messageData)
    clearTextFieldEl()
    clearSenderRecipientFields();
})
onValue(commentListInDB, function(snapshot){
    if(snapshot.exists()){
        let commentArray = Object.entries(snapshot.val())
        clearListEl()
    
            for (let index = 0; index < commentArray.length; index++) {
            let currentItem= commentArray[index]
            let currentItemID = currentItem[0]
            let currentItemValues= currentItem[1]
                
        
            appendItemToCommentList(currentItem)
        
            }
    }
    else{
        listEL.innerHTML= "nothing is found..."
    }

   
    
})
function clearTextFieldEl() {
    commentEl.value = "" 
}
function appendItemToCommentList(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let  newEl = document.createElement("li")
    newEl.innerHTML = `
    <p class="custom-text"> To ${itemValue.recipient}</p>
    ${itemValue.comment}
    <p class="custom-text2"> From ${itemValue.sender} <span>❤️ 4</span></p>
    
    `;

    newEl.addEventListener("dblclick", function(){

        let exactLocationOfItemInDB = ref(database, `commentList/${itemID}`)

        remove(exactLocationOfItemInDB )
        // console.log(itemID)
    })
    listEL.append(newEl)


}

function clearListEl() {
    listEL.innerHTML =  ""
}
function clearSenderRecipientFields() {
    senderEl.value = "";
    recipientEl.value = "";
}