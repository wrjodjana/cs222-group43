import React, { useContext } from "react";
import { Form, Image, Button } from "react-bootstrap";
import AuthContext from "../context/AuthContext";

export const Preferences = () => {
  return (
    <div className="user preferences">
      <section id="section">
        <Form onSubmit /*={storepreferences}*/>
          <Form.Label className="title" for="location">
            {" "}
            Location{" "}
          </Form.Label>
          <Form.Control type="location" name="location" />
          <br />
          <Button type="submit">submit</Button>
        </Form>
      </section>
    </div>
  );
};
