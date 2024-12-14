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

const EditCampusView = () => {
  const classes = useStyles();
  const { id } = useParams(); // Get the campus ID from the URL
  const history = useHistory();

  const [campusData, setCampusData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    axios.get(`/api/campuses/${id}`)
      .then((response) => {
        setCampusData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching campus data:', error);
      });
  }, [id]);

  const validate = () => {
    let formErrors = {};

    if (!campusData.name) formErrors.name = 'Campus name is required';
    if (campusData.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(campusData.imageUrl)) formErrors.imageUrl = 'Invalid image URL';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampusData({
      ...campusData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      axios.put(`/api/campuses/${id}`, campusData)
        .then((response) => {
          console.log('Campus updated:', response.data);
          history.push(`/campus/${id}`); // Redirect to campus details page
        })
        .catch((error) => {
          console.error('Error updating campus:', error);
        });
    }
  };

  return (
    <div>
      <h1>Edit Campus</h1>

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
            Edit Campus Information
          </Typography>
        </div>
        <form onSubmit={handleFormSubmit}>
          <label>Campus Name: </label>
          <input
            type="text"
            name="name"
            value={campusData.name}
            onChange={handleChange}
            required
          />
          <div className={classes.errorText}>{errors.name}</div>
          <br />
          
          <label>Description: </label>
          <textarea
            name="description"
            value={campusData.description}
            onChange={handleChange}
          />
          <div className={classes.errorText}>{errors.description}</div>
          <br />
          
          <label>Image URL: </label>
          <input
            type="text"
            name="imageUrl"
            value={campusData.imageUrl}
            onChange={handleChange}
          />
          <div className={classes.errorText}>{errors.imageUrl}</div>
          <br />
          
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditCampusView;
