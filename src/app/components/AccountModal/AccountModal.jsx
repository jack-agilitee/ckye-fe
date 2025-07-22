'use client';

import { useState } from 'react';

const img = "http://localhost:3845/assets/47a7e7fad015de80110d0caec6bac8ae6ab23559.svg";
const img1 = "http://localhost:3845/assets/c7d2f16c57b076ac55609b38c86641d480b6a099.svg";
const imgLine1 = "http://localhost:3845/assets/c6528a709385f05d704ec137fd919914a20fa095.svg";
const img2 = "http://localhost:3845/assets/88329fbb407c5c633de7be2e8654d2c96464d5c6.svg";
const img3 = "http://localhost:3845/assets/8f3a8b5775de22b382eff93a69c192e3cfd22ab3.svg";

const AccountModal = ({ isOpen, onClose }) => {
  const [selectedAccount, setSelectedAccount] = useState("AEO");

  const handleSettingsClick = () => {
    console.log("Settings button clicked");
    // TODO: Navigate to settings page or open settings modal
  };

  const handleInviteMembersClick = () => {
    console.log("Invite Members button clicked");
    // TODO: Open invite members modal or flow
  };

  const handleAccountSelect = (accountName) => {
    setSelectedAccount(accountName);
    console.log(`Account selected: ${accountName}`);
    // TODO: Switch to selected account
  };

  const handleLogOutClick = () => {
    console.log("Log Out clicked");
    // TODO: Implement logout functionality
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const accounts = [
    { name: "AEO", selected: selectedAccount === "AEO" },
    { name: "Dollar General", selected: selectedAccount === "Dollar General" },
    { name: "Agilitee", selected: selectedAccount === "Agilitee" }
  ];

  return (
    <div className="account-modal__overlay" onClick={handleOverlayClick}>
      <div className="account-modal">
        <div className="account-modal__content">
          <div className="account-modal__workspace">
            <div className="account-modal__avatar">
              <div className="account-modal__avatar-text">
                <p>A</p>
              </div>
            </div>
            <div className="account-modal__workspace-info">
              <div className="account-modal__workspace-name">
                <p>AEO</p>
              </div>
              <div className="account-modal__workspace-members">
                <p>3 Members</p>
              </div>
            </div>
          </div>

          <div className="account-modal__ctas">
            <div 
              className="account-modal__cta account-modal__cta--settings" 
              onClick={handleSettingsClick}
            >
              <div className="account-modal__cta-icon">
                <div className="account-modal__settings-icon">
                  <img alt="" className="account-modal__icon-img" src={img} />
                </div>
              </div>
              <div className="account-modal__cta-text">
                <p>Settings</p>
              </div>
            </div>
            <div 
              className="account-modal__cta account-modal__cta--invite" 
              onClick={handleInviteMembersClick}
            >
              <div className="account-modal__cta-icon">
                <div className="account-modal__invite-icon">
                  <img alt="" className="account-modal__icon-img" src={img1} />
                </div>
              </div>
              <div className="account-modal__cta-text">
                <p>Invite Members</p>
              </div>
            </div>
          </div>

          <div className="account-modal__divider">
            <img alt="" className="account-modal__divider-img" src={imgLine1} />
          </div>

          <div className="account-modal__accounts-section">
            <div className="account-modal__email">
              <p>james@agilitee.com</p>
            </div>
            <div className="account-modal__accounts-list">
              {accounts.map((account) => (
                <div 
                  key={account.name}
                  className="account-modal__account" 
                  onClick={() => handleAccountSelect(account.name)}
                >
                  <div className="account-modal__account-left">
                    <div className="account-modal__account-avatar">
                      <div className="account-modal__account-avatar-text">
                        <p>A</p>
                      </div>
                    </div>
                    <div className="account-modal__account-name">
                      <div className="account-modal__account-name-text">
                        <p>{account.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`account-modal__checkmark ${account.selected ? 'account-modal__checkmark--visible' : ''}`}>
                    <div className="account-modal__checkmark-icon">
                      <img alt="" className="account-modal__checkmark-img" src={img2} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="account-modal__divider">
            <img alt="" className="account-modal__divider-img" src={imgLine1} />
          </div>

          <div 
            className="account-modal__logout" 
            onClick={handleLogOutClick}
          >
            <div className="account-modal__logout-icon">
              <div className="account-modal__logout-icon-wrapper">
                <img alt="" className="account-modal__logout-img" src={img3} />
              </div>
            </div>
            <div className="account-modal__logout-text">
              <p>Log Out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;