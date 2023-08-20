import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalloutForm from './CalloutForm';

const AmbulanceDashboard = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  const fetchAcceptedRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/dispatch-requests/?dispatch_status=accepted');
      setAcceptedRequests(response.data);
    } catch (error) {
      console.error('Error fetching accepted dispatch requests:', error);
    }
  };

  const handleDispatchAccepted = async (id) => {
    try {
      await axios.patch(`http://localhost:8001/api/dispatch-requests/${id}/`, {
        dispatch_status: 'ambulance accepted'
      });

      // Fetch patient details based on nhs_number
      const selectedRequest = acceptedRequests.find(request => request.id === id);
      const response = await axios.get(`http://localhost:8000/api/patients/?nhs_number=${selectedRequest.nhs_number}`);
      const patientDetails = response.data[0]; // Assuming the response is an array

      // Render the CalloutForm component with patient details
      setAcceptedRequests(prevRequests => {
        return prevRequests.map(request => {
          if (request.id === id) {
            return {
              ...request,
              patientDetails
            };
          }
          return request;
        });
      });
    } catch (error) {
      console.error('Error accepting dispatch:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Ambulance Dashboard</h2>
      <ul>
        {acceptedRequests.map(request => (
          <li className="request-item" key={request.id}>
            <span className="request-info">
              Patient: {request.nhs_number}
              <br />
              Medical Condition: {request.medical_condition}
              <br />
              Requesting Hospital: {request.chosen_hospital}
              <br />
              Location: {request.location}
            </span>
            <br></br>
            <button className="accept-button" onClick={() => handleDispatchAccepted(request.id)}>Accept Dispatch</button>
            {request.patientDetails && (
              <CalloutForm nhsNumber={request.nhs_number} patientDetails={request.patientDetails} medicalCondition={request.medical_condition} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AmbulanceDashboard;
