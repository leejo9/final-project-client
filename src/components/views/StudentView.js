/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
const StudentView = (props) => {
  const { student } = props;

  const campusInfo = student.campus ? (
    <div>
      <h3>{student.campus.name}</h3>
      <Link to={`/campus/${student.campus.id}`}>View Campus</Link>
    </div>
  ) : (
    <p>This student is not enrolled at any campus.</p>
  );

  return (
    <div>
      <h1>{student.firstname + " " + student.lastname}</h1>
  <p><strong>Email:</strong> {student.email}</p>
      <p><strong>GPA:</strong> {student.gpa}</p>
      <p><strong>Image URL:</strong> <img src={student.imageUrl} alt="Student" style={{ width: '100px' }} /></p>
      {campusInfo}
      <Link to={`/editstudent/${student.id}`}>
        <button>Edit Student</button>
      </Link>
      <button onClick={() => props.deleteStudent(student.id)}>Delete</button>
    </div>
  );
};

export default StudentView;