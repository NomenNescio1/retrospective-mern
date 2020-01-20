import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

class Card extends React.Component {
    updateField = React.createRef();
    constructor(props){
        super(props);
        this.state  ={
          showInput: false,
          likesCount: 0,
          cardContent: ''
        }
    }
    componentDidMount(){
      this.setState({        
        likesCount: this.props.likes,
        cardContent: this.props.cardContent
      })
    }

    openEditForm = (e) =>{
    let displayState = this.state.showInput ? false : true;    
    this.setState({
      showInput: displayState
    })
  }
  
  editCard = (e, theID) =>{
    e.preventDefault();    
    fetch(`https://guarded-spire-19484.herokuapp.com/edit/${theID}`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `update=${this.updateField.current.value}`
    }).then(()=>{/*
      var cardsFiltered = this.props.items.filter(el =>{  
        if(el._id === theID){
          el.content = this.updateField.current.value
        }
        return el;
      });*/
      //this.props.displayUpdatedCards(cardsFiltered);
      this.setState({
        cardContent: this.updateField.current.value
      })
      this.updateField.current.value = '';
      this.setState({
        showInput: false
      })
      } 
    )
  }
  fetchLikesCount = async (id) => {
    let likes = this.state.likesCount + 1;
    this.setState({
      likesCount: likes
    })

    try {
      await fetch(`https://guarded-spire-19484.herokuapp.com/updatelikes/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          likes: this.state.likesCount
        })
      });
    } catch (error) {
      console.error('Error', error);
    }
  }

  deleteCard = (cardID) => {
    fetch(`https://guarded-spire-19484.herokuapp.com/deletecard/${cardID}`, {
      method: 'DELETE'
    }).then(() =>{
        this.props.displayUpdatedCards(cardID);
    })

  }

    render (){
        return(
        <div style={{backgroundColor: this.props.color}} className="card">
            {this.state.cardContent}
            <div className="options-container">
            <FaPencilAlt className="icon edit-icon" color="white" onClick={this.openEditForm} id="edit"/>
            <FaTrashAlt onClick={(e)=>{this.deleteCard(this.props.id)}}  className="icon trash-icon" color="white"/>
            <FaHeart onClick={()=>{this.fetchLikesCount(this.props.id)}} className="icon heart-icon" color="white"/>            
            <span style={{color: 'white'}}>{this.state.likesCount}</span>
            </div>
            <form onSubmit={(e)=> this.editCard(e, this.props.id)}>
                <input placeholder="Editar tarjeta" style={{borderColor: this.props.color}} className={`form-update ${this.state.showInput ? 'd-block' : 'd-none'}`} type="text" ref={this.updateField} name="update"/>
            </form>
        </div>);
    }
}

export default Card;