# VariantsModal Component Documentation

## Overview
The `VariantsModal` is an organism-level component that displays code variants in a modal dialog with syntax highlighting and action buttons. It was created based on the Figma design reference.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=210-4777&m=dev
- **Node ID**: 210:4777
- **Component Name**: VariantsModal

## Import
```javascript
import VariantsModal from '@/components/organisms/VariantsModal/VariantsModal';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls the visibility of the modal |
| `onClose` | `function` | - | Callback function called when the modal should close |
| `title` | `string` | `'Clade.md'` | The title displayed in the modal header |
| `version` | `string` | `'Version 2'` | The version text displayed below the title |
| `codeContent` | `string` | `''` | Markdown content with code to be displayed |
| `onSetToMaster` | `function` | - | Callback for "Set to Master" button click |
| `onCreateExperiment` | `function` | - | Callback for "Create Experiment with Variant" button click |

## Usage Examples

### Basic Usage
```jsx
import { useState } from 'react';
import VariantsModal from '@/components/organisms/VariantsModal/VariantsModal';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const codeContent = `
\`\`\`typescript
// Standard component template
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {
  // Properties first
  public data: any[] = [];

  // Constructor
  constructor(private service: ExampleService) {}

  // Lifecycle hooks
  ngOnInit() {}

  // Public methods
  public handleAction() {}

  // Private methods
  private helperMethod() {}
}
\`\`\`
  `;

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Open Variants Modal
      </button>

      <VariantsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Component.ts"
        version="Version 3"
        codeContent={codeContent}
        onSetToMaster={() => {
          console.log('Setting to master version');
          setIsModalOpen(false);
        }}
        onCreateExperiment={() => {
          console.log('Creating experiment with variant');
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
```

### With Dynamic Content
```jsx
import { useState, useEffect } from 'react';
import VariantsModal from '@/components/organisms/VariantsModal/VariantsModal';

function VariantManager({ variantId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variantData, setVariantData] = useState(null);

  useEffect(() => {
    if (isModalOpen && variantId) {
      // Fetch variant data from API
      fetchVariantData(variantId).then(setVariantData);
    }
  }, [isModalOpen, variantId]);

  const handleSetToMaster = async () => {
    try {
      await updateVariantStatus(variantId, 'master');
      setIsModalOpen(false);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  const handleCreateExperiment = async () => {
    try {
      await createExperiment(variantId);
      setIsModalOpen(false);
      // Navigate to experiment page
    } catch (error) {
      // Handle error
    }
  };

  return (
    <VariantsModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={variantData?.name || 'Loading...'}
      version={variantData?.version || ''}
      codeContent={variantData?.code || ''}
      onSetToMaster={handleSetToMaster}
      onCreateExperiment={handleCreateExperiment}
    />
  );
}
```

## Features

### Modal Behavior
- **Click Outside to Close**: Clicking outside the modal content area will trigger the `onClose` callback
- **Body Scroll Prevention**: When the modal is open, the body scroll is disabled to prevent background scrolling
- **Responsive Design**: The modal adapts to different screen sizes with appropriate max-width and height constraints

### Code Display
- **Syntax Highlighting**: Uses MDXEditor with CodeMirror for syntax highlighting
- **Read-only Mode**: The code display is read-only to prevent accidental edits
- **Multiple Language Support**: Supports JavaScript, TypeScript, Python, CSS, SCSS, HTML, JSON, SQL, and more
- **Custom Scrollbar**: Styled scrollbar for better visual consistency

### Accessibility
- **ARIA Labels**: Close button has proper aria-label for screen readers
- **Focus Management**: Buttons have visible focus states
- **Keyboard Navigation**: All interactive elements are keyboard accessible

## Styling

The component uses CSS Modules with SCSS and follows the BEM methodology. Key style features include:

- Dark theme with colors from the design system
- Smooth transitions for hover and active states
- Custom syntax highlighting colors matching the Figma design
- Responsive breakpoints for mobile and tablet views

### Customization

To customize the modal's appearance, you can:

1. Override CSS variables in your global styles
2. Pass additional className props (if needed, can be added)
3. Modify the SCSS file directly for project-specific changes

## Testing

The component includes comprehensive tests covering:

- Rendering with different prop combinations
- User interactions (clicks, outside clicks)
- Modal open/close behavior
- Body scroll prevention
- Event listener cleanup
- Accessibility features

Run tests with:
```bash
npm test VariantsModal.test.jsx
```

## Dependencies

- `react` (hooks: useEffect, useRef)
- `next/image` for the close icon
- `@mdxeditor/editor` for markdown rendering and syntax highlighting
- Custom Button component from atoms (currently not used but available)

## Notes

- The component currently uses custom buttons instead of the reusable Button component to match the exact Figma design
- The MDXEditor is configured for read-only mode since this is for displaying code variants
- The modal uses a fixed position overlay with a semi-transparent backdrop
- Consider implementing animation/transition effects for modal open/close (not in current design)

## Future Enhancements

Potential improvements for future iterations:

1. Add animation for smooth modal entrance/exit
2. Support for copying code to clipboard
3. Keyboard shortcut support (ESC to close)
4. Loading state while fetching variant content
5. Error state handling for failed content loads
6. Integration with existing Button component from atoms
7. Support for theme switching (light/dark mode)