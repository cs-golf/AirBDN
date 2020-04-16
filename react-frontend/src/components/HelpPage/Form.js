import React from "react";
import "./Form.css";
import axios from "axios";

export default function Form() {
  let email;
  let number;
  return (
    <div className={"form"}>
      <div className={"textArea"}>
        <input
          value={email}
          onChange={e => (email = e.target.value)}
          className={"textBox"}
          placeholder={"Email"}
        />
        {/* <input
          value={number}
          onChange={e => (number = e.target.value)}
          className={"textBox"}
          placeholder={"Phone Number"}
        /> */}
      </div>
      <button
        onClick={() => {
          axios.post(`https://airbdn-api.herokuapp.com/contact?email=${email}`);
          email = "";
          // number = "";
        }}
        className={"submitButton"}
      >
        Submit
      </button>
    </div>
  );
}
