import React from 'react';
import './App.css';
import Header from './components/Header';
import Column from './components/Column';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <div className="container-fluid">
        <div className="row">   
        <Column color="orchid" niceName='Kudos' category='kudos'></Column>
        <Column color="salmon" niceName='To Improve' category='toImprove'></Column>
        <Column color="aquamarine" niceName='Went Well' category='wentWell'></Column> 
        </div>
      </div>      
    </div>
  );
}

export default App;
