import React, { useState } from 'react';
import axios from 'axios';

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
      // Create a new callout record using calloutData
      const response = await axios.post('http://127.0.0.1:8000/api/patient-callouts/', {
        ...calloutData,
        patient: patientDetails.calloutId
      });

      // Handle successful submission (e.g., show a success message)
      console.log('Callout record created:', response.data);

      // Clear the form after submission
      setCalloutData({
        status: 'pending',
        actionsTaken: '',
        treatmentNotes: ''
      });
    } catch (error) {
      console.error('Error submitting callout:', error);
    }
  };

  return (
    <div>
      <h2>Patient Details</h2>
      <p>Patient: {patientDetails.last_name}, {patientDetails.first_name}</p>
      <p>Condition: {medicalCondition}</p>
      {/* Add more patient details here as needed */}
      
      <form onSubmit={handleSubmit}>
        <label>
          Status:
          <select name="status" value={calloutData.status} onChange={handleStatusChange}>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          Actions Taken:
          <textarea name="actions_taken" value={calloutData.actions_taken} onChange={handleInputChange} />
        </label>
        <label>
          Treatment Notes:
          <textarea name="treatment_notes" value={calloutData.treatment_notes} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit Callout</button>
      </form>
    </div>
  );
};

export default CalloutForm;
