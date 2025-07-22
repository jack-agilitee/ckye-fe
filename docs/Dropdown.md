# Dropdown Component

## Overview
The Dropdown component is an atom-level select field with label support, error states, and full accessibility features. It provides a custom-styled dropdown menu that matches the Figma design specifications for form selects in the Ckye application.

## Usage

```jsx
import Dropdown from '@/components/atoms/Dropdown/Dropdown';

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

// With error state
<Dropdown 
  label="Category"
  options={categoryOptions}
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  error={!!categoryError}
  errorMessage={categoryError}
  required
/>

// Uncontrolled component
<Dropdown 
  label="Select Option"
  name="option"
  options={options}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Label text displayed above the dropdown |
| `value` | string | - | Controlled component value |
| `onChange` | function | - | Change event handler (receives event with target.value) |
| `options` | array | [] | Array of option objects with `value` and `label` properties |
| `placeholder` | string | 'Select an option' | Placeholder text when no option is selected |
| `name` | string | - | Input name attribute |
| `id` | string | auto-generated | Dropdown id (auto-generated if not provided) |
| `disabled` | boolean | false | Disabled state |
| `required` | boolean | false | Required field indicator |
| `error` | boolean | false | Error state styling |
| `errorMessage` | string | - | Error message to display |
| `className` | string | '' | Additional CSS class for container |
| `dropdownClassName` | string | '' | Additional CSS class for dropdown button |
| `labelClassName` | string | '' | Additional CSS class for label |
| `ref` | React.Ref | - | Forwarded ref to button element |

## Features

### Option Format
Options should be provided as an array of objects:

```jsx
const options = [
  { value: 'value1', label: 'Display Label 1' },
  { value: 'value2', label: 'Display Label 2' },
  // ...
];
```

### Controlled vs Uncontrolled
The component supports both controlled and uncontrolled patterns:

```jsx
// Controlled
const [value, setValue] = useState('');
<Dropdown 
  value={value} 
  onChange={(e) => setValue(e.target.value)}
  options={options}
/>

// Uncontrolled
<Dropdown 
  defaultValue="option1"
  name="myDropdown"
  options={options}
/>
```

### Error States
Display validation errors with proper styling and accessibility:

```jsx
<Dropdown 
  label="Priority"
  error={!priority}
  errorMessage="Please select a priority level"
  options={priorityOptions}
/>
```

### Keyboard Navigation
- `Enter` or `Space`: Open/close dropdown
- `Escape`: Close dropdown
- `Arrow Down`: Open dropdown
- `Arrow Up`: Close dropdown (when open)
- `Tab`: Navigate through options when open

### Accessibility
- Proper label-dropdown association with `htmlFor` and `id`
- `aria-haspopup` and `aria-expanded` for dropdown state
- `aria-invalid` for error states
- `aria-describedby` for error messages
- `role="listbox"` for options container
- `role="option"` and `aria-selected` for individual options
- Required field indicators
- Keyboard navigation support

### Styling States
- Default: Gray border (#353535)
- Hover: Lighter border color
- Focus/Open: Primary color border with text color change
- Error: Red border with error message
- Disabled: Reduced opacity
- Selected option: Highlighted background

## Examples

### Basic Dropdown
```jsx
function BasicExample() {
  const [workspace, setWorkspace] = useState('');
  
  const workspaceOptions = [
    { value: 'personal', label: 'Personal Workspace' },
    { value: 'team', label: 'Team Workspace' },
    { value: 'client', label: 'Client Projects' }
  ];

  return (
    <Dropdown 
      label="Workspace"
      placeholder="Select workspace"
      options={workspaceOptions}
      value={workspace}
      onChange={(e) => setWorkspace(e.target.value)}
    />
  );
}
```

### Form with Validation
```jsx
function FormExample() {
  const [formData, setFormData] = useState({
    category: '',
    priority: ''
  });
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'improvement', label: 'Improvement' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Dropdown 
        label="Category"
        options={categoryOptions}
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        error={!!errors.category}
        errorMessage={errors.category}
        required
      />
      
      <Dropdown 
        label="Priority"
        options={priorityOptions}
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        error={!!errors.priority}
        errorMessage={errors.priority}
        required
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Custom Styled Dropdown
```jsx
<Dropdown 
  label="Custom Dropdown"
  className="my-custom-dropdown"
  dropdownClassName="my-custom-field"
  labelClassName="my-custom-label"
  options={options}
  placeholder="Make a selection..."
/>
```

## Design Specifications
- Font: Inter Medium (12px) for label and dropdown text
- Label color: #9B9B9B (White/Secondary)
- Border: 1px solid #353535
- Border radius: 8px
- Padding: 8px 12px
- Gap between label and dropdown: 8px
- Chevron icon: 16x16px
- Dropdown menu: 4px offset from field, max-height 240px

## Related Components
- [TextField](/docs/TextField.md) - For text input fields
- [Button](/docs/Button.md) - For form submission
- [Chip](/docs/Chip.md) - For displaying selected options as tags