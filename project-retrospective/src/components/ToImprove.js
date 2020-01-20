import React from "react";

class ToImprove extends React.Component {
    render() {
      return <div className="col-4 toimprove-container">
        <form type="post" action="https://guarded-spire-19484.herokuapp.com/createcard">
            <input type="text" name="content"/>
            <input type="hidden" name="category" value="toImprove"/>
          </form>
          <h2>To Improve</h2>
      </div>
    }
  }
  
  export default ToImprove;