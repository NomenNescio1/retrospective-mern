import { useState, useEffect, BaseSyntheticEvent } from "react";
import Card from './Card';
import Popup from "./Popup";
import { CardProps, ColumnProps, API_ENDPOINT } from "../utils/utils";

const Column = ({ name, color }: ColumnProps): JSX.Element => {

	const [cards, setCards] = useState<CardProps[]>([])
	const [displayForm, setDisplayForm] = useState(false);
	const [inputValue, setInputValue] = useState(''); 

	useEffect(() => {
		fetch(`${API_ENDPOINT}/getcard/${name}`)
			.then(response => response.json())
			.then(data => setCards(data))
			.catch((error: Error) => {
				return <Popup message={`there was an erorr ${error}`} />
			})
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

		} catch (error) {
			return <Popup message={`there was an error: ${error}`} />
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
		<div className="col-sm-4 action-container" style={{backgroundColor: color}}>
			<h2>{name}</h2>
			<div className="add-card-span" onClick={() => setDisplayForm(!displayForm)}>Add card</div>
			<form className={`form-create ${displayForm ? 'd-block' : 'd-none'}`} onSubmit={createCard}>
				<input placeholder="Type the card content and press enter" type="text" className="input-create" value={inputValue || ''} onChange={handleInputChange} name="content" />
			</form>
			<div className="cards-container">
				{cards.map((card: CardProps) =>
					<Card {...card} key={card._id} updateCards={updateCards} />
				)}
			</div>
		</div>
	);
}

export default Column;