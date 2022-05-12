import React, { useEffect } from "react";
import { db } from "../firebase";
import useAsync from "../hooks/useAsync";
import { onSnapshot, query, collection, orderBy } from "firebase/firestore";
import FallbackLoading from "../components/FallbackLoading";
import Header from "../components/Header";
import styles from "../styles/SeeAll.module.css";
import useDatabase from "../hooks/useDatabase";

function queryData() {
  return query(collection(db, "users"), orderBy("createdAt"));
}

function getSnapshot(setData) {
  return onSnapshot(queryData(), querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      data.push(doc.data());
    });
    setData(data);
  });
}
function SeeAll() {
  const { followUser, currentUser } = useDatabase();
  const { status, data, setData } = useAsync();

  function followHandler(id) {
    followUser(id, currentUser.uid);
  }

  useEffect(() => {
    const unsub = getSnapshot(setData);
    return unsub;
  }, []);

  if (status === "pending") return <FallbackLoading />;

  return (
    <div className={styles["container"]}>
      <Header />
      <div className={styles["see-all-container"]}>
        <div className={styles["users-container"]}>
          {data.map((user, index) => {
            return user.uid ===
              currentUser.uid ? null : !user.followers.includes(
                currentUser.uid
              ) ? (
              <div key={index} className={styles.users}>
                <div>
                  <img src={user.photoURL} />
                  <p>{user.displayName}</p>
                </div>
                <div>
                  <button
                    className={styles.button}
                    onClick={() => followHandler(user.uid)}
                  >
                    Follow
                  </button>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

export default SeeAll;
