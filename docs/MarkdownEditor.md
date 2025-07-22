# MarkdownEditor Component

## Overview
The `MarkdownEditor` is an organism-level component that provides a full-featured markdown editing experience with live preview, syntax highlighting, and a rich toolbar.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=19-3153&m=dev
- Node ID: 19:3153

## Features
- **Dual Mode**: Toggle between edit and preview modes
- **Rich Toolbar**: Formatting buttons for bold, italic, lists, links, tables, and more
- **Syntax Highlighting**: Code blocks with language-specific highlighting
- **Markdown Shortcuts**: Type markdown syntax naturally (e.g., `**bold**`, `# heading`)
- **Live Preview**: See formatted output in preview mode
- **Dark Theme**: Styled to match the application's dark theme

## Usage

```jsx
import MarkdownEditor from '@/components/organisms/MarkdownEditor/MarkdownEditor';

function MyComponent() {
  const [content, setContent] = useState('# Welcome\n\nStart writing...');

  const handleChange = (newContent) => {
    console.log('Content changed:', newContent);
    setContent(newContent);
  };

  return (
    <MarkdownEditor
      initialValue={content}
      onChange={handleChange}
      placeholder="Write your markdown here..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialValue | String | `''` | Initial markdown content |
| onChange | Function | - | Callback when content changes: `(content: string) => void` |
| placeholder | String | `'Start writing your markdown...'` | Placeholder text for empty editor |
| className | String | `''` | Additional CSS classes |
| readOnly | Boolean | `false` | Make the editor read-only |
| ref | React.Ref | - | Ref to access editor methods |

## Ref Methods

The component exposes these methods through ref:

```jsx
const editorRef = useRef();

// Get current markdown content
const content = editorRef.current.getMarkdown();

// Set markdown content programmatically
editorRef.current.setMarkdown('# New Content');

// Focus the editor
editorRef.current.focus();
```

## Toolbar Features

The editor includes a comprehensive toolbar with:
- **Text Formatting**: Bold, Italic, Underline, Code
- **Headings**: H1-H6 block type selector
- **Lists**: Ordered and unordered lists
- **Links**: Create and edit links with dialog
- **Tables**: Insert and edit tables
- **Code Blocks**: Insert code with syntax highlighting
- **Other**: Horizontal rules, quotes, undo/redo

## Supported Markdown

All standard markdown syntax is supported:
- Headers (`# H1`, `## H2`, etc.)
- Bold (`**text**`), Italic (`*text*`), Code (`` `code` ``)
- Lists (ordered `1.` and unordered `-`)
- Links (`[text](url)`)
- Images (`![alt](url)`) - Note: Image upload not implemented
- Code blocks with syntax highlighting
- Tables
- Blockquotes (`>`)
- Horizontal rules (`---`)

## Code Syntax Highlighting

The editor supports syntax highlighting for:
- JavaScript/TypeScript
- HTML
- CSS
- Plain text

## Styling

- Uses SCSS modules with BEM methodology
- Dark theme optimized
- Responsive design
- Custom styled to match Figma design
- Syntax highlighting colors match the design system

## Dependencies

- `@mdxeditor/editor` - The core markdown editor
- Button component (atom) - For the mode toggle
- Next.js dynamic imports - For SSR compatibility

## Accessibility

- Keyboard navigation support
- ARIA labels for toolbar buttons
- Focus management
- Screen reader compatible

## Example: Form Integration

```jsx
function BlogPostForm() {
  const editorRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editorRef.current.getMarkdown();
    
    // Submit the markdown content
    saveBlogPost({
      title: '...',
      content: content
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <MarkdownEditor
        ref={editorRef}
        initialValue={existingContent}
        placeholder="Write your blog post..."
      />
      <button type="submit">Save Post</button>
    </form>
  );
}
```

## Example: Read-Only Display

```jsx
// Display markdown content without editing
<MarkdownEditor
  initialValue={savedContent}
  readOnly={true}
/>
```

## Performance Considerations

- The editor is loaded dynamically to avoid SSR issues
- Plugins are loaded asynchronously
- Shows loading state while initializing
- Optimized for large documents

## Browser Support

- Requires modern browsers with ES6 support
- Best experience in Chrome, Firefox, Safari, Edge
- Mobile editing is supported but desktop is recommended