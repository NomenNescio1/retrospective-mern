import { useState, useEffect, useContext, BaseSyntheticEvent, memo } from "react";
import Card from './Card';
import { CardProps, ColumnProps, API_ENDPOINT } from "../utils/utils";
import { ErrorContext } from "../context/Error";
import { Droppable } from "react-beautiful-dnd";

const Column = ({ name, color, index, _id }: ColumnProps): JSX.Element => {

	const [cards, setCards] = useState<CardProps[]>([]);
	const [displayForm, setDisplayForm] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const { setError } = useContext(ErrorContext);

	useEffect(() => {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), 8000);

		try {
			fetch(`${API_ENDPOINT}/getcard/${name}`, {
				signal: controller.signal
			})
				.then(response => response.json())
				.then((data) => setCards(data as CardProps[]));
		} catch (error) {
			console.error(error);

			setError(true);
		}
		clearTimeout(id);
	}, [name]);

	const createCard = async (event: BaseSyntheticEvent): Promise<void | JSX.Element> => {
		event.preventDefault();

		try {
			const response = await fetch(`${API_ENDPOINT}/createcard`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: inputValue,
					category: name,
					likes: 0
				})
			});

			const result = await response.json();
			const newCard: CardProps = {
				_id: result._id,
				content: inputValue,
				category: name,
				likes: 0
			};

			const allCards = [...cards, newCard];
			setCards(allCards);
			setInputValue('');
			setDisplayForm(false);

		} catch (error) {
			console.error(error);

			setError(true);
		}
	}

	const handleInputChange = (ev: BaseSyntheticEvent): void => {
		ev.preventDefault();

		setInputValue(ev.target.value);
	};

	const updateCards = (cardID: string): void => {
		const cardsFiltered = cards.filter(card => card._id !== cardID)

		setCards(cardsFiltered);
	}

	return (
		<Droppable key={index} droppableId={_id as string}>
			{(provided, snapshot) => {
				return (
					<div {...provided.droppableProps} ref={provided.innerRef} className="col-sm-3 column-container" style={{ backgroundColor: color }}>
						<h2 className="column-title">{name}</h2>
						<div className="add-card-span" onClick={() => setDisplayForm(!displayForm)}>Add card</div>
						<form className={`form-create ${displayForm ? 'd-block' : 'd-none'}`} onSubmit={createCard}>
							<input placeholder="Type the card content and press enter" type="text" className="input-create" value={inputValue || ''} onChange={handleInputChange} name="content" />
						</form>
						<div className="cards-container">
							{cards.map((card: CardProps, index) =>
								<Card {...card} key={card._id} index={index} updateCards={updateCards} />
							)}
						</div>
						{provided.placeholder}
					</div>
				)
			}}
		</Droppable>
	);
}

export default memo(Column);