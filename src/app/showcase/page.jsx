'use client';

import { useState } from 'react';
import SearchBar from '@/components/atoms/SearchBar/SearchBar';
import Button from '@/components/atoms/Button/Button';
import Chip from '@/components/atoms/Chip/Chip';
import TextField from '@/components/atoms/TextField/TextField';
import User from '@/components/molecules/User/User';
import ListItem from '@/components/molecules/ListItem/ListItem';
import SeatType, { SEAT_TYPES } from '@/components/molecules/SeatType/SeatType';
import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';
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
        </section>
      </main>
    </div>
  );
}