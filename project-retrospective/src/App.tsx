import { FormEvent, useRef, useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Column from './components/Column';
import { ColumnProps, API_ENDPOINT, ALL_COLORS } from './utils/utils';
import { Alert, CloseButton } from 'react-bootstrap';

const App = () => {
	const [columnsState, setColumn] = useState<ColumnProps[]>([]);
	const [errorState, setError] = useState<{ error: boolean, message?: string }>({
		error: false,
		message: ''
	});
	const [color, setColor] = useState('bisque');
	const columnName = useRef<HTMLInputElement | null>(null);

	useEffect(() => {

		fetch(`${API_ENDPOINT}/getcolumn/`)
			.then(response => response.json())
			.then(data => setColumn(data)).catch((error: Error) => {
				setError({
					error: true,
					message: `there was an error fetcing the content ${error}`
				})
			})
	}, []);

	const checkForColumns = async (): Promise<string | undefined> => {

		try {
			const getName = await fetch(`${API_ENDPOINT}/getcolumn?name=${columnName.current?.value}`);
			const nameResult: string = await getName.text();

			return nameResult;
		} catch (error) {
			setError({
				error: true,
				message: `there was an error checking if the name exists: ${error}`
			})
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
					color
				}

				setColumn([...columnsState, newColumn]);
				columnName.current!.value = '';

			} else {
				setError({
					error: true,
					message: 'the given name already exists'
				});
			}
		} catch (errorMessage) {
			setError({
				error: true,
				message: `there was an error fetching the content: ${errorMessage}`
			})
		}
	}
	return (
		<div className="App">
			<div>
				<Header />
				{errorState.error &&
					<Alert variant="danger" onClose={() => setError({ error: false })} dismissible>
						<CloseButton />
						<Alert.Heading>Oh snap! You got an error!</Alert.Heading>
						<p>
							{errorState.message}
						</p>
					</Alert>}
				<div className="container-fluid">
					<form onSubmit={createColumns}>
						<input type="text" name="columnName" id="name" ref={columnName} />
						<br />
						<label htmlFor="color">select a color</label>
						<select name="color" id="color" onChange={(e) => setColor(e.target.value)}>
							{
								ALL_COLORS.map((color, key) => {

									return (<option key={key} className='option-input' value={color}>{color}</option>)
								})
							}
						</select>
						<input type="submit" value="enviar" />
					</form>
					<div className="row">
						{columnsState.map((column: ColumnProps) =>
							<Column {...column} key={column._id} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
