import { createContext } from 'react';
import { FetchContextType } from '../utils/types';

export const FetchContext = createContext<FetchContextType>({
    shouldFetch: false,
    setShouldFetch: (el) => {}
})
