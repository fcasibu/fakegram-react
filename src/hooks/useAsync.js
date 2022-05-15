import { useReducer, useCallback } from "react";

function asyncReducer(state, action) {
  switch (action.type) {
    case "pending": {
      return { status: "pending", data: null, error: null };
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

function useAsync(initialState = {}) {
  const [state, dispatch] = useReducer(asyncReducer, {
    status: "pending",
    data: null,
    error: null,
    ...initialState
  });

  const runAsync = useCallback(
    promise => {
      dispatch({ type: "pending" });
      promise
        .then(data => {
          dispatch({ type: "resolved", data });
        })
        .catch(error => {
          dispatch({ type: "rejected", error });
        });
    },
    [dispatch]
  );

  const setData = useCallback(data => {
    dispatch({ type: "resolved", data });
  }, [dispatch]);

  return { ...state, runAsync, setData };
}

export default useAsync;
