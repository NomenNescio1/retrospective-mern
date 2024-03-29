import { useState, useRef, BaseSyntheticEvent, useContext } from "react";
import { FaPencilAlt, FaTrashAlt, FaHeart } from "react-icons/fa";
import { API_ENDPOINT } from "../utils/utils";
import { CardProps } from "../utils/types";
import { ErrorContext } from '../context/Error'
import { Modal, Button, Collapse } from "react-bootstrap";
import { Draggable } from "react-beautiful-dnd";
import { CardElement, OptionsContainer } from "../utils/components";

const Card = ({ likes, content, _id, updateCards, index, _colId, color }: CardProps): JSX.Element => {

	const updateRef = useRef<HTMLInputElement | null>(null);
	const [contentState, setContent] = useState<string | undefined>(content || '');
	const [likesState, setLikes] = useState<number | undefined>(likes);
	const [displayInput, setDisplayInput] = useState(false);
	const [showModal, setModal] = useState(false);
	const { setError } = useContext(ErrorContext);

	const editCard = async (event: BaseSyntheticEvent): Promise<void> => {
		event.preventDefault();
		await fetch(`${API_ENDPOINT}/editcard`, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				colID: _colId,
				cardID: _id,
				update: updateRef.current?.value
			})
		}).catch((error) => {
			console.error(error);
			setError({ state: true, message: 'Backend endpoint not available.', variant: 'warning' });
		});

		setContent(updateRef.current?.value);
		updateRef.current!.value = '';
		setDisplayInput(false);
	};

	const fetchLikesCount = async (cardID: string | undefined, colID: string | undefined): Promise<void> => {
		setLikes(state => state as number + 1);

		await fetch(`${API_ENDPOINT}/updatelikes`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				colID,
				cardID
			})
		}).catch(_ => {

			setError({ state: true, message: 'Endpoint not available.' });
		});
	};

	const deleteCard = async (cardID: string | undefined, colID: string | undefined): Promise<void> => {
		await fetch(`${API_ENDPOINT}/deletecard`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				colID,
				cardID
			})
		}).catch(_ => {
			setError({ state: true, message: 'Endpoint not available.' });
		});

		updateCards && updateCards(cardID);
	};

	return (
		<>
			{<Modal show={showModal} onHide={() => setModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>You are about to delete a card</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to continue?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setModal(false)}>
						Nah
					</Button>
					<Button variant="primary" onClick={() => deleteCard(_id, _colId)}>
						Yes
					</Button>
				</Modal.Footer>
			</Modal>}
			<Draggable key={_id} draggableId={_id as string} index={index as number}>
				{provided => {
					return (
						<CardElement ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
							{contentState}
							<OptionsContainer>
								<FaPencilAlt fill={color} className="icon edit-icon" onClick={() => setDisplayInput(!displayInput)} id="edit" />
								<FaTrashAlt fill={color} onClick={() => setModal(true)} className="icon trash-icon" />
								<FaHeart fill={color} onClick={() => fetchLikesCount(_id, _colId)} className="icon heart-icon" />
								<span style={{ color: 'black' }}>{likesState}</span>
							</OptionsContainer>
							<Collapse in={displayInput}>
								<div>
									<form className={'update-card-form'} onSubmit={editCard}>
										<input placeholder="Edit card" className="input-update" type="text" name="update" ref={updateRef} />
										<input type="submit" value="Update" />
									</form>
								</div>
							</Collapse>
						</CardElement>
					)
				}}
			</Draggable>
		</>);
}

export default Card;
