import React from "react";

const Header = () => (
  <header className="top col-12">
    <h1>Retrospective</h1>
    <h3>This is a scrum retrospective app built using the MERN stack. Due to costs constraints, it's using a single Mongo database that deletes all records after 2 hours. </h3>
    <p>To add a card of a retrospective, click on the '+' of the column, type the content and press Enter. You can also edit, delete and 'like' a card using the icons.</p>
  </header>
);

export default Header;