'use client';

import { useState } from 'react';
import SearchBar from '@/components/atoms/SearchBar/SearchBar';
import Button from '@/components/atoms/Button/Button';
import Chip from '@/components/atoms/Chip/Chip';
import TextField from '@/components/atoms/TextField/TextField';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import User from '@/components/molecules/User/User';
import ListItem from '@/components/molecules/ListItem/ListItem';
import SeatType, { SEAT_TYPES } from '@/components/molecules/SeatType/SeatType';
import WorkspaceSelector from '@/components/molecules/WorkspaceSelector/WorkspaceSelector';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';
import Avatar from '@/components/atoms/Avatar/Avatar';
import SettingsModal from '@/components/organisms/SettingsModal/SettingsModal';
import AddWorkspaceModal from '@/components/organisms/AddWorkspaceModal/AddWorkspaceModal';
import AddUserModal from '@/components/organisms/AddUserModal/AddUserModal';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import UsersTable from '@/components/templates/UsersTable/UsersTable';
import WorkspacesTable from '@/components/templates/WorkspacesTable/WorkspacesTable';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import styles from './page.module.scss';

export default function ShowcasePage() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    console.log('Search submitted:', value);
    alert(`You searched for: ${value}`);
  };

  return (
    <div className={styles.showcase}>
      <header className={styles.showcase__header}>
        <h1 className={styles.showcase__title}>Component Showcase</h1>
        <p className={styles.showcase__description}>
          A collection of all atomic components in the Ckye design system
        </p>
      </header>

      <main className={styles.showcase__content}>
        {/* Atoms Section */}
        <section className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Atoms</h2>
          
          {/* SearchBar Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>SearchBar</h3>
            <p className={styles.showcase__componentDescription}>
              A search input field with icon, focus states, and keyboard support
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default SearchBar</h4>
                <div className={styles.showcase__exampleContent}>
                  <SearchBar 
                    placeholder="Search Users" 
                    onSearch={handleSearch}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Controlled SearchBar</h4>
                <div className={styles.showcase__exampleContent}>
                  <SearchBar 
                    placeholder="Type something..." 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                  />
                  <p className={styles.showcase__hint}>Current value: {searchValue}</p>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Custom Placeholder</h4>
                <div className={styles.showcase__exampleContent}>
                  <SearchBar 
                    placeholder="Search products, categories..." 
                    onSearch={handleSearch}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Disabled State</h4>
                <div className={styles.showcase__exampleContent}>
                  <SearchBar 
                    placeholder="Search is disabled" 
                    disabled={true}
                    onSearch={handleSearch}
                  />
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import SearchBar from '@/components/atoms/SearchBar/SearchBar';

<SearchBar 
  placeholder="Search Users" 
  onSearch={(value) => console.log(value)}
/>`}
              </pre>
            </div>
          </div>

          {/* Button Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>Button</h3>
            <p className={styles.showcase__componentDescription}>
              A versatile button component with icon support and multiple variants
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Primary Button</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <Button onClick={() => alert('Primary button clicked!')}>
                    Settings
                  </Button>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Secondary Button</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <Button 
                    variant="secondary" 
                    onClick={() => alert('Secondary button clicked!')}
                  >
                    Secondary Action
                  </Button>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Custom Icons</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Button icon="/plus.svg" onClick={() => console.log('Add')}>
                    Add Item
                  </Button>
                  <Button icon="/file.svg" onClick={() => console.log('File')}>
                    Files
                  </Button>
                  <Button icon="/invite.svg" onClick={() => console.log('Invite')}>
                    Invite
                  </Button>
                  <Button icon={null} onClick={() => console.log('No icon')}>
                    No Icon
                  </Button>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Button States</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Button onClick={() => console.log('Normal')}>
                    Normal
                  </Button>
                  <Button disabled onClick={() => console.log('This should not fire')}>
                    Disabled
                  </Button>
                  <Button 
                    variant="secondary" 
                    disabled 
                    onClick={() => console.log('This should not fire')}
                  >
                    Disabled Secondary
                  </Button>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Button Types</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }} style={{ display: 'flex', gap: '12px' }}>
                    <Button type="submit" icon="/check.svg">
                      Submit
                    </Button>
                    <Button type="reset" icon="/close.svg" variant="secondary">
                      Reset
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import Button from '@/components/atoms/Button/Button';

// Primary button with default settings icon
<Button onClick={() => console.log('clicked')}>
  Settings
</Button>

// Secondary variant
<Button variant="secondary" onClick={handleClick}>
  Secondary Action
</Button>

// Custom icon
<Button icon="/custom-icon.svg" onClick={handleClick}>
  Custom Action
</Button>

// Disabled state
<Button disabled onClick={handleClick}>
  Disabled Button
</Button>`}
              </pre>
            </div>
          </div>

          {/* Chip Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>Chip</h3>
            <p className={styles.showcase__componentDescription}>
              A dismissible chip/tag component with hover states for displaying selected items or filters
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default Chip</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <Chip 
                    text="James Otey"
                    onDismiss={() => alert('Chip dismissed!')}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Multiple Chips</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  {(() => {
                    const [chips, setChips] = useState(['Active', 'Pending', 'Completed', 'Archived']);
                    return (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {chips.map((chip, index) => (
                          <Chip 
                            key={chip}
                            text={chip}
                            onDismiss={() => {
                              setChips(chips.filter((_, i) => i !== index));
                            }}
                          />
                        ))}
                        {chips.length === 0 && (
                          <span style={{ color: '#9B9B9B' }}>All chips removed!</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Click chips to remove them</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>User Tags</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  {(() => {
                    const [users, setUsers] = useState(['James Otey', 'Sarah Williams', 'Michael Chen', 'Jane Smith']);
                    return (
                      <div>
                        <div style={{ marginBottom: '12px', color: '#9B9B9B' }}>
                          Selected users:
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {users.map((user) => (
                            <Chip 
                              key={user}
                              text={user}
                              onDismiss={() => {
                                setUsers(users.filter(u => u !== user));
                                console.log(`Removed ${user}`);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Long Text Handling</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', maxWidth: '400px' }}>
                  <Chip 
                    text="Christopher Alexander Thompson III"
                    onDismiss={() => console.log('Long name chip dismissed')}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Interactive Demo</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  {(() => {
                    const allTags = ['React', 'Next.js', 'TypeScript', 'SCSS', 'Jest', 'Node.js'];
                    const [selectedTags, setSelectedTags] = useState(['React', 'Next.js']);
                    const [availableTags, setAvailableTags] = useState(allTags.filter(t => !selectedTags.includes(t)));
                    
                    return (
                      <div>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ color: '#9B9B9B', marginRight: '8px' }}>Add tag:</label>
                          <select 
                            onChange={(e) => {
                              if (e.target.value) {
                                setSelectedTags([...selectedTags, e.target.value]);
                                setAvailableTags(availableTags.filter(t => t !== e.target.value));
                                e.target.value = '';
                              }
                            }}
                            style={{ 
                              backgroundColor: '#353535', 
                              color: '#D5D5D5', 
                              border: '1px solid #353535',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            <option value="">Select a tag...</option>
                            {availableTags.map(tag => (
                              <option key={tag} value={tag}>{tag}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {selectedTags.map((tag) => (
                            <Chip 
                              key={tag}
                              text={tag}
                              onDismiss={() => {
                                setSelectedTags(selectedTags.filter(t => t !== tag));
                                setAvailableTags([...availableTags, tag].sort());
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Add and remove tags interactively</p>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import Chip from '@/components/atoms/Chip/Chip';

// Basic usage
<Chip 
  text="James Otey" 
  onDismiss={() => console.log('Dismissed')}
/>

// Multiple chips with removal
const [chips, setChips] = useState(['Active', 'Pending', 'Completed']);

{chips.map((chip, index) => (
  <Chip 
    key={chip}
    text={chip}
    onDismiss={() => {
      setChips(chips.filter((_, i) => i !== index));
    }}
  />
))}`}
              </pre>
            </div>
          </div>

          {/* TextField Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>TextField</h3>
            <p className={styles.showcase__componentDescription}>
              A labeled text input field with error states and full accessibility support
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default TextField</h4>
                <div className={styles.showcase__exampleContent}>
                  <TextField 
                    label="Name"
                    placeholder="Enter your name"
                    name="showcase-1"
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Controlled TextField</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const [textValue, setTextValue] = useState('');
                    return (
                      <>
                        <TextField 
                          label="Username"
                          placeholder="Choose a username"
                          value={textValue}
                          onChange={(e) => setTextValue(e.target.value)}
                          name="showcase-2"
                        />
                        <p className={styles.showcase__hint}>Current value: {textValue || '(empty)'}</p>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Required Field</h4>
                <div className={styles.showcase__exampleContent}>
                  <TextField 
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    name="showcase-3"
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Error State</h4>
                <div className={styles.showcase__exampleContent}>
                  <TextField 
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    error
                    errorMessage="Password must be at least 8 characters"
                    name="showcase-4"
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Disabled State</h4>
                <div className={styles.showcase__exampleContent}>
                  <TextField 
                    label="Disabled Field"
                    placeholder="Cannot edit this"
                    value="Read-only value"
                    disabled
                    name="showcase-5"
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Form Validation Example</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const [email, setEmail] = useState('');
                    const [emailError, setEmailError] = useState('');
                    
                    const validateEmail = (value) => {
                      if (!value) {
                        setEmailError('Email is required');
                      } else if (!/\S+@\S+\.\S+/.test(value)) {
                        setEmailError('Please enter a valid email address');
                      } else {
                        setEmailError('');
                      }
                    };
                    
                    return (
                      <form onSubmit={(e) => { 
                        e.preventDefault(); 
                        validateEmail(email);
                        if (!emailError && email) {
                          alert(`Form submitted with email: ${email}`);
                        }
                      }}>
                        <TextField 
                          label="Email Address"
                          type="email"
                          placeholder="user@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) validateEmail(e.target.value);
                          }}
                          onBlur={() => validateEmail(email)}
                          error={!!emailError}
                          errorMessage={emailError}
                          required
                          name="showcase-6"
                        />
                        <div style={{ marginTop: '16px' }}>
                          <Button type="submit" icon="/check.svg">
                            Submit
                          </Button>
                        </div>
                      </form>
                    );
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Different Input Types</h4>
                <div className={styles.showcase__exampleContent}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <TextField 
                      label="Text"
                      type="text"
                      placeholder="Regular text input"
                      name="showcase-7"
                    />
                    <TextField 
                      label="Number"
                      type="number"
                      placeholder="123"
                      name="showcase-8"
                    />
                    <TextField 
                      label="Date"
                      type="date"
                      name="showcase-9"
                    />
                    <TextField 
                      label="Time"
                      type="time"
                      name="showcase-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import TextField from '@/components/atoms/TextField/TextField';

// Basic usage
<TextField 
  label="Name"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// With validation
<TextField 
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  onBlur={validateEmail}
  error={!!emailError}
  errorMessage={emailError}
  required
/>

// Uncontrolled with ref
const inputRef = useRef();
<TextField 
  ref={inputRef}
  label="Username"
  name="username"
/>`}
              </pre>
            </div>
          </div>

          {/* Dropdown Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>Dropdown</h3>
            <p className={styles.showcase__componentDescription}>
              A custom select dropdown with label support, keyboard navigation, and error states
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default Dropdown</h4>
                <div className={styles.showcase__exampleContent}>
                  <Dropdown 
                    label="Workspace"
                    placeholder="Search Users"
                    options={[
                      { value: 'user1', label: 'John Doe' },
                      { value: 'user2', label: 'Jane Smith' },
                      { value: 'user3', label: 'Bob Johnson' },
                      { value: 'user4', label: 'Alice Williams' }
                    ]}
                    name="showcase-1"
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Controlled Dropdown</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const [selectedUser, setSelectedUser] = useState('');
                    return (
                      <>
                        <Dropdown 
                          label="Assign To"
                          placeholder="Select a user"
                          name="showcase-2"
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          options={[
                            { value: 'user1', label: 'John Doe' },
                            { value: 'user2', label: 'Jane Smith' },
                            { value: 'user3', label: 'Bob Johnson' }
                          ]}
                        />
                        <p className={styles.showcase__hint}>Selected: {selectedUser || '(none)'}</p>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Required Dropdown</h4>
                <div className={styles.showcase__exampleContent}>
                  <Dropdown 
                    label="Priority"
                    placeholder="Select priority"
                    name="showcase-3"
                    required
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                      { value: 'urgent', label: 'Urgent' }
                    ]}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Error State</h4>
                <div className={styles.showcase__exampleContent}>
                  <Dropdown 
                    label="Category"
                    placeholder="Choose a category"
                    error
                    name="showcase-4"
                    errorMessage="Please select a valid category"
                    options={[
                      { value: 'bug', label: 'Bug' },
                      { value: 'feature', label: 'Feature' },
                      { value: 'improvement', label: 'Improvement' },
                      { value: 'documentation', label: 'Documentation' }
                    ]}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Disabled State</h4>
                <div className={styles.showcase__exampleContent}>
                  <Dropdown 
                    label="Disabled Dropdown"
                    placeholder="Cannot select"
                    name="showcase-5"
                    disabled
                    options={[
                      { value: '1', label: 'Option 1' },
                      { value: '2', label: 'Option 2' }
                    ]}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>With Pre-selected Value</h4>
                <div className={styles.showcase__exampleContent}>
                  <Dropdown 
                    label="Status"
                    value="active"
                    name="showcase-6"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'archived', label: 'Archived' }
                    ]}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Long Options List</h4>
                <div className={styles.showcase__exampleContent}>
                  <Dropdown 
                    label="Country"
                    placeholder="Select your country"
                    name="showcase-7"
                    options={[
                      { value: 'us', label: 'United States' },
                      { value: 'uk', label: 'United Kingdom' },
                      { value: 'ca', label: 'Canada' },
                      { value: 'au', label: 'Australia' },
                      { value: 'de', label: 'Germany' },
                      { value: 'fr', label: 'France' },
                      { value: 'es', label: 'Spain' },
                      { value: 'it', label: 'Italy' },
                      { value: 'jp', label: 'Japan' },
                      { value: 'cn', label: 'China' },
                      { value: 'in', label: 'India' },
                      { value: 'br', label: 'Brazil' }
                    ]}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Form Integration Example</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const [formData, setFormData] = useState({
                      category: '',
                      priority: ''
                    });
                    const [errors, setErrors] = useState({});
                    
                    const handleSubmit = (e) => {
                      e.preventDefault();
                      const newErrors = {};
                      
                      if (!formData.category) {
                        newErrors.category = 'Category is required';
                      }
                      if (!formData.priority) {
                        newErrors.priority = 'Priority is required';
                      }
                      
                      setErrors(newErrors);
                      
                      if (Object.keys(newErrors).length === 0) {
                        alert(`Form submitted!\nCategory: ${formData.category}\nPriority: ${formData.priority}`);
                      }
                    };
                    
                    return (
                      <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                          <Dropdown 
                            label="Category"
                            placeholder="Select a category"
                            value={formData.category}
                            onChange={(e) => {
                              setFormData({ ...formData, category: e.target.value });
                              if (errors.category) {
                                setErrors({ ...errors, category: '' });
                              }
                            }}
                            options={[
                              { value: 'bug', label: 'Bug' },
                              { value: 'feature', label: 'Feature' },
                              { value: 'improvement', label: 'Improvement' }
                            ]}
                            error={!!errors.category}
                            errorMessage={errors.category}
                            required
                            name="showcase-8"
                          />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <Dropdown 
                            label="Priority"
                            placeholder="Select priority"
                            value={formData.priority}
                            onChange={(e) => {
                              setFormData({ ...formData, priority: e.target.value });
                              if (errors.priority) {
                                setErrors({ ...errors, priority: '' });
                              }
                            }}
                            options={[
                              { value: 'low', label: 'Low' },
                              { value: 'medium', label: 'Medium' },
                              { value: 'high', label: 'High' }
                            ]}
                            error={!!errors.priority}
                            errorMessage={errors.priority}
                            required
                            name="showcase-9"
                          />
                        </div>
                        <Button type="submit" icon="/check.svg">
                          Submit Issue
                        </Button>
                      </form>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import Dropdown from '@/components/atoms/Dropdown/Dropdown';

// Basic usage
const options = [
  { value: 'user1', label: 'John Doe' },
  { value: 'user2', label: 'Jane Smith' },
  { value: 'user3', label: 'Bob Johnson' }
];

<Dropdown 
  label="Workspace"
  placeholder="Search Users"
  options={options}
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.target.value)}
/>

// With validation
<Dropdown 
  label="Category"
  options={categoryOptions}
  value={category}
  onChange={handleChange}
  error={!!error}
  errorMessage={error}
  required
/>

// Uncontrolled
<Dropdown 
  name="priority"
  label="Priority"
  options={priorityOptions}
/>`}
              </pre>
            </div>
          </div>

          {/* Avatar Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>Avatar</h3>
            <p className={styles.showcase__componentDescription}>
              A versatile avatar component displaying user initials with multiple sizes and color variants
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Size Variants</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Avatar initial="S" size="small" />
                  <Avatar initial="M" size="medium" />
                  <Avatar initial="L" size="large" />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Color Variants</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Avatar initial="D" variant="default" />
                  <Avatar initial="P" variant="primary" />
                  <Avatar initial="S" variant="selected" />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Different Initials</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Avatar initial="A" />
                  <Avatar initial="B" />
                  <Avatar initial="JD" />
                  <Avatar initial="MK" />
                  <Avatar initial="X" />
                  <Avatar initial="Z" />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>User List Example</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Alice Anderson', initial: 'A' },
                      { name: 'Bob Brown', initial: 'B' },
                      { name: 'Charlie Chen', initial: 'C' },
                      { name: 'Diana Davis', initial: 'D' }
                    ].map((user) => (
                      <div key={user.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar initial={user.initial} size="small" />
                        <span style={{ color: '#D5D5D5' }}>{user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Team Grid</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {['Engineering', 'Design', 'Marketing', 'Sales'].map((team, index) => (
                      <div key={team} style={{ textAlign: 'center' }}>
                        <Avatar 
                          initial={team.charAt(0)} 
                          size="large" 
                          variant={index === 0 ? 'primary' : 'default'}
                        />
                        <p style={{ marginTop: '8px', fontSize: '12px', color: '#9B9B9B' }}>{team}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Combined with Other Components</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar initial="JO" size="medium" />
                        <div>
                          <div style={{ color: '#D5D5D5', fontWeight: 'bold' }}>James Otey</div>
                          <div style={{ color: '#9B9B9B', fontSize: '12px' }}>Admin</div>
                        </div>
                      </div>
                      <SeatType type={SEAT_TYPES.ADMIN} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar initial="SW" size="medium" variant="primary" />
                        <div>
                          <div style={{ color: '#D5D5D5', fontWeight: 'bold' }}>Sarah Williams</div>
                          <div style={{ color: '#9B9B9B', fontSize: '12px' }}>Editor</div>
                        </div>
                      </div>
                      <SeatType type={SEAT_TYPES.EDITOR} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import Avatar from '@/components/atoms/Avatar/Avatar';

// Basic usage
<Avatar initial="A" />

// Size variants
<Avatar initial="S" size="small" />
<Avatar initial="M" size="medium" />
<Avatar initial="L" size="large" />

// Color variants
<Avatar initial="J" variant="default" />
<Avatar initial="J" variant="primary" />
<Avatar initial="J" variant="selected" />

// Combined props
<Avatar 
  initial="JD" 
  size="large" 
  variant="primary" 
  className="custom-avatar"
/>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Molecules Section */}
        <section className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Molecules</h2>
          
          {/* User Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>User</h3>
            <p className={styles.showcase__componentDescription}>
              A user list item displaying avatar with initial, name, and email
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default User</h4>
                <div className={styles.showcase__exampleContent}>
                  <User 
                    name="Andrew Venn" 
                    email="andrew@agilitee.com"
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>User with Custom Initial</h4>
                <div className={styles.showcase__exampleContent}>
                  <User 
                    name="Jane Smith" 
                    email="jane.smith@example.com"
                    initial="JS"
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>User List</h4>
                <div className={styles.showcase__exampleContent}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <User name="John Doe" email="john.doe@company.com" />
                    <User name="Sarah Williams" email="sarah.w@company.com" />
                    <User name="Michael Chen" email="m.chen@company.com" />
                  </div>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Long Name/Email Handling</h4>
                <div className={styles.showcase__exampleContent} style={{ maxWidth: '300px' }}>
                  <User 
                    name="Christopher Alexander Thompson" 
                    email="christopher.alexander.thompson@verylongdomainname.com"
                  />
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import User from '@/components/molecules/User/User';

<User 
  name="Andrew Venn" 
  email="andrew@agilitee.com"
/>

// With custom initial
<User 
  name="Jane Smith" 
  email="jane@example.com"
  initial="JS"
/>`}
              </pre>
            </div>
          </div>

          {/* ListItem Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>ListItem</h3>
            <p className={styles.showcase__componentDescription}>
              A clickable list item with icon, text, hover and selected states
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default ListItem</h4>
                <div className={styles.showcase__exampleContent}>
                  <ListItem 
                    text="Claude.md"
                    onClick={() => console.log('Clicked Claude.md')}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Selected State</h4>
                <div className={styles.showcase__exampleContent}>
                  <ListItem 
                    text="README.md"
                    selected={true}
                    onClick={() => console.log('Clicked README.md')}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Custom Icons</h4>
                <div className={styles.showcase__exampleContent}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <ListItem 
                      text="Settings"
                      icon="/settings.svg"
                      onClick={() => console.log('Settings clicked')}
                    />
                    <ListItem 
                      text="Add User"
                      icon="/plus.svg"
                      onClick={() => console.log('Add user clicked')}
                    />
                    <ListItem 
                      text="Tools"
                      icon="/wrench.svg"
                      onClick={() => console.log('Tools clicked')}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Interactive File List</h4>
                <div className={styles.showcase__exampleContent}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                      { name: 'package.json', selected: false },
                      { name: 'tsconfig.json', selected: true },
                      { name: 'README.md', selected: false },
                      { name: '.gitignore', selected: false }
                    ].map((file) => (
                      <ListItem 
                        key={file.name}
                        text={file.name}
                        selected={file.selected}
                        onClick={() => alert(`Opening ${file.name}`)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import ListItem from '@/components/molecules/ListItem/ListItem';

<ListItem 
  text="Claude.md"
  onClick={() => console.log('Clicked')}
/>

// With custom icon and selected state
<ListItem 
  text="Settings"
  icon="/settings.svg"
  selected={true}
  onClick={handleClick}
/>`}
              </pre>
            </div>
          </div>

          {/* SeatType Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>SeatType</h3>
            <p className={styles.showcase__componentDescription}>
              A visual indicator for user seat types with role-specific icons and colors
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>All Seat Types</h4>
                <div className={styles.showcase__exampleContent}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <SeatType type={SEAT_TYPES.MEMBER} />
                    <SeatType type={SEAT_TYPES.EDITOR} />
                    <SeatType type={SEAT_TYPES.ADMIN} />
                  </div>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default (Member)</h4>
                <div className={styles.showcase__exampleContent}>
                  <SeatType />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>With User Information</h4>
                <div className={styles.showcase__exampleContent}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <User name="John Doe" email="john@example.com" />
                      <SeatType type={SEAT_TYPES.MEMBER} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <User name="Jane Smith" email="jane@example.com" />
                      <SeatType type={SEAT_TYPES.EDITOR} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <User name="Admin User" email="admin@example.com" />
                      <SeatType type={SEAT_TYPES.ADMIN} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>In a List Layout</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Marketing Team', type: SEAT_TYPES.MEMBER },
                      { name: 'Content Editors', type: SEAT_TYPES.EDITOR },
                      { name: 'System Admins', type: SEAT_TYPES.ADMIN }
                    ].map((group) => (
                      <div key={group.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#D5D5D5' }}>{group.name}</span>
                        <SeatType type={group.type} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Permission Grid</h4>
                <div className={styles.showcase__exampleContent}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <SeatType type={SEAT_TYPES.MEMBER} />
                      <p style={{ marginTop: '8px', fontSize: '12px', color: '#9B9B9B' }}>View Only</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <SeatType type={SEAT_TYPES.EDITOR} />
                      <p style={{ marginTop: '8px', fontSize: '12px', color: '#9B9B9B' }}>Can Edit</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <SeatType type={SEAT_TYPES.ADMIN} />
                      <p style={{ marginTop: '8px', fontSize: '12px', color: '#9B9B9B' }}>Full Access</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import SeatType, { SEAT_TYPES } from '@/components/molecules/SeatType/SeatType';

// Default (Member)
<SeatType />

// Member variant
<SeatType type={SEAT_TYPES.MEMBER} />

// Editor variant
<SeatType type={SEAT_TYPES.EDITOR} />

// Admin variant
<SeatType type={SEAT_TYPES.ADMIN} />

// Using the enum
const userRole = SEAT_TYPES.EDITOR;
<SeatType type={userRole} />`}
              </pre>
            </div>
          </div>

          {/* WorkspaceSelector Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>WorkspaceSelector</h3>
            <p className={styles.showcase__componentDescription}>
              A multi-select autocomplete component for selecting workspace members with chip display and keyboard navigation
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default WorkspaceSelector</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const [selectedUsers, setSelectedUsers] = useState([]);
                    const users = [
                      { id: '1', name: 'James Otey' },
                      { id: '2', name: 'Jack Nichols' },
                      { id: '3', name: 'Steve Street' },
                      { id: '4', name: 'Sullivan Street' },
                      { id: '5', name: 'Dave Fullam' },
                      { id: '6', name: 'Phil Stephenson' },
                      { id: '7', name: 'Sam Street' },
                      { id: '8', name: 'Andrew Venn' }
                    ];
                    
                    return (
                      <WorkspaceSelector
                        label="Workspace"
                        placeholder="Select workspace members..."
                        options={users}
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                      />
                    );
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Pre-selected Values</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const [selectedUsers, setSelectedUsers] = useState([
                      { id: '1', name: 'James Otey' },
                      { id: '2', name: 'Jack Nichols' }
                    ]);
                    const users = [
                      { id: '1', name: 'James Otey' },
                      { id: '2', name: 'Jack Nichols' },
                      { id: '3', name: 'Steve Street' },
                      { id: '4', name: 'Sullivan Street' },
                      { id: '5', name: 'Dave Fullam' }
                    ];
                    
                    return (
                      <WorkspaceSelector
                        label="Team Members"
                        options={users}
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                      />
                    );
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Custom Labels</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const [selectedProjects, setSelectedProjects] = useState([]);
                    const projects = [
                      { id: 'p1', name: 'Project Alpha' },
                      { id: 'p2', name: 'Project Beta' },
                      { id: 'p3', name: 'Project Gamma' },
                      { id: 'p4', name: 'Project Delta' }
                    ];
                    
                    return (
                      <WorkspaceSelector
                        label="Assigned Projects"
                        placeholder="Select projects..."
                        options={projects}
                        value={selectedProjects}
                        onChange={setSelectedProjects}
                      />
                    );
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>With Maximum Selection</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const [selectedUsers, setSelectedUsers] = useState([]);
                    const users = [
                      { id: '1', name: 'James Otey' },
                      { id: '2', name: 'Jack Nichols' },
                      { id: '3', name: 'Steve Street' },
                      { id: '4', name: 'Sullivan Street' },
                      { id: '5', name: 'Dave Fullam' }
                    ];
                    
                    const handleChange = (newValue) => {
                      if (newValue.length <= 3) {
                        setSelectedUsers(newValue);
                      } else {
                        alert('Maximum 3 users can be selected');
                      }
                    };
                    
                    return (
                      <>
                        <WorkspaceSelector
                          label="Select up to 3 users"
                          options={users}
                          value={selectedUsers}
                          onChange={handleChange}
                        />
                        <p className={styles.showcase__hint}>
                          Selected: {selectedUsers.length}/3 users
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Empty State</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const [selectedUsers, setSelectedUsers] = useState([]);
                    
                    return (
                      <WorkspaceSelector
                        label="No Options Available"
                        placeholder="No users to select..."
                        options={[]}
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                      />
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Shows behavior when no options are available</p>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import WorkspaceSelector from '@/components/molecules/WorkspaceSelector/WorkspaceSelector';

const [selectedUsers, setSelectedUsers] = useState([]);

const users = [
  { id: '1', name: 'James Otey' },
  { id: '2', name: 'Jack Nichols' },
  { id: '3', name: 'Steve Street' }
];

<WorkspaceSelector
  label="Workspace"
  placeholder="Select workspace members..."
  options={users}
  value={selectedUsers}
  onChange={setSelectedUsers}
/>

// With pre-selected values
const [selected, setSelected] = useState([
  { id: '1', name: 'James Otey' }
]);

<WorkspaceSelector
  options={users}
  value={selected}
  onChange={setSelected}
/>`}
              </pre>
            </div>
          </div>

          {/* SearchHeader Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>SearchHeader</h3>
            <p className={styles.showcase__componentDescription}>
              A page header component with title, search functionality, and action button
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default Usage</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '4px' }}>
                  {(() => {
                    const [searchValue, setSearchValue] = useState('');
                    
                    return (
                      <SearchHeader 
                        searchValue={searchValue}
                        onSearchChange={(e) => setSearchValue(e.target.value)}
                        onSearch={(value) => {
                          console.log('Searching for:', value);
                          alert(`Searching for: ${value}`);
                        }}
                        onButtonClick={() => {
                          console.log('Add Users clicked');
                          alert('Add Users clicked!');
                        }}
                      />
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Try searching and clicking the button</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Custom Text</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '4px' }}>
                  <SearchHeader 
                    title="Products"
                    searchPlaceholder="Find products..."
                    buttonText="New Product"
                    onSearch={(value) => console.log('Product search:', value)}
                    onButtonClick={() => console.log('New product')}
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Different Page Types</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '4px' }}>
                  <div style={{ marginBottom: '32px' }}>
                    <SearchHeader 
                      title="Projects"
                      searchPlaceholder="Search projects..."
                      buttonText="Create Project"
                      onSearch={(value) => console.log('Project search:', value)}
                      onButtonClick={() => console.log('Create project')}
                    />
                  </div>
                  <div>
                    <SearchHeader 
                      title="Documents"
                      searchPlaceholder="Find documents..."
                      buttonText="Upload"
                      onSearch={(value) => console.log('Document search:', value)}
                      onButtonClick={() => console.log('Upload document')}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>With Controlled Search</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '4px' }}>
                  {(() => {
                    const [searchTerm, setSearchTerm] = useState('');
                    const [lastSearch, setLastSearch] = useState('');
                    
                    return (
                      <>
                        <SearchHeader 
                          title="Team Members"
                          searchPlaceholder="Search team..."
                          buttonText="Invite"
                          searchValue={searchTerm}
                          onSearchChange={(e) => setSearchTerm(e.target.value)}
                          onSearch={(value) => {
                            setLastSearch(value);
                            console.log('Team search:', value);
                          }}
                          onButtonClick={() => console.log('Invite member')}
                        />
                        {lastSearch && (
                          <p style={{ marginTop: '16px', color: '#9B9B9B' }}>
                            Last search: "{lastSearch}"
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';

// Basic usage
<SearchHeader 
  onSearch={(value) => console.log('Search:', value)}
  onButtonClick={() => console.log('Button clicked')}
/>

// Custom text
<SearchHeader 
  title="Products"
  searchPlaceholder="Find products..."
  buttonText="New Product"
  onSearch={handleSearch}
  onButtonClick={handleAddProduct}
/>

// Controlled search
const [searchValue, setSearchValue] = useState('');

<SearchHeader 
  searchValue={searchValue}
  onSearchChange={(e) => setSearchValue(e.target.value)}
  onSearch={handleSearch}
  onButtonClick={handleAddUsers}
/>

// All props
<SearchHeader 
  title="Users"
  searchPlaceholder="Search Users"
  searchValue={searchValue}
  onSearchChange={handleSearchChange}
  onSearch={handleSearch}
  buttonText="Add Users"
  onButtonClick={handleButtonClick}
  className="custom-header"
/>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Organisms Section */}
        <section className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Organisms</h2>
          
          {/* AccountChanger Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>AccountChanger</h3>
            <p className={styles.showcase__componentDescription}>
              An account switcher component with avatar, name, and quick actions. Supports both default and admin variants.
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default AccountChanger</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <AccountChanger />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Custom Account</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <AccountChanger 
                    accountName="MyCompany" 
                    accountInitial="M"
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>With Event Handlers</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <AccountChanger 
                    accountName="Acme Corp"
                    accountInitial="A"
                    onAccountClick={() => alert('Account dropdown clicked!')}
                    onNotesClick={() => alert('Notes button clicked!')}
                  />
                  <p className={styles.showcase__hint}>Try clicking the account name or notes icon</p>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Multiple Accounts</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <AccountChanger accountName="Personal" accountInitial="P" />
                    <AccountChanger accountName="Work Team" accountInitial="W" />
                    <AccountChanger accountName="Client Project" accountInitial="C" />
                  </div>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Admin Variant</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  <AccountChanger 
                    isAdmin={true}
                    onAdminBack={() => alert('Exiting admin mode!')}
                  />
                  <p className={styles.showcase__hint}>Click the chevron to exit admin mode</p>
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Interactive Variant Switching</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px' }}>
                  {(() => {
                    const [isAdmin, setIsAdmin] = useState(false);
                    return (
                      <>
                        <AccountChanger 
                          accountName="Demo Account"
                          accountInitial="D"
                          isAdmin={isAdmin}
                          onAccountClick={() => {
                            alert('Switching to admin mode!');
                            setIsAdmin(true);
                          }}
                          onAdminBack={() => {
                            alert('Back to normal mode!');
                            setIsAdmin(false);
                          }}
                          onNotesClick={() => alert('Notes clicked!')}
                        />
                        <p className={styles.showcase__hint}>
                          Current mode: {isAdmin ? 'Admin' : 'Default'} - Click account to switch
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';

// Default variant
<AccountChanger />

// With custom props
<AccountChanger 
  accountName="MyCompany" 
  accountInitial="M"
  onAccountClick={() => console.log('Account clicked')}
  onNotesClick={() => console.log('Notes clicked')}
/>

// Admin variant
<AccountChanger 
  isAdmin={true}
  onAdminBack={() => console.log('Exiting admin mode')}
/>`}
              </pre>
            </div>
          </div>

          {/* SettingsModal Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>SettingsModal</h3>
            <p className={styles.showcase__componentDescription}>
              A modal component for workspace selection, user account management, and quick access to settings
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default SettingsModal</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {(() => {
                    const [showModal, setShowModal] = useState(false);
                    
                    return (
                      <>
                        <Button 
                          onClick={() => setShowModal(true)}
                          icon="/settings.svg"
                        >
                          Open Settings Modal
                        </Button>
                        {showModal && (
                          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                            <SettingsModal onDismiss={() => setShowModal(false)} />
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Click button to open modal. Click outside or press ESC to close.</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>With Different Workspaces</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {(() => {
                    const [showModal, setShowModal] = useState(false);
                    
                    return (
                      <>
                        <Button 
                          onClick={() => setShowModal(true)}
                          icon="/settings.svg"
                          variant="secondary"
                        >
                          Open with Multiple Workspaces
                        </Button>
                        {showModal && (
                          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                            <SettingsModal onDismiss={() => setShowModal(false)} />
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Static Preview</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <SettingsModal onDismiss={() => console.log('Dismiss')} />
                  </div>
                </div>
                <p className={styles.showcase__hint}>Static preview - interactions log to console</p>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import SettingsModal from '@/components/organisms/SettingsModal/SettingsModal';

// SettingsModal now gets workspaces from UserContext automatically
// No need to pass workspaces or currentWorkspaceId props

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Open Settings
      </Button>
      
      {showModal && (
        <SettingsModal onDismiss={() => setShowModal(false)} />
      )}
    </>
  );
}

// Workspace object structure (from UserContext)
{
  id: string,          // Unique identifier
  name: string,        // Display name
  shortName: string,   // URL-friendly name for navigation
  userCount: number    // Number of users in workspace
}`}
              </pre>
            </div>
          </div>

          {/* AddWorkspaceModal Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>AddWorkspaceModal</h3>
            <p className={styles.showcase__componentDescription}>
              A modal component for creating new workspaces with user selection
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default AddWorkspaceModal</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {(() => {
                    const [showModal, setShowModal] = useState(false);
                    const users = [
                      { id: '1', name: 'James Otey' },
                      { id: '2', name: 'Jack Nichols' },
                      { id: '3', name: 'Steve Street' },
                      { id: '4', name: 'Sullivan Street' },
                      { id: '5', name: 'Dave Fullam' }
                    ];
                    
                    return (
                      <>
                        <Button 
                          onClick={() => setShowModal(true)}
                          icon="/people-add.svg"
                        >
                          Add Workspace
                        </Button>
                        {showModal && (
                          <AddWorkspaceModal
                            closeModal={() => setShowModal(false)}
                            users={users}
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Click button to open modal. Fill in form and click Create Workspace to see console output.</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>With Pre-selected Users</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {(() => {
                    const [showModal, setShowModal] = useState(false);
                    const users = [
                      { id: '1', name: 'Andrew Venn' },
                      { id: '2', name: 'Eli Eijadi' },
                      { id: '3', name: 'Erin Ramos' },
                      { id: '4', name: 'Fadi' },
                      { id: '5', name: 'Holland Bohr' },
                      { id: '6', name: 'Jack Nichols' },
                      { id: '7', name: 'James Otey' },
                      { id: '8', name: 'JD McCulley' },
                      { id: '9', name: 'John Elliot' },
                      { id: '10', name: 'Katelyn Thompson' }
                    ];
                    
                    return (
                      <>
                        <Button 
                          onClick={() => setShowModal(true)}
                          variant="primary"
                          icon="/people-add.svg"
                        >
                          Create New Workspace
                        </Button>
                        {showModal && (
                          <AddWorkspaceModal
                            closeModal={() => {
                              setShowModal(false);
                              console.log('Modal closed');
                            }}
                            users={users}
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Try searching and selecting multiple users from the dropdown</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Empty Users List</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {(() => {
                    const [showModal, setShowModal] = useState(false);
                    
                    return (
                      <>
                        <Button 
                          onClick={() => setShowModal(true)}
                          variant="secondary"
                          icon={null}
                        >
                          Add Workspace (No Users)
                        </Button>
                        {showModal && (
                          <AddWorkspaceModal
                            closeModal={() => setShowModal(false)}
                            users={[]}
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Modal works even without available users</p>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import AddWorkspaceModal from '@/components/organisms/AddWorkspaceModal/AddWorkspaceModal';

const [showModal, setShowModal] = useState(false);

const users = [
  { id: '1', name: 'James Otey' },
  { id: '2', name: 'Jack Nichols' },
  { id: '3', name: 'Steve Street' }
];

<Button onClick={() => setShowModal(true)}>
  Add Workspace
</Button>

{showModal && (
  <AddWorkspaceModal
    closeModal={() => setShowModal(false)}
    users={users}
  />
)}

// The component logs to console when Create Workspace is clicked:
// {
//   name: "Workspace Name",
//   shortName: "WN",
//   selectedUsers: [{ id: '1', name: 'James Otey' }, ...]
// }`}
              </pre>
            </div>
          </div>

          {/* AddUserModal Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>AddUserModal</h3>
            <p className={styles.showcase__componentDescription}>
              A modal component for adding new users with name, email, and workspace selection
            </p>
            
            <div className={styles.showcase__demo}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default AddUserModal</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {(() => {
                    const [showModal, setShowModal] = useState(false);
                    const workspaces = [
                      { id: '1', name: 'Development Team' },
                      { id: '2', name: 'Design Team' },
                      { id: '3', name: 'Marketing Team' },
                      { id: '4', name: 'Product Team' },
                      { id: '5', name: 'Sales Team' }
                    ];
                    
                    return (
                      <>
                        <Button 
                          onClick={() => setShowModal(true)}
                          icon="/user-add.svg"
                        >
                          Add User
                        </Button>
                        {showModal && (
                          <AddUserModal
                            closeModal={() => setShowModal(false)}
                            workspaces={workspaces}
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Click button to open modal. Fill in form and click Invite Members to see console output.</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>With Many Workspaces</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {(() => {
                    const [showModal, setShowModal] = useState(false);
                    const workspaces = [
                      { id: 'aeo', name: 'American Eagle Outfitters' },
                      { id: 'dg', name: 'Dollar General' },
                      { id: 'agilitee', name: 'Agilitee' },
                      { id: 'c4', name: 'Control4' },
                      { id: 'subway', name: 'Subway' },
                      { id: 'nike', name: 'Nike' },
                      { id: 'apple', name: 'Apple Store' },
                      { id: 'target', name: 'Target' },
                      { id: 'walmart', name: 'Walmart' },
                      { id: 'bestbuy', name: 'Best Buy' }
                    ];
                    
                    return (
                      <>
                        <Button 
                          onClick={() => setShowModal(true)}
                          variant="primary"
                          icon="/user-add.svg"
                        >
                          Invite New User
                        </Button>
                        {showModal && (
                          <AddUserModal
                            closeModal={() => {
                              setShowModal(false);
                              console.log('Modal closed');
                            }}
                            workspaces={workspaces}
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Dropdown shows all available workspaces for selection</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>No Workspaces Available</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '4px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {(() => {
                    const [showModal, setShowModal] = useState(false);
                    
                    return (
                      <>
                        <Button 
                          onClick={() => setShowModal(true)}
                          variant="secondary"
                        >
                          Add User (No Workspaces)
                        </Button>
                        {showModal && (
                          <AddUserModal
                            closeModal={() => setShowModal(false)}
                            workspaces={[]}
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Modal works even without available workspaces</p>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import AddUserModal from '@/components/organisms/AddUserModal/AddUserModal';

const [showModal, setShowModal] = useState(false);

const workspaces = [
  { id: '1', name: 'Development Team' },
  { id: '2', name: 'Design Team' },
  { id: '3', name: 'Marketing Team' }
];

<Button onClick={() => setShowModal(true)}>
  Add User
</Button>

{showModal && (
  <AddUserModal
    closeModal={() => setShowModal(false)}
    workspaces={workspaces}
  />
)}

// The component logs to console when Invite Members is clicked:
// calling create user
// Name: [entered name]
// Email: [entered email]
// Selected Workspace: [selected workspace id]`}
              </pre>
            </div>
          </div>

        </section>

        {/* Templates Section */}
        <section className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Templates</h2>
          
          {/* Sidebar Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>Sidebar</h3>
            <p className={styles.showcase__componentDescription}>
              A left navigation sidebar template with account header, dynamic context items, and workspace navigation
            </p>
            
            <div className={`${styles.showcase__demo} ${styles['showcase__demo--templates']}`}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default Sidebar</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', height: '100vh', borderRadius: '4px', overflow: 'hidden' }}>
                  {(() => {
                    const contextItems = [
                      { id: '1', name: 'Claude.md' },
                      { id: '2', name: 'Commands.md' },
                      { id: '3', name: 'Integrations/MCP' }
                    ];
                    
                    return (
                      <Sidebar
                        contextItems={contextItems}
                        selectedItemId="1"
                        accountName="AEO"
                        accountInitial="A"
                        onContextItemClick={(item) => console.log('Context item clicked:', item.name)}
                        onAddNewClick={() => console.log('Add new clicked')}
                        onAccountClick={() => console.log('Account clicked')}
                        onNotesClick={() => console.log('Notes clicked')}
                      />
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Click items to see console output. Claude.md is selected by default.</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Admin User Sidebar</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', height: '100vh', borderRadius: '4px', overflow: 'hidden' }}>
                  {(() => {
                    const contextItems = [
                      { id: '1', name: 'README.md' },
                      { id: '2', name: 'Package.json' },
                      { id: '3', name: 'Config.yaml' },
                      { id: '4', name: 'Admin Notes.md' }
                    ];
                    
                    return (
                      <Sidebar
                        contextItems={contextItems}
                        selectedItemId="4"
                        accountName="Agilitee"
                        accountInitial="A"
                        onContextItemClick={(item) => console.log('Admin context item:', item.name)}
                        onAddNewClick={() => console.log('Admin add new')}
                        onAccountClick={() => console.log('Admin account clicked')}
                        onNotesClick={() => console.log('Admin notes clicked')}
                      />
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Shows admin section at bottom. Click "Ckye Admin" to navigate to admin workspace.</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Empty Context Items</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', height: '100vh', borderRadius: '4px', overflow: 'hidden' }}>
                  {(() => {
                    return (
                      <Sidebar
                        contextItems={[]}
                        selectedItemId={null}
                        accountName="Demo"
                        accountInitial="D"
                        onContextItemClick={(item) => console.log('Empty context item:', item.name)}
                        onAddNewClick={() => console.log('Add first item')}
                      />
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Sidebar with no context items - only "Add New" is available.</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Admin Mode</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', height: '100vh', borderRadius: '4px', overflow: 'hidden' }}>
                  {(() => {
                    return (
                      <Sidebar
                        isAdminMode={true}
                        accountName="Admin User"
                        accountInitial="A"
                        onAccountClick={() => console.log('Admin account clicked')}
                        onNotesClick={() => console.log('Admin notes clicked')}
                        onAdminBack={() => console.log('Admin back clicked - redirecting home')}
                      />
                    );
                  })()}
                </div>
                <p className={styles.showcase__hint}>Admin mode shows AccountChanger with admin header and simplified navigation to Workspaces and Users.</p>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import Sidebar from '@/components/templates/Sidebar/Sidebar';

const contextItems = [
  { id: '1', name: 'Claude.md' },
  { id: '2', name: 'Commands.md' },
  { id: '3', name: 'Integrations/MCP' }
];

const [selectedItem, setSelectedItem] = useState('1');

<div style={{ display: 'flex', height: '100vh' }}>
  <Sidebar
    contextItems={contextItems}
    selectedItemId={selectedItem}
    isAdmin={false}
    accountName="AEO"
    accountInitial="A"
    onContextItemClick={(item) => {
      setSelectedItem(item.id);
      console.log('Navigate to:', item.name);
    }}
    onAddNewClick={() => console.log('Open create modal')}
    onAccountClick={() => console.log('Open account modal')}
    onNotesClick={() => console.log('Create new note')}
  />
  <main style={{ flex: 1 }}>
    {/* Main content */}
  </main>
</div>

// Admin Mode - Shows admin navigation only
<Sidebar 
  isAdminMode={true}
  accountName="Admin User"
  accountInitial="A"
  onAccountClick={() => console.log('Admin account')}
  onNotesClick={() => console.log('Admin notes')}
/>`}
              </pre>
            </div>
          </div>
          
          {/* UsersTable Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>UsersTable</h3>
            <p className={styles.showcase__componentDescription}>
              A table template displaying user information with name, email, user type, and workspaces
            </p>
            
            <div className={`${styles.showcase__demo} ${styles['showcase__demo--templates']}`}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default UsersTable</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  {(() => {
                    const users = [
                      {
                        name: 'Andrew Venn',
                        email: 'andrew@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle']
                      },
                      {
                        name: 'Eli Eijadi',
                        email: 'eli@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle', 'Agilitee']
                      },
                      {
                        name: 'Erin Ramos',
                        email: 'erin@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle']
                      },
                      {
                        name: 'Jack Nichols',
                        email: 'jack@agilitee.com',
                        userType: SEAT_TYPES.ADMIN,
                        workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee']
                      },
                      {
                        name: 'James Otey',
                        email: 'james@agilitee.com',
                        userType: SEAT_TYPES.ADMIN,
                        workspaces: ['Americal Eagle']
                      }
                    ];
                    
                    return <UsersTable users={users} />;
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Mixed User Types</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const users = [
                      {
                        name: 'Admin User',
                        email: 'admin@company.com',
                        userType: SEAT_TYPES.ADMIN,
                        workspaces: ['All Workspaces']
                      },
                      {
                        name: 'Editor User',
                        email: 'editor@company.com',
                        userType: SEAT_TYPES.EDITOR,
                        workspaces: ['Content Team', 'Marketing']
                      },
                      {
                        name: 'Member User',
                        email: 'member@company.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['General']
                      }
                    ];
                    
                    return <UsersTable users={users} />;
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Long Workspace Lists</h4>
                <div className={styles.showcase__exampleContent}>
                  {(() => {
                    const users = [
                      {
                        name: 'Multi-workspace User',
                        email: 'busy@company.com',
                        userType: SEAT_TYPES.ADMIN,
                        workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee', 'Control4', 'Subway', 'Long Branch Mall', 'Target', 'Walmart']
                      },
                      {
                        name: 'Another User',
                        email: 'another@company.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Workspace One', 'Workspace Two', 'Workspace Three', 'Workspace Four', 'Workspace Five']
                      }
                    ];
                    
                    return <UsersTable users={users} />;
                  })()}
                </div>
                <p className={styles.showcase__hint}>Long workspace lists are automatically truncated with ellipsis</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Empty State</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  <UsersTable users={[]} />
                </div>
                <p className={styles.showcase__hint}>Shows table headers with no data rows</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Full Example</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  {(() => {
                    const users = [
                      {
                        name: 'Andrew Venn',
                        email: 'andrew@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle']
                      },
                      {
                        name: 'Eli Eijadi',
                        email: 'eli@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle', 'Agilitee']
                      },
                      {
                        name: 'Erin Ramos',
                        email: 'erin@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle']
                      },
                      {
                        name: 'Fadi',
                        email: 'fadi@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle']
                      },
                      {
                        name: 'Holland Bohr',
                        email: 'holland@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Dollar General']
                      },
                      {
                        name: 'Jack Nichols',
                        email: 'jack@agilitee.com',
                        userType: SEAT_TYPES.ADMIN,
                        workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee', 'Control4', 'Subway', 'Long Branch']
                      },
                      {
                        name: 'James Otey',
                        email: 'james@agilitee.com',
                        userType: SEAT_TYPES.ADMIN,
                        workspaces: ['Americal Eagle']
                      },
                      {
                        name: 'JD McCulley',
                        email: 'jd@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle']
                      },
                      {
                        name: 'John Elliot',
                        email: 'johne@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle']
                      },
                      {
                        name: 'Katelyn Thompson',
                        email: 'katelyn@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle']
                      },
                      {
                        name: 'Phil Stephenson',
                        email: 'phil@agilitee.com',
                        userType: SEAT_TYPES.MEMBER,
                        workspaces: ['Americal Eagle']
                      }
                    ];
                    
                    return <UsersTable users={users} />;
                  })()}
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import UsersTable from '@/components/templates/UsersTable/UsersTable';
import { SEAT_TYPES } from '@/components/molecules/SeatType/SeatType';

const users = [
  {
    name: 'Andrew Venn',
    email: 'andrew@agilitee.com',
    userType: SEAT_TYPES.MEMBER,
    workspaces: ['Americal Eagle']
  },
  {
    name: 'Jack Nichols',
    email: 'jack@agilitee.com',
    userType: SEAT_TYPES.ADMIN,
    workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee']
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    userType: SEAT_TYPES.EDITOR,
    workspaces: ['Marketing', 'Sales']
  }
];

<UsersTable users={users} />

// User object structure
{
  name: string,           // User's full name
  email: string,          // User's email address
  userType: string,       // One of SEAT_TYPES values
  workspaces: string[]    // Array of workspace names
}`}
              </pre>
            </div>
          </div>

          {/* WorkspacesTable Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>WorkspacesTable</h3>
            <p className={styles.showcase__componentDescription}>
              A table template displaying workspace information with name and management actions
            </p>
            
            <div className={`${styles.showcase__demo} ${styles['showcase__demo--templates']}`}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default WorkspacesTable</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  {(() => {
                    const workspaces = [
                      { id: 1, name: 'Americal Eagle' },
                      { id: 2, name: 'Dollar General' },
                      { id: 3, name: 'Agilitee' },
                      { id: 4, name: 'Control4' },
                      { id: 5, name: 'Subway' }
                    ];
                    
                    return <WorkspacesTable workspaces={workspaces} />;
                  })()}
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Empty State</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  <WorkspacesTable workspaces={[]} />
                </div>
                <p className={styles.showcase__hint}>Shows table header with no data rows</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Large Dataset</h4>
                <div className={styles.showcase__exampleContent} style={{ backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  {(() => {
                    const workspaces = [
                      { id: 1, name: 'Americal Eagle' }, { id: 2, name: 'Dollar General' },
                      { id: 3, name: 'Agilitee' }, { id: 4, name: 'Control4' },
                      { id: 5, name: 'Subway' }, { id: 6, name: 'Target' },
                      { id: 7, name: 'Walmart' }, { id: 8, name: 'Best Buy' },
                      { id: 9, name: 'Home Depot' }, { id: 10, name: 'Lowes' },
                      { id: 11, name: 'Costco' }, { id: 12, name: 'McDonalds' }
                    ];
                    
                    return <WorkspacesTable workspaces={workspaces} />;
                  })()}
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import WorkspacesTable from '@/components/templates/WorkspacesTable/WorkspacesTable';

const workspaces = [
  { id: 1, name: 'Americal Eagle' },
  { id: 2, name: 'Dollar General' },
  { id: 3, name: 'Agilitee' },
  { id: 4, name: 'Control4' },
  { id: 5, name: 'Subway' }
];

<WorkspacesTable workspaces={workspaces} />

// Workspace object structure
{
  id: string | number,  // Optional unique identifier
  name: string         // Workspace name to display
}`}
              </pre>
            </div>
          </div>

        </section>

        {/* Pages Section */}
        <section className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Pages</h2>
          
          {/* TwoColumnPage Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>TwoColumnPage</h3>
            <p className={styles.showcase__componentDescription}>
              A responsive two-column page layout with left navigation and main content areas
            </p>
            
            <div className={`${styles.showcase__demo} ${styles['showcase__demo--templates']}`}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default TwoColumnPage (with placeholders)</h4>
                <div className={styles.showcase__exampleContent} style={{ height: '100vh', border: '1px solid #333' }}>
                  <TwoColumnPage />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>TwoColumnPage with Custom Content</h4>
                <div className={styles.showcase__exampleContent} style={{ height: '100vh', border: '1px solid #333' }}>
                  <TwoColumnPage 
                    leftContent={
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ color: '#D5D5D5', margin: '0 0 16px 0' }}>Navigation</h3>
                        <nav>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>
                              <a href="#" style={{ color: '#9B9B9B', textDecoration: 'none' }}>Users</a>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                              <a href="#" style={{ color: '#9B9B9B', textDecoration: 'none' }}>Workspaces</a>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                              <a href="#" style={{ color: '#9B9B9B', textDecoration: 'none' }}>Settings</a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    }
                    rightContent={
                      <div style={{ padding: '20px' }}>
                        <header style={{ marginBottom: '20px' }}>
                          <h1 style={{ color: '#D5D5D5', margin: '0 0 8px 0' }}>Dashboard</h1>
                          <button style={{ 
                            backgroundColor: '#0066CC', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}>
                            Add User
                          </button>
                        </header>
                        <main>
                          <p style={{ color: '#9B9B9B', margin: 0 }}>Main content area with dashboard widgets and data tables.</p>
                        </main>
                      </div>
                    }
                  />
                </div>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Mobile Responsive (stacked layout)</h4>
                <div className={styles.showcase__exampleContent} style={{ height: '100vh', maxWidth: '375px', border: '1px solid #333', margin: '0 auto' }}>
                  <TwoColumnPage 
                    leftContent={
                      <div style={{ padding: '16px', textAlign: 'center' }}>
                        <h4 style={{ color: '#D5D5D5', margin: '0 0 12px 0' }}>Mobile Nav</h4>
                        <p style={{ color: '#9B9B9B', fontSize: '12px', margin: 0 }}>Navigation shown at bottom on mobile</p>
                      </div>
                    }
                    rightContent={
                      <div style={{ padding: '16px' }}>
                        <h2 style={{ color: '#D5D5D5', margin: '0 0 12px 0' }}>Mobile Content</h2>
                        <p style={{ color: '#9B9B9B', fontSize: '14px', margin: 0 }}>Main content appears first on mobile devices for better UX.</p>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';

// Basic usage with placeholders
<TwoColumnPage />

// With custom content
<TwoColumnPage 
  leftContent={<NavigationComponent />}
  rightContent={<MainContentComponent />}
/>

// With custom className
<TwoColumnPage 
  className="custom-page-styles"
  leftContent={<SideNav />}
  rightContent={<Dashboard />}
/>

// Props interface
{
  leftContent?: ReactNode,   // Content for left sidebar
  rightContent?: ReactNode,  // Content for main area
  className?: string        // Additional CSS classes
}`}
              </pre>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}