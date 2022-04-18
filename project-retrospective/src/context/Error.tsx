import { createContext } from "react";
import { ErrorState, ErrorContextType } from '../utils/types'

export const ErrorContext = createContext<ErrorContextType>({
    state: false,
    message: '',
    setError: ({ state, message }: ErrorState) => {}
});
