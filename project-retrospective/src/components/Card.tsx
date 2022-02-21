import { useState, useRef, BaseSyntheticEvent, useContext, memo } from "react";
import { FaPencilAlt, FaTrashAlt, FaHeart } from "react-icons/fa";
import { API_ENDPOINT, CardProps } from "../utils/utils";
import { ErrorContext } from '../context/Error'
import { Modal, Button } from "react-bootstrap";
import { Draggable } from "react-beautiful-dnd";

const Card = ({ likes, content, _id, updateCards, index, category }: CardProps): JSX.Element => {

	const updateRef = useRef<HTMLInputElement | null>(null);
	const [contentState, setContent] = useState<string | undefined>(content || '');
	const [likesState, setLikes] = useState<number | undefined>(likes);
	const [displayInput, setDisplayInput] = useState(false);
	const [showModal, setModal] = useState(false);
	const { setError } = useContext(ErrorContext);

	const editCard = async (event: BaseSyntheticEvent): Promise<void> => {
		event.preventDefault();
		await fetch(`${API_ENDPOINT}/edit/${_id}`, {
			method: 'PATCH',
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `update=${updateRef.current?.value}`
		}).catch((error) => {
			console.error(error);

			setError(true);
		});

		setContent(updateRef.current?.value);
		updateRef.current!.value = '';
		setDisplayInput(false);
	};

	const fetchLikesCount = async (id: string | undefined): Promise<void> => {
		setLikes(likesState as number + 1);

		await fetch(`${API_ENDPOINT}/updatelikes/${id}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				likes: likesState
			})
		}).catch((error) => {
			console.error(error);

			setError(true);
		});
	};

	const deleteCard = async (cardID: string | undefined): Promise<void> => {
		await fetch(`${API_ENDPOINT}/deletecard/${cardID}`, {
			method: 'DELETE'
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
					<Button variant="primary" onClick={() => deleteCard(_id)}>
						Yes
					</Button>
				</Modal.Footer>
			</Modal>}
			<Draggable key={_id} draggableId={_id as string} index={index as number}>
				{(provided, snapshot) => {
					return (
						<div className="card" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
							{contentState}
							<div className="options-container">
								<FaPencilAlt className="icon edit-icon" onClick={() => setDisplayInput(!displayInput)} id="edit" />
								<FaTrashAlt onClick={() => setModal(true)} className="icon trash-icon" />
								<FaHeart onClick={() => fetchLikesCount(_id)} className="icon heart-icon" />
								<span style={{ color: 'black' }}>{likesState}</span>
							</div>
							<form className={`update-card-form ${displayInput ? 'd-block' : 'd-none'}`} onSubmit={editCard}>
								<input placeholder="Edit card" className="form-update" type="text" name="update" ref={updateRef} />
								<input type="submit" value="Update" />
							</form>
						</div>
					)
				}}
			</Draggable>
		</>);
}

export default memo(Card);
