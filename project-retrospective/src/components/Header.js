export const Header = () => (
  <header className="top col-8 center">
    <h1>Retrospective App v2</h1>
    <h3>This is a scrum retrospective app built using the MERN stack.</h3>
    <p>Right now, the user can create cards, edit them, delete them and like them. I've also implemented drag and drop using <a rel="noreferrer" href="https://github.com/atlassian/react-beautiful-dnd"  target="_blank">react-beautiful-dnd.</a> </p><br />
    <p>These are the issues I'm working on:</p>
    <ul>
      <li>After creating or deleting a card, the drag and drop fails.</li> 
      <li>Dragged items won't get updated in the database records.</li>
      <li>A custom hook for fetching would be nice to have.</li>
    </ul>
  </header>
);