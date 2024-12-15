/*==================================================
NewStudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the new student page.
================================================== */
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import axios from 'axios';

// Create styling for the input form
const useStyles = makeStyles(() => ({
  formContainer: {
    width: '500px',
    backgroundColor: '#f0f0f5',
    borderRadius: '5px',
    margin: 'auto',
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    textDecoration: 'none',
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

const NewStudentView = (props) => {
  const classes = useStyles();
  const { studData, campuses } = props; // campuses passed as prop

  const [studentData, setStudentData] = useState({
    firstname: studData?.firstname || '',
    lastname: studData?.lastname || '',
    email: studData?.email || '',
    imageUrl: studData?.imageUrl,
    gpa: studData?.gpa,
    campusId: studData?.campusId || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validate = () => {
    let formErrors = {};
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const gpaRegex = /^[0-4](\.\d{1,2})?$/;

    // Validate first name
    if (!studentData.firstname.trim()) formErrors.firstname = 'First name is required';

    // Validate last name
    if (!studentData.lastname.trim()) formErrors.lastname = 'Last name is required';

    // Validate email
    if (!studentData.email || !emailRegex.test(studentData.email)) {
      formErrors.email = 'Invalid email format';
    }

    // Validate image URL (basic validation)
    if (studentData.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(studentData.imageUrl)) {
      formErrors.imageUrl = 'Invalid image URL (must end in .jpg, .jpeg, .png, or .gif)';
    }

    // Validate GPA (must be a number between 0 and 4 if provided)
    if (studentData.gpa && !gpaRegex.test(studentData.gpa)) {
      formErrors.gpa = 'GPA must be a number between 0 and 4';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // returns true if no errors
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        if (studData) {
          // Update existing student
          const response = await axios.put(`/api/students/${studData.id}`, studentData);
          console.log('Student updated:', response.data);
        } else {
          // Create new student
          const response = await axios.post('/api/students', studentData);
          console.log('New student added:', response.data);
        }
        // Optionally reset form or navigate after submission
      } catch (error) {
        console.error('Error submitting form:', error.response?.data || error.message);
        alert('Error adding/updating student: ' + (error.response?.data.message || error.message));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <h1>New Student</h1>

      <div className={classes.root}>
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
              Add a Student
            </Typography>
          </div>
          <form style={{ textAlign: 'center' }} onSubmit={handleFormSubmit}>
            <label style={{ color: '#11153e', fontWeight: 'bold' }}>First Name: </label>
            <input
              type="text"
              name="firstname"
              value={studentData.firstname}
              onChange={handleChange}
            />
            <div className={classes.errorText}>{errors.firstname}</div>
            <br />
            <br />

            <label style={{ color: '#11153e', fontWeight: 'bold' }}>Last Name: </label>
            <input
              type="text"
              name="lastname"
              value={studentData.lastname}
              onChange={handleChange}
            />
            <div className={classes.errorText}>{errors.lastname}</div>
            <br />
            <br />

            <label style={{ color: '#11153e', fontWeight: 'bold' }}>Email: </label>
            <input
              type="email"
              name="email"
              value={studentData.email}
              onChange={handleChange}
            />
            <div className={classes.errorText}>{errors.email}</div>
            <br />
            <br />

            <label style={{ color: '#11153e', fontWeight: 'bold' }}>Image URL: </label>
            <input
              type="text"
              name="imageUrl"
              value={studentData.imageUrl}
              onChange={handleChange}
            />
            <div className={classes.errorText}>{errors.imageUrl}</div>
            <br />
            <br />

            <label style={{ color: '#11153e', fontWeight: 'bold' }}>GPA: </label>
            <input
              type="text"
              name="gpa"
              value={studentData.gpa}
              onChange={handleChange}
            />
            <div className={classes.errorText}>{errors.gpa}</div>
            <br />
            <br />

            <label style={{ color: '#11153e', fontWeight: 'bold' }}>Campus: </label>
            <select
              name="campusId"
              value={studentData.campusId}
              onChange={handleChange}
            >
              <option value="">Select a Campus</option>
              {campuses && campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
            <br />
            <br />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            <br />
            <br />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewStudentView;
