import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update,remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Function to check if a user has already liked a comment
function hasUserLikedComment(commentID) {
  const likedComments = JSON.parse(localStorage.getItem('likedComments')) || [];
  return likedComments.includes(commentID);
}

// Function to mark a comment as liked by the user
function markCommentAsLiked(commentID) {
  const likedComments = JSON.parse(localStorage.getItem('likedComments')) || [];
  likedComments.push(commentID);
  localStorage.setItem('likedComments', JSON.stringify(likedComments));
}

const appSettings = {
  apiKey: "AIzaSyAm-erYMkpKujaSzayqXU98Yb4O6USBBIs",
  authDomain: "playground-6276d.firebaseapp.com",
  databaseURL: "https://playground-6276d-default-rtdb.firebaseio.com/",
  projectId: "playground-6276d",
  storageBucket: "playground-6276d.appspot.com",
  messagingSenderId: "68077905857",
  appId: "1:68077905857:web:41b61d97bf32e596af3140"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const commentListInDB = ref(database, "commentList");
const likeListInDB = ref(database, "likeList");
const commentEl = document.getElementById('comment');
const buttonEl = document.getElementById('button');
const listEL = document.getElementById("listComment");
const senderEl = document.getElementById('sender');
const recipientEl = document.getElementById('recipient');

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('likeEmoji')) {
    const commentID = event.target.getAttribute('data-commentid');
    const likeCountElement = document.getElementById(`likeCount${commentID}`);
    const currentLikeCount = parseInt(likeCountElement.textContent);

    if (!hasUserLikedComment(commentID)) {
      // User hasn't liked this comment before
      const newLikeCount = currentLikeCount + 1;
      likeCountElement.textContent = newLikeCount;

      // Add the like to the likeList in Firebase
      update(likeListInDB, {
        [commentID]: newLikeCount
      });

      // Mark the comment as liked by the user
      markCommentAsLiked(commentID);

      event.target.classList.add('active');
    } else {
      // User has already liked this comment
      alert('You have already liked this comment.');
    }
  }
});

buttonEl.addEventListener('click', function () {
  let inputValue = commentEl.value.trim();
  let senderValue = senderEl.value.trim();
  let recipientValue = recipientEl.value.trim();
  if (senderValue !== "" && recipientValue !== "" && inputValue !== "") {
    let commentID = push(commentListInDB, null).key;
    let messageData = {
        sender: senderValue,
        recipient: recipientValue,
        comment: inputValue,
        commentID: commentID
    };
    push(commentListInDB, messageData);
    clearTextFieldEl();
    clearSenderRecipientFields();
}
});

onValue(commentListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let commentArray = Object.entries(snapshot.val());
    clearListEl();

    for (let index = 0; index < commentArray.length; index++) {
      let currentItem = commentArray[index];
      let currentItemID = currentItem[0];
      let currentItemValues = currentItem[1];

      appendItemToCommentList(currentItem);
    }
  } else {
    listEL.innerHTML = "nothing is found...";
  }
});
onValue(likeListInDB, function(snapshot) {
    if (snapshot.exists()) {
      const likeData = snapshot.val();
      displayLikeCounts(likeData);
    }
  });
  

function clearTextFieldEl() {
  commentEl.value = "";
}

function appendItemToCommentList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");
  newEl.innerHTML = `
    <p class="custom-text"> To ${itemValue.recipient}</p>
    ${itemValue.comment}
    <p class="custom-text2">From ${itemValue.sender} <span class="likeEmoji" data-commentid="${itemValue.commentID}">❤️<span class="likeCountEmoji" id="likeCount${itemValue.commentID}">0</span></span> </p>
    `;

    // newEl.addEventListener("dblclick", function(){
    //     let exactLocationOfItemInDB = ref(database, `commentList/${itemID}`);
    //     remove(exactLocationOfItemInDB);
    
        // Also remove the corresponding like entry
    //     update(likeListInDB, {
    //       [itemValue.commentID]: null
    //     });
    //   });

  listEL.append(newEl);
}

function clearListEl() {
  listEL.innerHTML = "";
}

function clearSenderRecipientFields() {
  senderEl.value = "";
  recipientEl.value = "";
}
function displayLikeCounts(likeData) {
    for (const commentID in likeData) {
      const likeCountElement = document.getElementById(`likeCount${commentID}`);
      if (likeCountElement) {
        likeCountElement.textContent = likeData[commentID];
      }
    }
  }