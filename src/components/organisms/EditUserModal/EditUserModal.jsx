'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateUser, deleteUser } from '@/lib/api/users';
import TextField from '@/components/atoms/TextField/TextField';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import Button from '@/components/atoms/Button/Button';
import styles from './EditUserModal.module.scss';

const EditUserModal = ({ 
  user,
  isOpen,
  onClose
}) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setUserType(user.userType)
    }
  }, [user])

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUser({
        id: user.id,
        name,
        email,
        userType
      });
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setLoading(true);
      await deleteUser(user.id);
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const userTypeOptions = [
    { value: 'Member', label: 'Member' },
    { value: 'Admin', label: 'Admin' }
  ];

  return (
    <div className={styles['edit-user-modal']}>
      <div className={styles['edit-user-modal__container']}>
        <div className={styles['edit-user-modal__content']}>
          <div className={styles['edit-user-modal__header']}>
            <h2 className={styles['edit-user-modal__title']}>Edit Profile</h2>
            <button 
              className={styles['edit-user-modal__close']}
              onClick={onClose}
              aria-label="Close modal"
            >
              <Image
                src="/cross.svg"
                alt="Close"
                width={16}
                height={16}
              />
            </button>
          </div>
          
          <div className={styles['edit-user-modal__divider']} />
          
          <div className={styles['edit-user-modal__form']}>
            <div className={styles['edit-user-modal__field']}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
              />
            </div>
            
            <div className={styles['edit-user-modal__field']}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
              />
            </div>
            
            <div className={styles['edit-user-modal__field']}>
              <Dropdown
                label="Account Type"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                options={userTypeOptions}
                placeholder="Select Account Type"
              />
            </div>
          </div>
          
          <div className={styles['edit-user-modal__deactivate-container']}>
            <button
              onClick={handleDeactivate}
              className={styles['edit-user-modal__deactivate']}
              disabled={loading}
            >
              Deactivate User
            </button>
          </div>
          
          <div className={styles['edit-user-modal__actions']}>
            <Button
              variant="primary"
              onClick={onClose}
              className={styles['edit-user-modal__button']}
              icon={null}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleSave}
              className={styles['edit-user-modal__button']}
              icon={null}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;