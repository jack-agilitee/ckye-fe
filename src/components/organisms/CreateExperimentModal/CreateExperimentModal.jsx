'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import TextField from '@/components/atoms/TextField/TextField';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import Button from '@/components/atoms/Button/Button';
import styles from './CreateExperimentModal.module.scss';

const CreateExperimentModal = ({ 
  isOpen = false,
  onClose,
  onCreate,
  masterFiles = [],
  variants = [],
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    masterFile: '',
    variant: ''
  });
  
  const modalRef = useRef(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        masterFile: masterFiles[0]?.value || '',
        variant: variants[0]?.value || ''
      });
    }
  }, [isOpen, masterFiles, variants]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleNameChange = (event) => {
    setFormData(prev => ({
      ...prev,
      name: event.target.value
    }));
  };

  const handleMasterFileChange = (event) => {
    setFormData(prev => ({
      ...prev,
      masterFile: event.target.value
    }));
  };

  const handleVariantChange = (event) => {
    setFormData(prev => ({
      ...prev,
      variant: event.target.value
    }));
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`${styles['create-experiment-modal']} ${className}`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div 
        className={styles['create-experiment-modal__content']}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles['create-experiment-modal__header']}>
          <h2 
            id="modal-title"
            className={styles['create-experiment-modal__title']}
          >
            New Experiment
          </h2>
          <button
            className={styles['create-experiment-modal__close']}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <Image 
              src="/close.svg"
              alt=""
              width={16}
              height={16}
            />
          </button>
        </div>

        <div className={styles['create-experiment-modal__divider']} />

        <div className={styles['create-experiment-modal__body']}>
          <TextField
            label="Name"
            placeholder="Give your experiment a name..."
            value={formData.name}
            onChange={handleNameChange}
            className={styles['create-experiment-modal__field']}
          />

          <Dropdown
            label="Master File"
            value={formData.masterFile}
            onChange={handleMasterFileChange}
            options={masterFiles}
            placeholder="Select a master file"
            className={styles['create-experiment-modal__field']}
          />

          <Dropdown
            label="Variant to Test"
            value={formData.variant}
            onChange={handleVariantChange}
            options={variants}
            placeholder="Select a variant"
            className={styles['create-experiment-modal__field']}
          />
        </div>

        <div className={styles['create-experiment-modal__footer']}>
          <Button
            variant="secondary"
            onClick={onClose}
            className={styles['create-experiment-modal__button']}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            className={styles['create-experiment-modal__button']}
          >
            Create Experiment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateExperimentModal;