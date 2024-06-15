import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { foldOnIndentLvl } from "../modules/codemirror.js";
import "../css/SplitButtonEditor.css";

export const SplitButtonEditor = ({ options, editorView, childCountArray }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [foldLevel, setFoldLevel] = useState(0);
  const [hide, setHide] = useState(true);
  const [numofLevelChild, setNumofLevelChild] = useState([]);

  const filteredOptions = options.filter((value) => {
    return value !== "child";
  });

  useEffect(() => {
    const updatedNumofLevelChild = options
      .filter((value) => value !== "child")
      .map((value) => {
        const count = childCountArray.reduce((acc, item) => {
          if (item[0][0] === value) {
            return acc + item[0][1];
          }
          return acc;
        }, 0);
        return [value, count];
      })
      .map((item) => {
        return [...item, { hidden: false }];
      });

    setNumofLevelChild(updatedNumofLevelChild);
  }, [options, childCountArray]);

  useEffect(() => {
    if (numofLevelChild.length > 0) {
      foldOnIndentLvl(
        editorView,
        foldLevel,
        selectedIndex,
        numofLevelChild,
        setNumofLevelChild
      );
    }
  }, [hide]);

  const handleClick = (event) => {
    const newFoldLevel =
      event.target.innerText === "HIDE ROOT" && "UNHIDE ROOT"
        ? 0
        : Number(event.target.innerText[5]) * 2;
    setFoldLevel(newFoldLevel);
    foldOnIndentLvl(
      editorView,
      foldLevel,
      selectedIndex,
      numofLevelChild,
      setNumofLevelChild
    );
    setHide(!hide);
    toggleHidden(selectedIndex);
  };
  const handleMenuItemClick = (event, index) => {
    setFoldLevel(
      event.target.firstChild.innerText === "Hide root" && "Unhide root"
        ? 0
        : index * 2
    );
    setSelectedIndex(index);
    setHide(!hide);
    setOpen(false);
  };
  const toggleHidden = (idx) => {
    setNumofLevelChild((prevNumofLevelChild) =>
      prevNumofLevelChild.map((item, index) =>
        idx === index
          ? [...item.slice(0, 2), { hidden: !item[2].hidden }]
          : item
      )
    );
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
        <Button
          sx={
            // editorView?.contentDOM?.innerText &&
            // editorView.contentDOM.innerText === " "
            //   ? { opacity: "0.6" }
            //   : {}
            options[0] ? {} : { opacity: "0.6" }
          }
          onClick={(event) => options[0] && handleClick(event)}
        >
          {numofLevelChild[selectedIndex]
            ? numofLevelChild[selectedIndex][2].hidden
              ? `Unhide ${filteredOptions[selectedIndex]}`
              : `Hide ${filteredOptions[selectedIndex]}`
            : `Enter the JSON`}
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
                  {numofLevelChild.map((option, index) => (
                    <MenuItem
                      key={index}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                      //  sx={hide ? { backgroundColor: "gray" } : {}}
                    >
                      <p className="options">
                        <span>
                          {option[2].hidden
                            ? `Unhide ${option[0]}`
                            : `Hide ${option[0]}`}
                        </span>

                        <span className="flex-end">{option[1]}</span>
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
