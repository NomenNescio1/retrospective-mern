import { useState, useContext, BaseSyntheticEvent, useRef } from "react";
import Card from './Card';
import { CardProps, ColumnProps } from "../utils/types";
import { API_ENDPOINT } from "../utils/utils";
import { ErrorContext } from "../context/Error";
import { Droppable } from "react-beautiful-dnd";
import { ColumnElement, AddCardButton } from "../utils/components";
import { FaPencilAlt } from 'react-icons/fa'
import { Collapse } from "react-bootstrap";

const Column = ({ name, color, index, _id, items }: ColumnProps): JSX.Element => {

	const nameColRef = useRef<HTMLInputElement | null>(null);
	const [updatedTitle, setUpdatedTitle] = useState(name);
	const [cards, setCards] = useState<CardProps[]>(items as CardProps[]);
	const [displayForm, setDisplayForm] = useState(false);
	const [displayColForm, setdisplayColForm] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const { setError } = useContext(ErrorContext);

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
					colId: _id,
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

	const updateTitle = async (ev: BaseSyntheticEvent) => {
		ev.preventDefault();
		await fetch(`${API_ENDPOINT}/editcol`, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				colID: _id,
				update: nameColRef.current?.value
			})
		});

		setUpdatedTitle(nameColRef.current?.value);
		nameColRef.current!.value = '';
		setdisplayColForm(false);

	};

	const updateCards = (cardID: string): void => {
		const cardsFiltered = cards.filter(card => card._id !== cardID)

		setCards(cardsFiltered);
	}

	return (
		<>
			<ColumnElement bgColor={color as string}>
				<div className="update-card-form">
					<h1 className="col-name">{updatedTitle}</h1>
					<FaPencilAlt fill={'white'} className="icon edit-icon" onClick={() => setdisplayColForm(!displayColForm)} id="edit" />
				</div>
				<>
					<Collapse in={displayColForm}>
						<form onSubmit={updateTitle} className="update-card-form">
							<input ref={nameColRef} type="text" name="new-name" />
							<input placeholder="New name" type="submit" value="Update" />
						</form>
					</Collapse></>
				<AddCardButton onClick={_ => setDisplayForm(!displayForm)}>Add card</AddCardButton>
				<Collapse in={displayForm}>
					<div>
						<form onSubmit={createCard} className="update-card-form">
							<input placeholder="Card content" type="text" className="input-create" value={inputValue || ''} onChange={handleInputChange} name="content" />
							<input type="submit" value="Create" />
						</form>
					</div>
				</Collapse>
				<Droppable key={_id} droppableId={_id as string} >
					{provided => {
						return (
							<div {...provided.droppableProps} ref={provided.innerRef} style={{ marginTop: '10px' }}>
								{cards.map((card, index) =>
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