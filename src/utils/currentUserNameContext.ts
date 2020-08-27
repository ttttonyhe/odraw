import React from "react"

// Create Context
const currentUserNameContext = React.createContext<string>("");

// Context Provider
export const NameProvider = currentUserNameContext.Provider;

export default currentUserNameContext;