import React from "react"

// Create Context
const currentUserContext = React.createContext<string>("");

// Context Provider
export const Provider = currentUserContext.Provider;

export default currentUserContext;