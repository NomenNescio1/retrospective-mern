import React from "react";
/*load all matching items and map'em inside*/

class Kudos extends React.Component {
  constructor(){
    super();
    this.state = {
      items: {}
    }  
  }
  componentDidMount(){
    const allMatchingItems = await fetch('https://guarded-spire-19484.herokuapp.com/getcard/kudos');
    const jsonAllMatchingItems = await allMatchingItems.json();
    this.setState = {
      items: jsonAllMatchingItems      
    }
    
  }  
  render() {
      return <div className="col-4 action-container">
          <form type="post" onSubmit={/*save and update?*/}>
            <input type="text" name="content"/>
            <input type="hidden" name="category" value="kudos"/>
          </form>
          <h2>Kudos</h2>
          <div className="cards-container">
          {this.state.items.map((item, key) => <div className="card" key={key}>{item.content}</div>)}
          </div>
      </div>
    }
  }
  
  export default Kudos;