/*==================================================
NewStudentContainer.js
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk, fetchAllCampusesThunk } from '../../store/thunks';

class NewStudentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      imageUrl: "",
      gpa: "",
      campusId: "",
      redirect: false,
      redirectId: null,
    };
  }

  componentDidMount() {
    this.props.fetchAllCampuses();
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  
handleSubmit = async (event) => {
  event.preventDefault();
  const { firstname, lastname, email, imageUrl, gpa, campusId } = this.state;

  // Check for required fields
  if (!firstname || !lastname || !email) {
    alert("First name, last name, and email are required fields.");
    return;
  }

  // Create the student object, setting default values for optional fields
  const student = {
    firstname,
    lastname,
    email,
    imageUrl: imageUrl || "https://example.com/profile.jpg", // Use default image if empty
    gpa: gpa && !isNaN(gpa) ? parseFloat(gpa) : null,        
    campusId: campusId || null,          // Use null if no campus is selected
  };

  // Attempt to add the student
  const newStudent = await this.props.addStudent(student);
  this.setState({
    redirect: true,
    redirectId: newStudent.id,
  });
};

  
  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
    this.setState({redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if (this.state.redirect) {
      return <Redirect to={`/student/${this.state.redirectId}`} />;
    }

    // Check if campuses are available
    if (!this.props.allCampuses || this.props.allCampuses.length === 0) {
      return (
        <div>
          <Header />
          <p>Loading campuses...</p>
        </div>
      );
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          campuses={this.props.allCampuses}
        />
      </div>
    );
  }
}

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapState = (state) => ({
  allCampuses: state.allCampuses,
});

const mapDispatch = (dispatch) => ({
  addStudent: (student) => dispatch(addStudentThunk(student)),
  fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
});

export default connect(mapState, mapDispatch)(NewStudentContainer);
