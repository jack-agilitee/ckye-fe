'use client';

import { useState } from 'react';
import SearchBar from '@/components/atoms/SearchBar/SearchBar';
import User from '@/components/molecules/User/User';
import ListItem from '@/components/molecules/ListItem/ListItem';
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
        </section>

        {/* Organisms Section (placeholder for future) */}
        <section className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Organisms</h2>
          <p className={styles.showcase__placeholder}>
            Organism components will be displayed here
          </p>
        </section>
      </main>
    </div>
  );
}