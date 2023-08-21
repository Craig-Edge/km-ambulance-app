import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalloutForm from './CalloutForm';
import './AmbulanceDashboard.css';

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
      const selectedRequest = acceptedRequests.find(request => request.id === id);
      const response = await axios.get(`http://localhost:8000/api/patients/?nhs_number=${selectedRequest.nhs_number}`);
      const patientDetails = response.data[0];
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
      <div className="dashboard-header">
        <h2 className="dashboard-title">Ambulance Dashboard</h2>
        <button className="refresh-button" onClick={fetchAcceptedRequests}>Refresh</button>
      </div>
      <ul className="request-list">
        {acceptedRequests.map(request => (
          <li className="request-item" key={request.id}>
            <div className="request-info">
              <p><strong>Patient:</strong> {request.nhs_number}</p>
              <p><strong>Medical Condition:</strong> {request.medical_condition}</p>
              <p><strong>Requesting Hospital:</strong> {request.chosen_hospital}</p>
              <p><strong>Location:</strong> {request.location}</p>
            </div>
            <div className="request-actions">
              {request.patientDetails ? (
                <div className="form-container">
                  <CalloutForm nhsNumber={request.nhs_number} patientDetails={request.patientDetails} medicalCondition={request.medical_condition} />
                </div>
              ) : (
                <div className="accept-button-container">
                  <button className="accept-button" onClick={() => handleDispatchAccepted(request.id)}>Accept Dispatch</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AmbulanceDashboard;
