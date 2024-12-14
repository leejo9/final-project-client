import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Create styling for the input form
const useStyles = makeStyles(() => ({
  formContainer: {
    width: '500px',
    backgroundColor: '#f0f0f5',
    borderRadius: '5px',
    margin: 'auto',
  },
  formTitle: {
    backgroundColor: '#c5c8d6',
    marginBottom: '15px',
    textAlign: 'center',
    borderRadius: '5px 5px 0px 0px',
    padding: '3px',
  },
  errorText: {
    color: 'red',
    fontSize: '12px',
  },
}));

const EditStudentView = () => {
  const classes = useStyles();
  const { id } = useParams(); // Get the student ID from the URL
  const history = useHistory();

  const [studentData, setStudentData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    imageUrl: '',
    gpa: '',
    campusId: '',
  });

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    imageUrl: '',
    gpa: '',
  });  
  
  const [campuses, setCampuses] = useState([]);  // State for campuses


  useEffect(() => {
    axios.get(`/api/students/${id}`)
      .then((response) => {
        setStudentData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
      });
  

  axios.get('/api/campuses')
      .then((response) => {
        setCampuses(response.data);  // Store campuses data in state
      })
      .catch((error) => {
        console.error('Error fetching campuses:', error);
      });
  }, [id]);


  const validate = () => {
    let formErrors = {};
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const gpaRegex = /^[0-4](?:\.\d{1,2})?$/;

    if (!studentData.firstname) formErrors.firstname = 'First name is required';
    if (!studentData.lastname) formErrors.lastname = 'Last name is required';
    if (!studentData.email || !emailRegex.test(studentData.email)) formErrors.email = 'Invalid email format';
    if (studentData.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(studentData.imageUrl)) formErrors.imageUrl = 'Invalid image URL';
    if (studentData.gpa && !gpaRegex.test(studentData.gpa)) formErrors.gpa = 'GPA must be a number between 0 and 4';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      axios.put(`/api/students/${id}`, studentData)
        .then((response) => {
          console.log('Student updated:', response.data);
          history.push(`/student/${id}`); // Redirect to student details page
        })
        .catch((error) => {
          console.error('Error updating student:', error);
        });
    }
  };

  return (
    <div>
      <h1>Edit Student</h1>

      <div className={classes.formContainer}>
        <div className={classes.formTitle}>
          <Typography
            style={{
              fontWeight: 'bold',
              fontFamily: 'Courier, sans-serif',
              fontSize: '20px',
              color: '#11153e',
            }}
          >
            Edit Student Information
          </Typography>
        </div>
        <form onSubmit={handleFormSubmit}>
          <label>First Name: </label>
          <input
            type="text"
            name="firstname"
            value={studentData.firstname}
            onChange={handleChange}
            required
          />
          <div className={classes.errorText}>{errors.firstname}</div>
          <br />
          
          <label>Last Name: </label>
          <input
            type="text"
            name="lastname"
            value={studentData.lastname}
            onChange={handleChange}
            required
          />
          <div className={classes.errorText}>{errors.lastname}</div>
          <br />
          
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleChange}
            required
          />
          <div className={classes.errorText}>{errors.email}</div>
          <br />
          
          <label>Image URL: </label>
          <input
            type="text"
            name="imageUrl"
            value={studentData.imageUrl}
            onChange={handleChange}
          />
          <div className={classes.errorText}>{errors.imageUrl}</div>
          <br />
          
          <label>GPA: </label>
          <input
            type="text"
            name="gpa"
            value={studentData.gpa}
            onChange={handleChange}
          />
          <div className={classes.errorText}>{errors.gpa}</div>
          <br />

          <label>Campus: </label>
          <select
            name="campusId"
            value={studentData.campusId || ''}
            onChange={handleChange}
          >
            <option value="">Select a campus</option>
            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
          <br />
          
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditStudentView;
