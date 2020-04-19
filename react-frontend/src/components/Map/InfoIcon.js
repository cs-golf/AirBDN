import React from "react";
import "./InfoIcon.css";

export default ({ width = "100%", height = "100%" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="160"
    width="160"
    version="1.0"
  >
    <g className="InfoIconPath">
      <path d="m80 15c-35.88 0-65 29.12-65 65s29.12 65 65 65 65-29.12 65-65-29.12-65-65-65zm0 10c30.36 0 55 24.64 55 55s-24.64 55-55 55-55-24.64-55-55 24.64-55 55-55z" />
      <path
        d="m57.373 18.231a9.3834 9.1153 0 1 1 -18.767 0 9.3834 9.1153 0 1 1 18.767 0z"
        transform="matrix(1.1989 0 0 1.2342 21.214 28.75)"
      />
      <path d="m90.665 110.96c-0.069 2.73 1.211 3.5 4.327 3.82l5.008 0.1v5.12h-39.073v-5.12l5.503-0.1c3.291-0.1 4.082-1.38 4.327-3.82v-30.813c0.035-4.879-6.296-4.113-10.757-3.968v-5.074l30.665-1.105" />
    </g>
  </svg>
);
