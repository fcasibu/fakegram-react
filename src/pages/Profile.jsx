import React, { useEffect } from "react";
import ProfileView from "../components/ProfileView";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import useAsync from "../hooks/useAsync";
import { doc, onSnapshot } from "firebase/firestore";
import FallbackLoading from "../components/FallbackLoading";
import Modal from "../components/Modal";
import PostModal from "../components/PostModal";
import useModal from "../hooks/useModal";

async function getData(userID) {
  const data = await db.collection("users").get();
  return data.docs.filter(doc => doc.data().uid === userID)[0].data();
}

function Profile() {
  const { userID } = useParams();
  const { closeModal, isModalOpen, openModal } = useModal();
  const { status, data, runAsync } = useAsync();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", userID), doc => {
      runAsync(getData(doc.data().uid));
    });
    return unsub;
  }, [userID]);

  if (status === "pending") return <FallbackLoading />;

  if (status === "resolved") {
    return (
      <>
        {isModalOpen && (
          <Modal
            closeModal={closeModal}
            component={<PostModal user={data} closeModal={closeModal} />}
          />
        )}
        <ProfileView user={data} openModal={openModal} />;
      </>
    );
  }
}

export default Profile;
