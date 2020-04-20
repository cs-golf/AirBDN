import React from "react";
import axios from "axios";

export default function Form() {
  let email;
  let number;
  return (
    <div className={"form"}>
      <input
        value={email}
        onChange={(e) => (email = e.target.value)}
        className={"textBox"}
        placeholder={"Email Address"}
      />
      <button
        onClick={() => {
          if (email) {
            axios.post(
              `https://airbdn-api.herokuapp.com/contact?email=${email}`
            );
            alert("Thanks for your help!");
            email = "";
          }
          // number = "";
        }}
        className={"submitButton"}
      >
        Submit
      </button>
    </div>
  );
}
