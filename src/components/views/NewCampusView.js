import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import axios from 'axios';

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

const NewCampusView = (props) => {
  const classes = useStyles();
  const { campusData } = props;

  const [formData, setFormData] = useState({
    name: campusData?.name || '',
    address: campusData?.address || '',
    description: campusData?.description,
    imageUrl: campusData?.imageUrl,
  });

  const [errors, setErrors] = useState({
    name: '',
    address: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (campusData) {
      setFormData({
        name: campusData.name,
        address: campusData.address,
        description: campusData.description,
        imageUrl: campusData.imageUrl,
      });
    }
  }, [campusData]);

  const validate = () => {
    let formErrors = {};
    const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/;

    if (!formData.name) formErrors.name = 'Name is required';

    if (!formData.address) formErrors.address = 'Address is required';

    if (formData.imageUrl && !imageUrlRegex.test(formData.imageUrl)) {
      formErrors.imageUrl = 'Invalid image URL (must be a valid URL ending in .jpg, .jpeg, .png, or .gif)';
    }


    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    if (validate()) {
      if (campusData) {
        axios.put(`/api/campuses/${campusData.id}`, formData)
      } else {
        axios.post('/api/campuses', formData)

      }
    }
  };
  return (
    <div>
      <h1>{campusData ? 'Edit Campus' : 'New Campus'}</h1>

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
            {campusData ? 'Edit Campus' : 'Add a New Campus'}
          </Typography>
        </div>
        <form style={{ textAlign: 'center' }} onSubmit={handleFormSubmit}>
          <label style={{ color: '#11153e', fontWeight: 'bold' }}>Campus Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div className={classes.errorText}>{errors.name}</div>
          <br />
          <br />

          <label style={{ color: '#11153e', fontWeight: 'bold' }}>Address: </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <div className={classes.errorText}>{errors.address}</div>
          <br />
          <br />

          <label style={{ color: '#11153e', fontWeight: 'bold' }}>Description: </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <div className={classes.errorText}>{errors.description}</div>
          <br />
          <br />

          <label style={{ color: '#11153e', fontWeight: 'bold' }}>Image URL: </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <div className={classes.errorText}>{errors.imageUrl}</div>
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            type="submit"
          // disabled={Object.keys(errors).length > 0 || !formData.name || !formData.address || !formData.description || !formData.imageUrl}
          >
            {campusData ? 'Update Campus' : 'Submit New Campus'}
          </Button>

          <br />
          <br />
        </form>
      </div>
    </div>
  );
};

export default NewCampusView;
