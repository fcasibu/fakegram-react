import { useContext } from "react";
import DatabaseContext from "../context/DatabaseContext";

function useDatabase() {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error("useDatabase should be inside a DatabaseProvider");
  }

  return context;
}

export default useDatabase;
