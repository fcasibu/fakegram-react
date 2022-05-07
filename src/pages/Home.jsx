import React, { useState, useEffect } from "react";
import FallbackLoading from "../components/FallbackLoading";
import Header from "../components/Header";
import MainView from "../components/MainView";
import { db } from "../firebase";
import useAsync from "../hooks/useAsync";

async function getData() {
  const data = [];
  const snapshot = await db.collection("users").get();
  snapshot.docs.forEach(doc => {
    data.push(doc.data());
  });
  return data;
}

function Home() {
  const { status, data, error, runAsync } = useAsync();

  useEffect(() => {
    runAsync(getData());
  }, []);

  if (status === "pending") return <FallbackLoading />;

  return (
    <div className="container">
      <Header />
      <MainView users={data} />
    </div>
  );
}

export default Home;
