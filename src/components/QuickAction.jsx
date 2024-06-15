import React from "react";
import { Button, Tooltip } from "@mui/material";
import { ButtonGroup } from "@mui/material";
const QuickAction = () => {
  return (
    <div>
      <ButtonGroup>
        <Tooltip title="Hide All" placement="bottom-end">
          <Button variant="contained">ALL</Button>
        </Tooltip>
        <Tooltip title="Hide Level 1" placement="bottom-end">
          <Button variant="contained">1</Button>
        </Tooltip>
        <Tooltip title="Hide Level 3" placement="bottom-end">
          <Button variant="contained">3</Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};

export default QuickAction;
