import React, { useEffect, useState } from "react";
import {
  Col,
  Button,
  Row,
  Container,
  Card,
  Form,
  Modal,
} from "react-bootstrap";
// import "./Home.css";
import { StateCityData } from "./StateCityData";

export default function Home() {
  const [regUser, setRegUser] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
  });
  const [getUpdate, setUpdate] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
  });

  const [dataUpdate, setDataUpdate] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [data, setData] = useState([]);
  // register/insert deta start
  const handleInput = (e) => {
    const { name, value } = e.target;
    setRegUser({ ...regUser, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { name, phone, city, state } = regUser;
    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone, city, state }),
    });
    const data = await res.json();
    if (data.status === 422 || !data) {
      window.alert(data.error);
    } else {
      window.alert(data.message);
      fetchData(); // Fetch updated data after successful registration
    }
  };
  // register/insert deta end
  // teble/geting deta start

  const fetchData = () => {
    fetch("/getdata", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  // teble/geting deta end
  // delete deta start
  const handleDelete = async (id) => {
    try {
      await fetch(`/delete/${id}`, {
        method: "DELETE",
      });

      fetchData();
      window.alert("Data id Deleted");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  // delete deta end
  //udating data start
  const handleUpdateInput = (e) => {
    const { name, value } = e.target;
    setUpdate({ ...getUpdate, [name]: value });
  };

  const handleEdit = (item) => {
    setUpdate({ ...item });
    setEditItemId(item._id);
    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/update/${editItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getUpdate),
      });

      const dataUpdate = await res.json();

      if (dataUpdate.error) {
        window.alert(dataUpdate.error);
      } else {
        window.alert(dataUpdate.message);
        setIsEditModalVisible(false);
        fetchdataUpdate(); // Fetch the updated dataUpdate from the server
        const updatedDataIndex = data.findIndex(
          (item) => item._id === editItemId
        );

        if (updatedDataIndex !== -1) {
          // Update the state with the updated data
          setData((prevData) => {
            const updatedData = [...prevData];
            updatedData[updatedDataIndex] = {
              ...updatedData[updatedDataIndex],
              ...getUpdate,
            };
            return updatedData;
          });
        }
      }
    } catch (error) {
      console.error("Error updating dataUpdate:", error);
      window.alert("Failed to update dataUpdate. Please try again later.");
    }
  };

  useEffect(() => {
    fetchdataUpdate(); // Fetch initial dataUpdate from the server
  }, []);

  const fetchdataUpdate = async () => {
    try {
      const res = await fetch("/getdataUpdate", {
        method: "GET",
      });
      const dataUpdate = await res.json();
      setDataUpdate(dataUpdate.dataUpdate);
    } catch (error) {
      console.error("Error fetching dataUpdate:", error);
    }
  };
  console.log(editItemId);
  console.log("getUpdate", getUpdate);
  //udating data end
  return (
    <div>
      <Container className="signup-container bg-secondary text-white">
        <Row className="vh-40 mt-5 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="px-4 signup-col bg-dark  text-white">
              <Card.Body>
                <div className="mb-5 mt-md-4">
                  <h2 className="fw-bold mb-2 text-center text-uppercase">
                    Registration Form
                  </h2>
                  <div className="mb-3">
                    <Form method="POST" id="register-form">
                      {/*------= Enter Name------*/}
                      <Form.Control
                        className="mb-3 "
                        name="name"
                        id="name"
                        type="text"
                        value={regUser.name}
                        onChange={handleInput}
                        placeholder="Enter Name"
                      />
                      {/*----- Enter Phone No-----*/}
                      <Form.Control
                        className="mb-3 "
                        name="phone"
                        id="phone"
                        type="number"
                        value={regUser.phone}
                        onChange={handleInput}
                        placeholder="Enter Phone No"
                      />
                      {/*------= Select state------*/}
                      <Form.Control
                        as="select"
                        className="mb-3"
                        name="state"
                        id="state"
                        value={regUser.state}
                        onChange={handleInput}
                      >
                        <option value="">Select State</option>
                        {StateCityData.states.map((state, index) => (
                          <option key={index} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </Form.Control>
                      {/*------= Select city------*/}
                      <Form.Control
                        as="select"
                        className="mb-3"
                        name="city"
                        id="city"
                        value={regUser.city}
                        onChange={handleInput}
                      >
                        <option value="">Select City</option>
                        {StateCityData.states
                          .find((state) => state.name === regUser.state)
                          ?.cities.map((city, index) => (
                            <option key={index} value={city}>
                              {city}
                            </option>
                          ))}{" "}
                      </Form.Control>
                      {/*----Create Account Button---*/}
                      <Button
                        className="signup_button"
                        variant="primary"
                        type="submit"
                        onClick={PostData}
                      >
                        Register
                      </Button>
                    </Form>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <table className="table table-container">
        <thead>
          <tr>
            <th scope="col">count</th>
            <th scope="col">Name</th>
            <th scope="col">Mobile No</th>
            <th scope="col">City</th>
            <th scope="col">State</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.city}</td>
                <td>{item.state}</td>
                <td>
                  <Button
                    className="ml-1 "
                    variant="info"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>{" "}
                  |{" "}
                  <Button
                    className="mr-1 "
                    variant="danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal
        show={isEditModalVisible}
        onHide={() => setIsEditModalVisible(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit dataUpdate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                value={getUpdate.name}
                onChange={handleUpdateInput}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                type="text"
                value={getUpdate.phone}
                onChange={handleUpdateInput}
              />
            </Form.Group>
            <Form.Group controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control
                as="select"
                name="state"
                value={getUpdate.state}
                onChange={handleUpdateInput}
              >
                <option value="">Select a state</option>
                {StateCityData.states.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                as="select"
                name="city"
                value={getUpdate.city}
                onChange={handleUpdateInput}
                disabled={!getUpdate.state} // Disable the city dropdown until a state is selected
              >
                <option value="">Select a city</option>
                {getUpdate.state &&
                  StateCityData.states
                    .find((state) => state.name === getUpdate.state)
                    .cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsEditModalVisible(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
