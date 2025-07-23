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
import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';
import Avatar from '@/components/atoms/Avatar/Avatar';
import SettingsModal from '@/components/organisms/SettingsModal/SettingsModal';
import UsersTable from '@/components/templates/UsersTable/UsersTable';
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
                    />
                    <TextField 
                      label="Number"
                      type="number"
                      placeholder="123"
                    />
                    <TextField 
                      label="Date"
                      type="date"
                    />
                    <TextField 
                      label="Time"
                      type="time"
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
                    const workspaces = [
                      { id: '1', name: 'AEO', memberCount: 3 },
                      { id: '2', name: 'Dollar General', memberCount: 5 },
                      { id: '3', name: 'Agilitee', memberCount: 10 }
                    ];
                    
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
                            <SettingsModal
                              workspaces={workspaces}
                              currentWorkspaceId="1"
                              userEmail="james@agilitee.com"
                              onDismiss={() => setShowModal(false)}
                            />
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
                    const workspaces = [
                      { id: '1', name: 'Personal', memberCount: 1 },
                      { id: '2', name: 'Work Team', memberCount: 25 },
                      { id: '3', name: 'Client Project', memberCount: 8 },
                      { id: '4', name: 'Open Source', memberCount: 150 }
                    ];
                    
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
                            <SettingsModal
                              workspaces={workspaces}
                              currentWorkspaceId="2"
                              userEmail="user@company.com"
                              onDismiss={() => setShowModal(false)}
                            />
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
                    <SettingsModal
                      workspaces={[
                        { id: '1', name: 'AEO', memberCount: 3 },
                        { id: '2', name: 'Dollar General', memberCount: 5 },
                        { id: '3', name: 'Agilitee', memberCount: 10 }
                      ]}
                      currentWorkspaceId="1"
                      userEmail="james@agilitee.com"
                      onDismiss={() => console.log('Dismiss')}
                    />
                  </div>
                </div>
                <p className={styles.showcase__hint}>Static preview - interactions log to console</p>
              </div>
            </div>

            <div className={styles.showcase__code}>
              <h4 className={styles.showcase__codeTitle}>Usage</h4>
              <pre className={styles.showcase__codeBlock}>
{`import SettingsModal from '@/components/organisms/SettingsModal/SettingsModal';

const workspaces = [
  { id: '1', name: 'AEO', memberCount: 3 },
  { id: '2', name: 'Dollar General', memberCount: 5 },
  { id: '3', name: 'Agilitee', memberCount: 10 }
];

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Open Settings
      </Button>
      
      {showModal && (
        <SettingsModal
          workspaces={workspaces}
          currentWorkspaceId="1"
          userEmail="james@agilitee.com"
          onDismiss={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// Workspace object structure
{
  id: string,          // Unique identifier
  name: string,        // Display name
  memberCount: number  // Number of members
}`}
              </pre>
            </div>
          </div>

        </section>

        {/* Templates Section */}
        <section className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Templates</h2>
          
          {/* UsersTable Component */}
          <div className={styles.showcase__component}>
            <h3 className={styles.showcase__componentTitle}>UsersTable</h3>
            <p className={styles.showcase__componentDescription}>
              A table template displaying user information with name, email, user type, and workspaces
            </p>
            
            <div className={`${styles.showcase__demo} ${styles['showcase__demo--templates']}`}>
              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Default UsersTable</h4>
                <div className={styles.showcase__exampleContent}>
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
                <div className={styles.showcase__exampleContent}>
                  <UsersTable users={[]} />
                </div>
                <p className={styles.showcase__hint}>Shows table headers with no data rows</p>
              </div>

              <div className={styles.showcase__example}>
                <h4 className={styles.showcase__exampleTitle}>Full Example</h4>
                <div className={styles.showcase__exampleContent}>
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
        </section>
      </main>
    </div>
  );
}