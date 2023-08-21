import React, { useState } from 'react';
import axios from 'axios';
import './CalloutForm.css';

const CalloutForm = ({ patientDetails, medicalCondition }) => {
  const [calloutData, setCalloutData] = useState({
    status: 'pending',
    actions_taken: '',
    treatment_notes: '',
    nhs_number: patientDetails.nhs_number
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCalloutData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleStatusChange = (event) => {
    const { value } = event.target;
    setCalloutData(prevData => ({ ...prevData, status: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
  
      const response = await axios.post('http://127.0.0.1:8000/api/patient-callouts/', {
        ...calloutData,
        patient: patientDetails.calloutId
      });
      console.log('Callout record created:', response.data);

      setCalloutData({
        status: 'pending',
        actions_taken: '',
        treatment_notes: ''
      });
    } catch (error) {
      console.error('Error submitting callout:', error);
    }
  };

  return (
    <div className="callout-form-container">
      <h2>Patient Details</h2>
      <p>Patient: {patientDetails.last_name}, {patientDetails.first_name}</p>
      <p>Condition: {medicalCondition}</p>
      
      <form className="callout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={calloutData.status} onChange={handleStatusChange}>
          <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="actions_taken">Actions Taken:</label>
          <textarea id="actions_taken" name="actions_taken" value={calloutData.actions_taken} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="treatment_notes">Treatment Notes:</label>
          <textarea id="treatment_notes" name="treatment_notes" value={calloutData.treatment_notes} onChange={handleInputChange} />
        </div>
        <button type="submit">Submit Callout</button>
      </form>
    </div>
  );
};

export default CalloutForm;
