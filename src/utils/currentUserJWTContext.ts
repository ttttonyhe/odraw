import React from "react"

// Create Context
const currentUserJWTContext = React.createContext<string>("");

// Context Provider
export const JWTProvider = currentUserJWTContext.Provider;

export default currentUserJWTContext;