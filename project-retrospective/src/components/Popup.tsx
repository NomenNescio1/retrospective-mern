interface PopupProps {
	message: string;
}

const Popup = ({ message }: PopupProps): JSX.Element => {
	return (
		<div className="popup">
			<div className="error">
				{message}
			</div>
		</div>
	)
}

export default Popup;