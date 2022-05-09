import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import useModal from "../hooks/useModal";
import styles from "../styles/Modal.module.css";

function UploadModal() {
  const { addPost } = useAuth();
  const { closeModal } = useModal();
  const [file, setFile] = useState({});
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState();
  const [disable, setDisable] = useState(true);

  function changeHandler(event) {
    setFile(event.target.files[0]);
    setDisable(false);
  }
  async function sharePost() {
    setLoading(true);
    setDisable(true);
    await addPost(file, caption);
    closeModal();
  }

  return (
    <div className={styles["upload-modal"]}>
      <h2>Upload your photos here</h2>
      <p>{file && file.name}</p>
      <label htmlFor="upload-file">
        <button>Select from computer</button>
        <input id="upload-file" type="file" onChange={changeHandler} />
      </label>
      <div className={styles["caption"]}>
        <textarea
          placeholder="Your caption"
          value={caption}
          onChange={e => setCaption(e.target.value)}
        ></textarea>
      </div>
      <div className={styles.share}>
        <button disabled={disable} onClick={sharePost}>
          {loading ? "Loading..." : "Share"}
        </button>
      </div>
    </div>
  );
}

export default UploadModal;
