# CreateExperimentModal Component

## Overview
The `CreateExperimentModal` is an organism-level component that provides a modal dialog for creating new experiments. It features form inputs for experiment name, master file selection, and variant selection, with backdrop click-to-close functionality.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=213-6056
- Node ID: 213:6056

## Import
```jsx
import CreateExperimentModal from '@/components/organisms/CreateExperimentModal/CreateExperimentModal';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `Boolean` | `false` | Controls modal visibility |
| `onClose` | `Function` | **required** | Callback function called when modal should close |
| `onCreate` | `Function` | `undefined` | Callback function called when Create Experiment is clicked |
| `masterFiles` | `Array` | `[]` | Array of options for the Master File dropdown |
| `variants` | `Array` | `[]` | Array of options for the Variant to Test dropdown |
| `className` | `String` | `''` | Additional CSS classes for the modal wrapper |

### Option Object Structure
```javascript
{
  value: string,  // The value to be submitted
  label: string   // The display text in the dropdown
}
```

### Form Data Structure (passed to onCreate)
```javascript
{
  name: string,        // Experiment name
  masterFile: string,  // Selected master file value
  variant: string      // Selected variant value
}
```

## Usage Examples

### Basic Usage
```jsx
const [isModalOpen, setIsModalOpen] = useState(false);

const handleCreate = (formData) => {
  console.log('Creating experiment:', formData);
  // API call to create experiment
  createExperiment(formData);
};

const masterFiles = [
  { value: 'claude', label: 'Claude.md' },
  { value: 'commands', label: 'Commands.md' },
  { value: 'readme', label: 'README.md' }
];

const variants = [
  { value: 'v1', label: 'Variant 1' },
  { value: 'v2', label: 'Variant 2' },
  { value: 'v3', label: 'Variant 3' }
];

<CreateExperimentModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onCreate={handleCreate}
  masterFiles={masterFiles}
  variants={variants}
/>
```

### With Dynamic Options
```jsx
const [masterFiles, setMasterFiles] = useState([]);
const [variants, setVariants] = useState([]);

useEffect(() => {
  // Fetch options from API
  fetchMasterFiles().then(files => {
    setMasterFiles(files.map(f => ({
      value: f.id,
      label: f.name
    })));
  });
  
  fetchVariants().then(vars => {
    setVariants(vars.map(v => ({
      value: v.id,
      label: v.name
    })));
  });
}, []);

<CreateExperimentModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onCreate={handleCreate}
  masterFiles={masterFiles}
  variants={variants}
/>
```

### With Loading State
```jsx
const handleCreate = async (formData) => {
  setIsLoading(true);
  try {
    await createExperiment(formData);
    toast.success('Experiment created successfully!');
    setIsModalOpen(false);
  } catch (error) {
    toast.error('Failed to create experiment');
  } finally {
    setIsLoading(false);
  }
};

<CreateExperimentModal
  isOpen={isModalOpen}
  onClose={() => !isLoading && setIsModalOpen(false)}
  onCreate={handleCreate}
  masterFiles={masterFiles}
  variants={variants}
/>
```

## Features

### Interactive Elements
- **Close Button (X)**: Closes the modal
- **Name Input**: Text field for experiment name
- **Master File Dropdown**: Selection for master file
- **Variant Dropdown**: Selection for variant to test
- **Cancel Button**: Closes the modal without saving
- **Create Experiment Button**: Submits form data and closes modal

### Closing Behavior
The modal can be closed in the following ways:
1. Clicking the X button in the header
2. Clicking the Cancel button
3. Clicking on the backdrop (outside the modal content)
4. Pressing the Escape key
5. Successfully creating an experiment

### Form Behavior
- Form resets when modal is opened
- Default selections are the first items in the dropdowns
- No validation on the name field (as specified)
- Form data is passed to `onCreate` callback when submitted

### Accessibility
- Proper ARIA attributes for modal dialog
- Keyboard navigation support
- Focus management
- Screen reader compatible
- Escape key to close

### Visual Features
- Fade-in animation for backdrop
- Slide-up animation for modal content
- Responsive design with max-width
- Scrollable content for smaller screens
- Prevents body scroll when open

## Component Composition
The modal is built using existing atomic components:
- `TextField` from atoms for the name input
- `Dropdown` from atoms for the selection fields
- `Button` from atoms for the action buttons
- `Image` from Next.js for the close icon

## Styling
The component uses SCSS modules with BEM methodology:
- Dark theme following the design system
- Backdrop with semi-transparent overlay
- Rounded corners and border styling
- Responsive layout with flexbox
- Smooth animations for open/close

## Testing
The component includes comprehensive tests covering:
- Rendering with different prop combinations
- User interactions (clicks, form inputs)
- Keyboard navigation (Escape key)
- Body scroll prevention
- Form reset behavior
- Callback function invocations
- Accessibility attributes

Test coverage target: >90%

## Dependencies
- React (hooks: useState, useEffect, useRef)
- Next.js Image component
- TextField component from atoms
- Dropdown component from atoms
- Button component from atoms
- SCSS modules

## Best Practices
1. Always provide meaningful options for dropdowns
2. Handle loading states in the onCreate callback
3. Provide user feedback after creation (toast, notification, etc.)
4. Consider disabling close during async operations
5. Ensure proper error handling in onCreate
6. Keep modal content concise and focused

## Related Components
- `TextField` - Used for name input
- `Dropdown` - Used for selection fields
- `Button` - Used for action buttons
- `ExperimentsTable` - Where created experiments might be displayed
- `Modal` - If a generic modal component exists for reuse