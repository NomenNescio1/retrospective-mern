export const API_ENDPOINT = 'http://localhost:3001';

export interface CardProps {
	_id: string | undefined;
	likes: number | undefined;
	content: string | undefined;
	category?: string | null;
	updateCards?: Function | null;
}

export interface ColumnProps {
	_id: number | undefined;
	name: string | undefined;
	color: string | undefined;
}

export const ALL_COLORS = [
	'bisque', 'plum', 'teal'
];
