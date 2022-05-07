import React from "react";
import Card from './Card';

class Column extends React.Component {  
  contentRef = React.createRef();  
  categoryRef = React.createRef();
  constructor(){
    super();
    this.state = {
      items: [],
      displayForm: false
    }  
  }
  componentDidMount(){
    fetch('http://localhost:3001/getcard/'+ this.props.category)
    .then(response => response.json())
    .then(data => {        
        this.setState ({
            items: data
        })
    }).catch(error => console.error(error));    
  }
  
  shouldDisplayForm = (e) =>{
    let displayState = this.state.displayForm ? false : true;    
    this.setState ({
      displayForm: displayState
    })
  }
  createCard = async (e)=>{
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:3001/createcard', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: this.contentRef.current.value, 
            category: this.categoryRef.current.value,
            likes: 0, 
            color:this.props.color})
        });
        const result = await response.json();
        let newCard = { _id:result._id, content: this.contentRef.current.value, category: this.categoryRef.current.value, likes:0, color:this.props.color}
        let allCards = [...this.state.items, newCard];
        this.setState ({
          items: allCards,
          displayForm: false
        })
        this.contentRef.current.value= '';
      } catch (error) {
        console.error('Error:', error);
      }

/*      fetch('http://localhost:3001/createcard', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: this.contentRef.current.value, 
        category: this.categoryRef.current.value, 
        color:this.props.color})
    }).then(data => {      
    let newCard = { _id:data._id, content: this.contentRef.current.value, category: this.categoryRef.current.value, color:this.props.color}
    let allCards = [...this.state.items, newCard];
    this.setState ({
      items: allCards
    })
    this.contentRef.current.value= '';
    }).catch(error => console.error(error));    */
  }

  updateCards = (cardID) =>{
    let cardsFiltered = this.state.items.filter(el => {
      if(el._id === cardID){
        el = null;
      }
      return el;
    })

    this.setState ({
      items: cardsFiltered
    })    
  }
  render() {
      return <div className="col-sm-4 action-container">
        <h2>{this.props.niceName}</h2>
        <div className="add-card-span" onClick={this.shouldDisplayForm}>+</div>
          <form className={`form-create ${this.state.displayForm ? 'd-block' : 'd-none'}`} onSubmit={this.createCard}>
            <input placeholder="Type the card content and press enter" type="text" className="input-create" style={{borderColor: this.props.color}} ref={this.contentRef} name="content"/>
            <input type="hidden" name="category" ref={this.categoryRef} value={this.props.category}/>
          </form>
          <div className="cards-container">
          {this.state.items.map((item) =>
            <Card updateCards={this.updateCards} likes={item.likes} color={item.color} cardContent={item.content} id={item._id} key={item._id}></Card>
            )}
          </div>
      </div>
    }
  }
  
  export default Column;