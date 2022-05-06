import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MainView from "../components/MainView";
import { db } from "../firebase";

function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function getData() {
      const snapshot = await db.collection("users").get();
      snapshot.docs.forEach(doc => {
        setUsers(state => [...state, doc.data()]);
      });
    }

    getData();
  }, []);

  return (
    <div className="container">
      <Header />
      <MainView users={users} />
    </div>
  );
}

export default Home;
