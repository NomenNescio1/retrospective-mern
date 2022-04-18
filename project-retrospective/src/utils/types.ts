
export interface CardProps {
	_id: string | undefined;
	index?: number;
	likes: number | undefined;
	content: string | undefined;
	category?: string | null;
	updateCards?: Function | null;
	_colId?: string | undefined;
	color?: string;
}

export interface ColumnProps {
	_id: string | undefined;
	index?: number;
	name: string | undefined;
	color: string | undefined;
	error?: string;
	items?: CardProps[] | undefined;
}

export interface ColumnsType { foundCard: boolean, count: number };

export interface ErrorState {
	state: boolean,
	message?: string | undefined,
	variant?: string | undefined
}

export interface ErrorContextType extends ErrorState {
	setError: ({ state, message }: ErrorState) => void
}

export interface FetchContextType {
	shouldFetch: boolean
	setShouldFetch: (el: boolean) => void
}