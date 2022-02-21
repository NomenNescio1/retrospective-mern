import { createContext } from "react";

export const ErrorContext = createContext({
 errorState: false,
 setError: (error: boolean) => {}
});
