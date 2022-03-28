
export interface CardProps {
	_id: string | undefined;
	index?: number;
	likes: number | undefined;
	content: string | undefined;
	category?: string | null;
	updateCards?: Function | null;
	_colId?: string | undefined;
}

export interface ColumnProps {
	_id: string | undefined;
	index?: number;
	name: string | undefined;
	color: string | undefined;
	error?: string;
	items?: CardProps[] | undefined
}
