import { useState, useContext, BaseSyntheticEvent } from "react";
import Card from './Card';
import { CardProps, ColumnProps } from "../utils/types";
import { API_ENDPOINT } from "../utils/utils";
import { ErrorContext } from "../context/Error";
import { Droppable } from "react-beautiful-dnd";
import { ColumnElement } from "../utils/components";
import { FetchContext } from "../context/Fetch";
import { Collapse } from "react-bootstrap";

const Column = ({ name, color, index, _id, items }: ColumnProps): JSX.Element => {

	const [cards, setCards] = useState<CardProps[]>(items as CardProps[]);
	const [displayForm, setDisplayForm] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const { setError } = useContext(ErrorContext);
	const { setShouldFetch, shouldFetch } = useContext(FetchContext);

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
					likes: 0,
					color
				})
			});

			const result = await response.json();
			const newCard: CardProps = {
				_id: result._id,
				content: inputValue,
				category: name,
				likes: 0,
				color
			};

			setCards(cardsProp => cardsProp ? [...cardsProp, newCard] : [newCard]);
			setShouldFetch(!shouldFetch);
			setInputValue('');
			setDisplayForm(false);

		} catch (error) {
			console.error(error);

			setError({ state: true, message: 'Can\'t fetch resource. Try again?' });
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
		<>
			<ColumnElement bgColor={color as string}>
				<h2>{name}</h2>
				<div className="add-card-span" onClick={() => setDisplayForm(!displayForm)}>Add card</div>
				<Collapse in={displayForm}>
					<form onSubmit={createCard}>
						<input placeholder="Type the card content and press enter" type="text" className="input-create" value={inputValue || ''} onChange={handleInputChange} name="content" />
						<input type="submit" value="Send" />
					</form>
				</Collapse>
				<Droppable key={_id} droppableId={_id as string} >
					{(provided, snapshot) => {
						return (
							<div {...provided.droppableProps} ref={provided.innerRef} className="cards-container">
								{cards.map((card: CardProps, index: number) =>
									<Card {...card} key={card._id} _colId={_id} index={index} updateCards={updateCards} />
								)}
								{provided.placeholder}
							</div>
						)
					}}
				</Droppable>
			</ColumnElement>
		</>
	);
}

export default Column;