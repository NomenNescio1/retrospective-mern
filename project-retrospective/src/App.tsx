import { FormEvent, useRef, useState, useEffect, useMemo } from 'react';
import './App.css';
import { Header } from './components/Header';
import Column from './components/Column';
import { API_ENDPOINT, ALL_COLORS } from './utils/utils';
import { ColumnProps, ColumnsType, ErrorState } from './utils/types';
import { Alert } from 'react-bootstrap';
import { ErrorContext } from './context/Error';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { ColumnsContainer } from './utils/components';
import { FetchContext } from './context/Fetch';

const App = () => {
	const [columnsState, setColumn] = useState<ColumnProps[]>([]);
	const [errorState, setError] = useState<ErrorState>({ state: false, message: '' as string });
	const [fetchState, setFetch] = useState<boolean>(false);
	const errorContextValue = useMemo(() => ({ ...errorState, setError }), [errorState]);
	const [color, setColor] = useState('bisque');
	const columnName = useRef<HTMLInputElement | null>(null);

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

	}, [fetchState]);

	const checkForColumns = async (): Promise<ColumnsType | void> => {

		try {
			const getName = await fetch(`${API_ENDPOINT}/getcolumn?name=${columnName.current?.value}`);

			return await getName.json();
		} catch (error) {

			setError({ state: true, message: 'Endpoint not available' });
		}
	}

	const createColumns = async (event: FormEvent): Promise<void | JSX.Element> => {
		event.preventDefault();

		try {
			const { foundCard, count } = await checkForColumns() as ColumnsType;

			if (!foundCard && count as number < 3) {
				const response = await fetch(`${API_ENDPOINT}/createcolumn`, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: columnName.current?.value,
						color
					})
				});

				const result = await response.json();
				const newColumn: ColumnProps = {
					_id: result._id,
					name: columnName.current?.value,
					color,
					items: []
				}

				setColumn([...columnsState, newColumn]);
				columnName.current!.value = '';

			} else {
				setError({ state: true, message: 'Columns limit is 3', variant: 'warning' });
			}
		} catch (errorMessage) {
			setError({ state: true, message: 'jaja' })
		}
	};

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
			<FetchContext.Provider value={{ shouldFetch: fetchState, setShouldFetch: setFetch }}>
				<ErrorContext.Provider value={errorContextValue}>
					<div className="App">
						<div>
							<Header />
							{errorState.state &&
								<Alert variant={errorState.variant || 'danger'} onClose={() => setError({ state: false })} dismissible closeLabel='close' closeVariant='white'>
									<Alert.Heading>There was an error with the app</Alert.Heading>
									<p>{errorState.message}</p>
								</Alert>}
							<div className="container-fluid">
								<div className='card-creation-container'>
									<h4>Create a column:</h4>
									<form onSubmit={createColumns}>
										<label htmlFor="columnName">Name: </label>
										<input type="text" name="columnName" id="name" ref={columnName} />
										<br />
										<label htmlFor="color">Background: </label>
										<select name="color" id="color" onChange={(e) => setColor(e.target.value)}>
											{
												ALL_COLORS.map((color, key) => {

													return (<option style={{ backgroundColor: `${color}`}} key={key} className='option-input' value={color}>{color}</option>)
												})
											}
										</select>
										<input type="submit" value="Create" />
									</form>
								</div>
								<ColumnsContainer>
									{columnsState && columnsState.map((column: ColumnProps) =>
										<Column {...column} key={column._id} />
									)}
								</ColumnsContainer>
							</div>
						</div>
					</div>
				</ErrorContext.Provider>
			</FetchContext.Provider>
		</DragDropContext>
	);
}

export default App;
