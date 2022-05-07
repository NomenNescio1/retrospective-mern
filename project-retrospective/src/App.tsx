import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { Header } from './components/Header';
import Column from './components/Column';
import { API_ENDPOINT } from './utils/utils';
import { ColumnProps, ErrorState } from './utils/types';
import { ErrorContext } from './context/Error';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { ColumnsContainer } from './utils/components';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
	const [columnsState, setColumn] = useState<ColumnProps[]>([]);
	const [errorState, setError] = useState<ErrorState>({ state: false, message: '' as string });
	const errorContextValue = useMemo(() => ({ ...errorState, setError }), [errorState]);

	useEffect(() => {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), 8000);

		async function getColumns(): Promise<void> {

			try {
				const response = await fetch(`${API_ENDPOINT}/getcolumn/`, {
					signal: controller.signal
				});
				let data = await response.json();
				setColumn(data);

			} catch (error) {
				setError({ state: true, message: 'It seems the server is not responding. Try again?' });
			}
		}

		clearTimeout(id);
		getColumns();

	}, []);

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		const { source, destination } = result;
		let columns = [...columnsState];
		const sourceCol = columns.find(el => el._id === source.droppableId);
		const destCol = columns.find(el => el._id === destination.droppableId);
		let item = sourceCol?.items?.find(el => el._id === result.draggableId)

		if (!result.destination || !item || !destCol || !sourceCol) return;

		if (source.droppableId !== destination.droppableId) {
			//diff col
			item.color = destCol.color;
			sourceCol.items?.splice(source.index, 1);
			destCol.items?.splice(destination.index, 0, item);

		} else {
			//same col
			sourceCol.items?.splice(source.index, 1);
			sourceCol.items?.splice(destination.index, 0, item);
		}

		setColumn(columns);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<ErrorContext.Provider value={errorContextValue}>
				<div className="App">
					<Header />
					{errorState.state &&
						<Alert variant={errorState.variant || 'danger'} onClose={() => setError({ state: false })} dismissible closeLabel='close' closeVariant='white'>
							<Alert.Heading>There was an error with the app</Alert.Heading>
							<p>{errorState.message}</p>
						</Alert>}
					<div className="container-fluid">
						<ColumnsContainer>
							{columnsState && columnsState.map((column: ColumnProps) =>
								<Column {...column} key={column._id} />
							)}
						</ColumnsContainer>
					</div>
				</div>
			</ErrorContext.Provider>
		</DragDropContext>
	);
}

export default App;
