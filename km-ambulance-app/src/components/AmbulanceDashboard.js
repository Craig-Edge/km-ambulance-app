import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalloutForm from './CalloutForm';
import './AmbulanceDashboard.css'; // Import your CSS file for styling

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
      <ul className="request-list">
        {acceptedRequests.map(request => (
          <li className="request-item" key={request.id}>
            <div className="request-info">
              <p><strong>Patient:</strong> {request.nhs_number}</p>
              <p><strong>Medical Condition:</strong> {request.medical_condition}</p>
              <p><strong>Requesting Hospital:</strong> {request.chosen_hospital}</p>
              <p><strong>Location:</strong> {request.location}</p>
            </div>
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
