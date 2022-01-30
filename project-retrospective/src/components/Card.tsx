import { useState, useRef, BaseSyntheticEvent } from "react";
import { FaPencilAlt, FaTrashAlt, FaHeart } from "react-icons/fa";
import { API_ENDPOINT, CardProps } from "../utils/utils";
import Popup from "./Popup";

const Card = ({ likes, content, _id, updateCards }: CardProps): JSX.Element => {

	const updateRef = useRef<HTMLInputElement | null>(null);
	const [contentState, setContent] = useState<string | undefined>(content || '');
	const [likesState, setLikes] = useState<number | undefined>(likes);
	const [displayInput, setDisplayInput] = useState(false);

	const editCard = async (event: BaseSyntheticEvent): Promise<void> => {
		event.preventDefault();
		await fetch(`${API_ENDPOINT}/edit/${_id}`, {
			method: 'PATCH',
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `update=${updateRef.current?.value}`
		}).catch((error) => {
			return <Popup message={`there was an error: ${error}`}/>
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
			return <Popup message={`there was an error: ${error}`}/>
		});
	};

	const deleteCard = async (cardID: string | undefined): Promise<void> => {
		await fetch(`${API_ENDPOINT}/deletecard/${cardID}`, {
			method: 'DELETE'
		});

		updateCards && updateCards(cardID);
	};

	return (
		<div className="card">
			{contentState}
			<div className="options-container">
				<FaPencilAlt className="icon edit-icon" color="white" onClick={() => setDisplayInput(!displayInput)} id="edit" />
				<FaTrashAlt onClick={(e) => { deleteCard(_id) }} className="icon trash-icon" color="black" />
				<FaHeart onClick={() => { fetchLikesCount(_id) }} className="icon heart-icon" color="black" />
				<span style={{ color: 'black' }}>{likesState}</span>
			</div>
			<form onSubmit={(event) => editCard(event)}>
				<input placeholder="Edit card" className={`form-update ${displayInput ? 'd-block' : 'd-none'}`} type="text" name="update" ref={updateRef} />
			</form>
		</div>
	);
}

export default Card;
