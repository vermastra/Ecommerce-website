import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a href="mailto:123adiverma@gmail.com" className="mailBtn">
        <Button>Contact: 123adiverma@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;