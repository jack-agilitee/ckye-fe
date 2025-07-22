'use client';

import { useState } from 'react';

const imgIcon = "http://localhost:3845/assets/fa4a69234bc3df3a0da8f69a03c3b00875636abe.svg";
const imgIcon1 = "http://localhost:3845/assets/9a30c46fd6fb5c258f1a75302caeb94a99e3f2bd.svg";
const img = "http://localhost:3845/assets/360cea2dac2f242a037fdeee2570d966016d706f.svg";
const img1 = "http://localhost:3845/assets/efc5fba5336814e8ddc4545996342c96f959a2c5.svg";

const ChevronDown = () => {
  return (
    <div className="left-nav__chevron-down">
      <div className="left-nav__chevron-down-icon">
        <img alt="" className="left-nav__chevron-down-img" src={imgIcon} />
      </div>
    </div>
  );
};

const Note = () => {
  const handleNoteClick = () => {
    console.log("Note/Settings icon clicked");
    // TODO: Create functionality to create a new MD file when clicked
  };

  return (
    <div 
      className="left-nav__note" 
      onClick={handleNoteClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNoteClick();
        }
      }}
    >
      <div className="left-nav__note-icon">
        <img alt="" className="left-nav__note-img" src={imgIcon1} />
      </div>
    </div>
  );
};

const ListItem = ({ 
  state = "Unselected", 
  fileName = "Claude.md",
  onClick 
}) => {
  const handleClick = () => {
    console.log(`File item clicked: ${fileName}`);
    // TODO: Should open that MD file
    if (onClick) onClick(fileName);
  };

  const element = (
    <p className="left-nav__list-item-text">
      {fileName}
    </p>
  );

  const isSelected = state === "Selected";
  const iconSrc = isSelected ? img : img1;

  return (
    <div 
      className={`left-nav__list-item ${isSelected ? 'left-nav__list-item--selected' : ''}`}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="left-nav__list-item-content">
        <div className="left-nav__list-item-container">
          <div className="left-nav__list-item-icon-wrapper">
            <div className="left-nav__list-item-icon">
              <img alt="" className="left-nav__list-item-icon-img" src={iconSrc} />
            </div>
          </div>
          <div className="left-nav__list-item-label">
            {element}
          </div>
        </div>
      </div>
    </div>
  );
};


const LeftNav = ({ onAccountModalToggle }) => {
  const [selectedFile, setSelectedFile] = useState("Claude.md");

  const handleAccountClick = () => {
    console.log("Account changer clicked - opening AccountModal");
    if (onAccountModalToggle) onAccountModalToggle();
  };

  const handleAddNewClick = () => {
    console.log("Add New button clicked");
    // TODO: Create functionality to create a new MD file when clicked
  };

  const handleFileClick = (fileName) => {
    setSelectedFile(fileName);
  };

  const contextFiles = [
    { name: "Claude.md", selected: selectedFile === "Claude.md" },
    { name: "Commands.md", selected: selectedFile === "Commands.md" },
    { name: "Integrations/MCP", selected: selectedFile === "Integrations/MCP" }
  ];

  return (
    <div className="left-nav">
      <div 
      className="left-nav__account-changer" 
      onClick={handleAccountClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAccountClick();
        }
      }}
    >
        <div className="left-nav__account">
          <div className="left-nav__avatar">
            <div className="left-nav__avatar-text">
              <p>A</p>
            </div>
          </div>
          <div className="left-nav__name">
            <div className="left-nav__name-text">
              <p>AEO</p>
            </div>
            <div className="left-nav__chevron">
              <ChevronDown />
            </div>
          </div>
        </div>
        <div className="left-nav__note-wrapper">
          <Note />
        </div>
      </div>
      
      <div className="left-nav__content">
        <div className="left-nav__sections">
          <div className="left-nav__context-section">
            <div className="left-nav__context-title">
              <p>CONTEXT</p>
            </div>
            <div className="left-nav__file-list">
              {contextFiles.map((file) => (
                <div key={file.name} className="left-nav__file-item">
                  <ListItem 
                    state={file.selected ? "Selected" : "Unselected"}
                    fileName={file.name}
                    onClick={handleFileClick}
                  />
                </div>
              ))}
              <div 
                className="left-nav__add-new" 
                onClick={handleAddNewClick}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleAddNewClick();
                  }
                }}
              >
                <span className="left-nav__add-new-icon">+</span>
                <span className="left-nav__add-new-text">Add New</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;