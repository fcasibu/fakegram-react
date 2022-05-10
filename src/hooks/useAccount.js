import { useReducer } from "react";

function accountReducer(state, action) {
  switch (action.type) {
    case "idle": {
      return { status: "idle", data: null, error: null };
    }
    case "resolved": {
      return { status: "resolved", data: action.data, error: null };
    }
    case "rejected": {
      return { status: "rejected", data: null, error: action.error };
    }
    default: {
      throw new Error(`Unexpected action type: ${action.type}`);
    }
  }
}

function useAccount(initialState = {}) {
  const [state, dispatch] = useReducer(accountReducer, {
    status: "idle",
    data: {
      email: null,
      displayName: null,
      password: null
    },
    error: null,
    ...initialState
  });

  function setState({ type, data = null, error = null }) {
    dispatch({ type, data, error });
  }

  return { ...state, setState };
}

export default useAccount;
