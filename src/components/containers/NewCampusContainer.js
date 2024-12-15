/*==================================================
NewCampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';

import NewCampusView from '../views/NewCampusView';
import { addCampusThunk } from '../../store/thunks';

class NewCampusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      description: "",
      imageUrl: "",
      redirect: false,
      redirectId: null,
    };
  }

  // Handle input change in the form fields
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Handle form submission, validate data and dispatch action
  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, address, description, imageUrl } = this.state;

    // Validate required fields
    if (!name || !address) {
      alert("Name and address are required fields.");
      return;
    }

    const campus = {
      name,
      address,
      description: description || "",
      imageUrl: imageUrl || "https://example.com/profile.jpg", // Set default image if no image URL is provided
    };

    const newCampus = await this.props.addCampus(campus);
    this.setState({
      redirect: true,
      redirectId: newCampus.id,
    });
  };

  componentWillUnmount() {
    this.setState({ redirect: false, redirectId: null });
  }

  render() {
    console.log('lol')
    if (this.state.redirect) {
      
      this.props.history.push('/campuses');
    }

    return (
      <div>
        <Header />
        <NewCampusView 
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

// Connect the component to Redux store
const mapDispatch = (dispatch) => ({
  addCampus: (campus) => dispatch(addCampusThunk(campus)),
});

export default connect(null, mapDispatch)(NewCampusContainer);
