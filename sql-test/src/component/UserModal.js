import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/style.css";

function UserModal() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({});

  async function handleButtonClick(user) {
    try {
      const importedData = await import(`../json/${user.Name}.json`); // Assuming JSON files are in the same folder as UserModal.js
      setUserData(importedData.default);
      setSelectedUser(user);
      setShow(true);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  function handleClose() {
    setSelectedUser(null);
    setUserData({});
    setShow(false);
  }

  useEffect(() => {
    fetch("https://lagueslo.com:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      {users.map((user) => (
        <Button
          className="col-md-12"
          key={user.ID}
          variant="primary"
          onClick={() => handleButtonClick(user)}
        >
          {user.Name}
        </Button>
      ))}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details - {selectedUser?.Name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userData && (
            <>
              <h4>{selectedUser?.Name}</h4>
              <img
                className="image"
                src={userData.image}
                alt={selectedUser?.Name}
              />
              <p>Country: {userData.country}</p>
              <p>Feedback: {userData.feedback}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserModal;
