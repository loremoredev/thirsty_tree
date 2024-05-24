import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import {foldOnIndentLvl} from '../modules/codemirror.js'
import '../css/SplitButtonEditor.css'

export const SplitButtonEditor = ({ options, editorView }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [foldLevel, setFoldLevel] = useState(0);
  const [hide, setHide] = useState(true);
  const filteredOptions = options.filter((value) => {
    return value !== "root" && value !== "child";
  });
  const handleClick = (event) => {
    const newFoldLevel = Number (event.target.innerText[5]) * 2;
    setFoldLevel(newFoldLevel);
    foldOnIndentLvl(editorView, newFoldLevel, hide);
    setHide(!hide);
  };
  const handleMenuItemClick = (event, index) => {
    setHide(!hide);
    const newFoldLevel = Number (event.target.innerText[5])*2;
    foldOnIndentLvl(editorView, newFoldLevel, hide);
    setFoldLevel(newFoldLevel);
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        {/* {console.log(options[selectedIndex])} */}
        <Button onClick={(event) => handleClick(event)}>
          {options[0]
            ? hide ? `Hide ${filteredOptions[selectedIndex]}` : `UnHide ${filteredOptions[selectedIndex]}`
            : `Hide 1 st Level Parent`}
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={options.length > 0 ? handleToggle : undefined}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {filteredOptions.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      <p className="options">
                      <span>{`Hide ${option}`}</span>
                      
                      <span className="flex-end">100</span>
                      </p>
                      
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
};