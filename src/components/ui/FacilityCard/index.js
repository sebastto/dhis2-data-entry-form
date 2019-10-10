import React from "react";
import { Chip } from "@dhis2/ui-core";

import "./index.css";

const FacilityCard = ({ title, deadlines, onClick }) => {
  return (
    <button className="facility-card" onClick={onClick}>
      <span className="facility-card-title">{title}</span>
      <span className="facility-card-deadlines">
        {deadlines.expired > 0 ? (
          <Chip className="chip-expired">{deadlines.expired}</Chip>
        ) : (
          ""
        )}
        {deadlines.due > 0 ? (
          <Chip className="chip-due">{deadlines.due}</Chip>
        ) : (
          ""
        )}
      </span>
    </button>
  );
};

export default FacilityCard;
