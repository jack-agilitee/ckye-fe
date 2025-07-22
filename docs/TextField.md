# TextField Component

## Overview
The TextField component is an atom-level input field with label support, error states, and full accessibility features. It matches the Figma design specifications for form inputs in the Ckye application.

## Usage

```jsx
import TextField from '@/components/atoms/TextField/TextField';

// Basic usage
<TextField 
  label="Name"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// With error state
<TextField 
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!!emailError}
  errorMessage={emailError}
  required
/>

// Uncontrolled component
<TextField 
  label="Username"
  name="username"
  ref={inputRef}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Label text displayed above the input |
| `placeholder` | string | 'Label' | Placeholder text for the input |
| `value` | string | - | Controlled component value |
| `onChange` | function | - | Change event handler |
| `onBlur` | function | - | Blur event handler |
| `onFocus` | function | - | Focus event handler |
| `name` | string | - | Input name attribute |
| `id` | string | auto-generated | Input id (auto-generated if not provided) |
| `type` | string | 'text' | Input type (text, email, password, etc.) |
| `disabled` | boolean | false | Disabled state |
| `required` | boolean | false | Required field indicator |
| `error` | boolean | false | Error state styling |
| `errorMessage` | string | - | Error message to display |
| `className` | string | '' | Additional CSS class for container |
| `inputClassName` | string | '' | Additional CSS class for input |
| `labelClassName` | string | '' | Additional CSS class for label |
| `ref` | React.Ref | - | Forwarded ref to input element |

## Features

### Controlled vs Uncontrolled
The component supports both controlled and uncontrolled patterns:

```jsx
// Controlled
const [value, setValue] = useState('');
<TextField value={value} onChange={(e) => setValue(e.target.value)} />

// Uncontrolled
const inputRef = useRef();
<TextField ref={inputRef} defaultValue="Initial value" />
```

### Error States
Display validation errors with proper styling and accessibility:

```jsx
<TextField 
  label="Email"
  error={!isValidEmail}
  errorMessage="Please enter a valid email address"
/>
```

### Accessibility
- Proper label-input association with `htmlFor` and `id`
- `aria-invalid` for error states
- `aria-describedby` for error messages
- Required field indicators
- Keyboard navigation support

### Styling States
- Default: Gray border (#353535)
- Hover: Lighter border color
- Focus: Primary color border with text color change
- Error: Red border with error message
- Disabled: Reduced opacity

## Examples

### Form Field with Validation
```jsx
function FormExample() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value) => {
    if (!value) {
      setError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setError('Email is invalid');
    } else {
      setError('');
    }
  };

  return (
    <TextField 
      label="Email Address"
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
      }}
      onBlur={() => validateEmail(email)}
      error={!!error}
      errorMessage={error}
      required
    />
  );
}
```

### Custom Styled Field
```jsx
<TextField 
  label="Custom Field"
  className="my-custom-field"
  inputClassName="my-custom-input"
  labelClassName="my-custom-label"
  placeholder="Type something..."
/>
```

## Design Specifications
- Font: Inter Medium (12px) for label and input text
- Label color: #9B9B9B (White/Secondary)
- Border: 1px solid #353535
- Border radius: 8px
- Padding: 8px 12px
- Gap between label and input: 8px

## Related Components
- [Button](/docs/Button.md) - For form submission
- [SearchBar](/docs/SearchBar.md) - Specialized input for search functionality