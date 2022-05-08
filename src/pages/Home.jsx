import React, { useState, useEffect } from "react";
import FallbackLoading from "../components/FallbackLoading";
import Header from "../components/Header";
import MainView from "../components/MainView";
import { db } from "../firebase";
import useAsync from "../hooks/useAsync";
import {
  onSnapshot,
  query,
  collection,
  limitToLast,
  orderBy
} from "firebase/firestore";

function queryData() {
  return query(collection(db, "users"), orderBy("createdAt"), limitToLast(7));
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

function Home() {
  const { status, data, followUser, setData } = useAsync();

  useEffect(() => {
    const unsub = getSnapshot(setData);
    console.log(data, "hello");
    return unsub;
  }, []);

  if (status === "pending") return <FallbackLoading />;

  return (
    <div className="container">
      <Header />
      <MainView users={data} followUser={followUser} />
    </div>
  );
}

export default Home;
