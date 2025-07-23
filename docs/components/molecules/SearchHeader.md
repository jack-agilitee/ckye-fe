# SearchHeader

A molecule component that combines a title, search bar, and action button to create a page header with search functionality.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=19-1893&m=dev
- Node ID: 19:1893

## Usage

```jsx
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';

const MyPage = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    console.log('Searching for:', value);
    // Implement search logic
  };

  const handleAddUsers = () => {
    console.log('Add users clicked');
    // Implement add users logic
  };

  return (
    <SearchHeader 
      title="Users"
      searchPlaceholder="Search Users"
      searchValue={searchValue}
      onSearchChange={(e) => setSearchValue(e.target.value)}
      onSearch={handleSearch}
      buttonText="Add Users"
      onButtonClick={handleAddUsers}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | 'Users' | The main heading text |
| searchPlaceholder | string | 'Search Users' | Placeholder text for the search input |
| onSearch | function | - | Callback fired when search is submitted (Enter key) |
| searchValue | string | - | Controlled value for the search input |
| onSearchChange | function | - | Callback fired when search input changes |
| buttonText | string | 'Add Users' | Text for the action button |
| onButtonClick | function | - | Callback fired when button is clicked |
| className | string | '' | Additional CSS classes |

## Features

- **Responsive Layout**: Stacks vertically on mobile devices
- **Accessible**: Uses semantic HTML and ARIA attributes
- **Reusable**: Built using existing atomic components (SearchBar and Button)
- **Customizable**: All text and callbacks can be customized via props

## Component Composition

This molecule is composed of:
- **SearchBar** (atom): Handles search input functionality
- **Button** (atom): Action button with icon support

## Styling

The component uses SCSS modules with BEM methodology. Key classes:

- `.search-header` - Main container
- `.search-header__title` - Page title
- `.search-header__controls` - Container for search and button
- `.search-header__search` - Search bar wrapper
- `.search-header__button` - Button wrapper

## Examples

### Basic Usage
```jsx
<SearchHeader />
```

### Custom Title and Placeholder
```jsx
<SearchHeader 
  title="Products"
  searchPlaceholder="Find products..."
  buttonText="Add Product"
/>
```

### With Search Handling
```jsx
const [searchTerm, setSearchTerm] = useState('');
const [results, setResults] = useState([]);

const handleSearch = async (value) => {
  const searchResults = await api.searchUsers(value);
  setResults(searchResults);
};

<SearchHeader 
  searchValue={searchTerm}
  onSearchChange={(e) => setSearchTerm(e.target.value)}
  onSearch={handleSearch}
  onButtonClick={() => navigate('/users/new')}
/>
```

### Different Page Headers
```jsx
// For a projects page
<SearchHeader 
  title="Projects"
  searchPlaceholder="Search projects..."
  buttonText="New Project"
  onButtonClick={openProjectModal}
/>

// For a documents page
<SearchHeader 
  title="Documents"
  searchPlaceholder="Find documents..."
  buttonText="Upload"
  onButtonClick={openUploadDialog}
/>
```

## Accessibility

- Uses semantic `<h1>` for the title
- Search bar has proper ARIA labels and role
- Button includes icon alt text
- Keyboard navigation fully supported
- Focus states clearly visible

## Testing

The component includes comprehensive tests covering:
- Rendering with default and custom props
- Search functionality callbacks
- Button click handling
- Controlled input behavior
- CSS class application
- Responsive layout behavior