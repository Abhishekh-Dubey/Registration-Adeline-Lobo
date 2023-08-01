import React, { useEffect, useState } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
// import "./Home.css";

const stateCityData = {
  states: [
    {
      name: "State 1",
      cities: ["City 1", "City 2", "City 3"],
    },
    {
      name: "State 2",
      cities: ["City 4", "City 5", "City 6"],
    },
    // Add more states and cities as needed
  ],
};

export default function Home() {
  const [signUpUser, setSignUpUser] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
  });
  const [data, setData] = useState([]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setSignUpUser({ ...signUpUser, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { name, phone, city, state } = signUpUser;
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

  const fetchData = () => {
    fetch("/getdata", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data); // Update the data state with the new data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/delete/${id}`, {
        method: "DELETE",
      });

      // If deletion is successful, fetch the updated data from the server
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  return (
    <div>
      <Container className="signup-container bg-secondary text-white">
        <Row className="vh-40 mt-5 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="px-4 signup-col bg-dark">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-center text-uppercase">
                    Logo
                  </h2>
                  <div className="mb-3">
                    <Form method="POST" id="register-form">
                      {/*------= Enter Name------*/}
                      <Form.Control
                        className="mb-3 "
                        name="name"
                        id="name"
                        type="text"
                        value={signUpUser.name}
                        onChange={handleInput}
                        placeholder="Enter Name"
                      />
                      {/*----- Enter Phone No-----*/}
                      <Form.Control
                        className="mb-3 "
                        name="phone"
                        id="phone"
                        type="number"
                        value={signUpUser.phone}
                        onChange={handleInput}
                        placeholder="Enter Phone No"
                      />
                      {/*------= Select state------*/}
                      <Form.Control
                        as="select"
                        className="mb-3"
                        name="state"
                        id="state"
                        value={signUpUser.state}
                        onChange={handleInput}
                      >
                        <option value="">Select State</option>
                        {stateCityData.states.map((state, index) => (
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
                        value={signUpUser.city}
                        onChange={handleInput}
                      >
                        <option value="">Select City</option>
                        {stateCityData.states
                          .find((state) => state.name === signUpUser.state)
                          ?.cities.map((city, index) => (
                            <option key={index} value={city}>
                              {city}
                            </option>
                          ))}
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
      <table className="table">
        <thead>
          <tr>
            <th scope="col">count</th>
            <th scope="col">Name</th>
            <th scope="col">Phone No</th>
            <th scope="col">City</th>
            <th scope="col">State</th>
            <th scope="col">option</th>
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
    </div>
  );
}
