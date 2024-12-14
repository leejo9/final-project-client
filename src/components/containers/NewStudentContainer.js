/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk } from '../../store/thunks';

class NewStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "", 
      email: "",
      imageUrl: "",
      gpa: "",
      campusId: "",
      campusId: null, 
      redirect: false, 
      redirectId: null
    };
  }

  componentDidMount() {
    this.props.fetchAllCampuses();
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
handleSubmit = async (event) => {
    event.preventDefault();
    const { firstname, lastname, email, imageUrl, gpa, campusId } = this.state;
    
    if (!firstname || !lastname || !email) {
      alert("First name, last name, and email are required fields.");
      return;
    }

    const student = {
      firstname,
      lastname,
      email,
      imageUrl: imageUrl || "default.jpg",
      gpa: gpa ? parseFloat(gpa) : null,
      campusId: campusId || null,
    };

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
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}  
          campuses={this.props.allCampuses}         
        />
      </div>          
    );
  }
}

const mapState = (state) => ({
  allCampuses: state.allCampuses,
});

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        addStudent: (student) => dispatch(addStudentThunk(student)),
        fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(null, mapDispatch)(NewStudentContainer);