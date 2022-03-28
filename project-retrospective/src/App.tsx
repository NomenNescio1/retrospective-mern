import { FormEvent, useRef, useState, useEffect, useMemo } from 'react';
import './App.css';
import { Header } from './components/Header';
import Column from './components/Column';
import { API_ENDPOINT, ALL_COLORS } from './utils/utils';
import { ColumnProps, CardProps } from './utils/types'
import { Alert } from 'react-bootstrap'
import { ErrorContext } from './context/Error';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

const App = () => {
	const [columnsState, setColumn] = useState<ColumnProps[]>([]);
	const [errorState, setError] = useState<boolean>(false);
	const value = useMemo(() => ({ errorState, setError }), [errorState]);
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
				setError(true);
			}
		}

		clearTimeout(id);
		getColumns();

	}, []);

	useEffect(() => {
		
	}, [columnsState])

	const checkForColumns = async (): Promise<string | undefined> => {

		try {
			const getName = await fetch(`${API_ENDPOINT}/getcolumn?name=${columnName.current?.value}`);
			const nameResult: string = await getName.text();

			return nameResult;
		} catch (error) {
			setError(true)
		}

		return '';
	}

	const createColumns = async (event: FormEvent): Promise<void | JSX.Element> => {
		event.preventDefault();

		try {
			if (await checkForColumns() === 'notfound') {
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
				setError(true);
			}
		} catch (errorMessage) {
			setError(true)
		}
	};
	const onDragEnd = (result: DropResult, columns: ColumnProps[], setColumn: React.Dispatch<React.SetStateAction<ColumnProps[]>>) => {
		if (!result.destination) return;
		const { source, destination } = result;
		const sourceColIndex = columns.findIndex(el => el._id === source.droppableId);
		let item: any = {};

		if(!columns[sourceColIndex] ){
			return null
		}

		if (source.droppableId !== destination.droppableId) {
			const destColIndex = columns.findIndex(el => el._id === destination.droppableId);
			item = columns?.[sourceColIndex as number]?.items?.[source.index] as CardProps;
			if(item){
				columns?.[sourceColIndex]?.items?.splice(source.index, 1);
				columns?.[destColIndex]?.items?.splice(destination.index, 0, item);
			}else {
				console.log('sstate', columnsState.flatMap(el => el.items))
				console.log('sstate', columns.flatMap(el => el.items))
			}

		} else {
			item = columns?.[sourceColIndex]?.items?.[source.index] as CardProps;
			columns?.[sourceColIndex]?.items?.splice(source.index, 1);
			columns?.[sourceColIndex]?.items?.splice(destination.index, 0, item);
		}

		setColumn(columns)
	};

	return (
		<DragDropContext onDragEnd={(result) => onDragEnd(result, columnsState, setColumn)}>
			<ErrorContext.Provider value={value}>
				<div className="App">
					<div>
						<Header />
						{errorState &&
							<Alert variant="danger" onClose={() => setError(false)} dismissible closeLabel='close' closeVariant='white'>
								<Alert.Heading>There was an error with the app</Alert.Heading>
								<p>there was an error with the app, please try again.</p>
							</Alert>}
						<div className="container-fluid">
							<div className='card-creation-container'>
								<form onSubmit={createColumns}>
									<label htmlFor="columnName">Column name: </label>
									<input type="text" name="columnName" id="name" ref={columnName} />
									<br />
									<label htmlFor="color">Select a background color</label>
									<select name="color" id="color" onChange={(e) => setColor(e.target.value)}>
										{
											ALL_COLORS.map((color, key) => {

												return (<option key={key} className='option-input' value={color}>{color}</option>)
											})
										}
									</select>
									<input type="submit" value="Create" />
								</form>
							</div>
							<div className="row">
								{columnsState.map((column: ColumnProps) =>
									<Column {...column} key={column._id} />
								)}
							</div>
						</div>
					</div>
				</div>
			</ErrorContext.Provider>
		</DragDropContext>
	);
}

export default App;
