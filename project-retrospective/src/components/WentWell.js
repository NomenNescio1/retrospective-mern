import React from "react";

class WentWell extends React.Component {
    render() {
      return <div className="col-4 wentwell-container">
          <form type="post" action="https://guarded-spire-19484.herokuapp.com/createcard">
            <input type="text" name="content"/>
            <input type="hidden" name="category" value="wentWell"/>
          </form>
          <h2>Went Well</h2>
      </div>
    }
  }
  
  export default WentWell;