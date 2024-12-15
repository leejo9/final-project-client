/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus, deleteCampus} = props;
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this campus?")) {
      deleteCampus();
    }
  };

  // Render a single Campus view with list of its students
  return (
    <div>
      <h1>{campus.name}</h1>
      <p>{campus.address}</p>
      <p>{campus.description}</p>

      {campus.students && campus.students.length ? (
        campus.students.map((student) => {
          let name = `${student.firstname} ${student.lastname}`;
          return (
            <div key={student.id}>
              <Link to={`/student/${student.id}`}>
                <h2>{name}</h2>
              </Link>
            </div>
          );
        })
      ) : (
        <p>No students enrolled at this campus.</p>
      )}

      {/* Link for Edit Campus, no onClick here */}
      <Link to={`/editcampus/${campus.id}`}>
        <button>Edit Campus</button>
      </Link>

      {/* Delete Campus button */}
      <button onClick={handleDelete}>Delete Campus</button>      </div>
  );
};


export default CampusView;