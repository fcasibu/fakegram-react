import React from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { db, storage } from "../firebase";
import firebase from "firebase/compat/app";

function usersCollection(id) {
  return db.collection("users").doc(id);
}

function imageRef(id, img) {
  return storage.ref(`/images/${id}/${img.name}`);
}

async function isImagePosted(uid, img) {
  const getData = await usersCollection(uid).get();
  return getData.data().posts.some(post => post.id === img.name);
}

function postImage(uid, img, caption) {
  imageRef(uid, img)
    .getDownloadURL()
    .then(url => {
      usersCollection(uid).set(
        {
          posts: firebase.firestore.FieldValue.arrayUnion({
            caption,
            image: url,
            comments: [],
            likes: 0,
            id: img.name
          })
        },
        { merge: true }
      );
    });
}

const Header = React.memo(function Header() {
  const { currentUser } = useAuth();
  const { uid, photoURL, displayName } = currentUser;

  async function addPost(event) {
    let img = event.target.files[0];
    if (await isImagePosted(uid, img)) return;
    await imageRef(uid, img).put(img);
    postImage(uid, img, "hello");
  }

  return (
    <header className="header">
      <div>
        <h2>Site Logo</h2>
      </div>
      <div>
        <input />
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <FaHome />
            </Link>
          </li>
          <li>
            <label htmlFor="upload-file">
              <p>+</p>
              <input id="upload-file" type="file" onChange={addPost} />
            </label>
          </li>
          <li>
            <Link to={`/${uid}`}>
              <img src={photoURL} alt={displayName} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
});

export default Header;
