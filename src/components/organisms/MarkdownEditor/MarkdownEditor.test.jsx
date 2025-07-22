import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import MarkdownEditor from './MarkdownEditor';

// Mock the MDXEditor component since it requires browser APIs
jest.mock('@mdxeditor/editor', () => ({
  MDXEditor: ({ markdown, onChange, placeholder, readOnly }) => (
    <div data-testid="mdx-editor">
      <textarea
        data-testid="mdx-textarea"
        value={markdown}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  ),
  // Mock all the plugins
  headingsPlugin: jest.fn(() => ({})),
  listsPlugin: jest.fn(() => ({})),
  quotePlugin: jest.fn(() => ({})),
  thematicBreakPlugin: jest.fn(() => ({})),
  markdownShortcutPlugin: jest.fn(() => ({})),
  linkPlugin: jest.fn(() => ({})),
  linkDialogPlugin: jest.fn(() => ({})),
  tablePlugin: jest.fn(() => ({})),
  codeBlockPlugin: jest.fn(() => ({})),
  codeMirrorPlugin: jest.fn(() => ({})),
  diffSourcePlugin: jest.fn(() => ({})),
  toolbarPlugin: jest.fn(() => ({})),
  UndoRedo: () => null,
  BoldItalicUnderlineToggles: () => null,
  CodeToggle: () => null,
  CreateLink: () => null,
  InsertTable: () => null,
  InsertThematicBreak: () => null,
  ListsToggle: () => null,
  Separator: () => null,
  BlockTypeSelect: () => null,
  InsertCodeBlock: () => null,
  DiffSourceToggleWrapper: ({ children }) => children,
}));

// Mock dynamic import
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn) => {
    const Component = fn().then ? 
      require('@mdxeditor/editor').MDXEditor : 
      fn;
    return Component;
  },
}));

describe('MarkdownEditor', () => {
  it('renders with default props', async () => {
    render(<MarkdownEditor />);
    
    await waitFor(() => {
      expect(screen.getByText('Markdown Editor')).toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });
  });

  it('renders with initial value', async () => {
    const initialValue = '# Hello World\n\nThis is a test.';
    render(<MarkdownEditor initialValue={initialValue} />);
    
    await waitFor(() => {
      const textarea = screen.getByTestId('mdx-textarea');
      expect(textarea.value).toBe(initialValue);
    });
  });

  it('toggles between edit and preview modes', async () => {
    render(<MarkdownEditor />);
    
    await waitFor(() => {
      const toggleButton = screen.getByText('Preview');
      expect(toggleButton).toBeInTheDocument();
    });

    // Click to switch to preview mode
    fireEvent.click(screen.getByText('Preview'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    
    // The editor should be read-only in preview mode
    const textarea = screen.getByTestId('mdx-textarea');
    expect(textarea).toHaveAttribute('readOnly');
    
    // Click to switch back to edit mode
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(textarea).not.toHaveAttribute('readOnly');
  });

  it('calls onChange when content changes', async () => {
    const mockOnChange = jest.fn();
    render(<MarkdownEditor onChange={mockOnChange} />);
    
    await waitFor(() => {
      const textarea = screen.getByTestId('mdx-textarea');
      expect(textarea).toBeInTheDocument();
    });

    const textarea = screen.getByTestId('mdx-textarea');
    const newContent = '## New Content';
    
    fireEvent.change(textarea, { target: { value: newContent } });
    
    expect(mockOnChange).toHaveBeenCalledWith(newContent);
  });

  it('renders with custom placeholder', async () => {
    const customPlaceholder = 'Write your story...';
    render(<MarkdownEditor placeholder={customPlaceholder} />);
    
    await waitFor(() => {
      const textarea = screen.getByTestId('mdx-textarea');
      expect(textarea).toHaveAttribute('placeholder', customPlaceholder);
    });
  });

  it('applies custom className', async () => {
    const { container } = render(<MarkdownEditor className="custom-editor" />);
    
    await waitFor(() => {
      const editor = container.querySelector('.markdown-editor');
      expect(editor).toHaveClass('custom-editor');
    });
  });

  it('renders in readOnly mode', async () => {
    render(<MarkdownEditor readOnly />);
    
    await waitFor(() => {
      const textarea = screen.getByTestId('mdx-textarea');
      expect(textarea).toHaveAttribute('readOnly');
    });
  });

  it('exposes ref methods', async () => {
    const ref = createRef();
    render(<MarkdownEditor ref={ref} initialValue="Initial content" />);
    
    await waitFor(() => {
      expect(ref.current).toBeDefined();
    });

    // Test getMarkdown method
    expect(ref.current.getMarkdown()).toBe('Initial content');
    
    // Test setMarkdown method
    ref.current.setMarkdown('New content');
    await waitFor(() => {
      expect(ref.current.getMarkdown()).toBe('New content');
    });
  });

  it('shows loading state before plugins are loaded', () => {
    const { container } = render(<MarkdownEditor />);
    
    // Initially should show loading
    expect(screen.getByText('Loading editor...')).toBeInTheDocument();
    expect(container.querySelector('.markdown-editor--loading')).toBeInTheDocument();
  });

  it('maintains content when toggling preview mode', async () => {
    const content = '# Test\n\nContent should persist';
    render(<MarkdownEditor initialValue={content} />);
    
    await waitFor(() => {
      const textarea = screen.getByTestId('mdx-textarea');
      expect(textarea.value).toBe(content);
    });

    // Toggle to preview
    fireEvent.click(screen.getByText('Preview'));
    
    // Content should still be there
    const textarea = screen.getByTestId('mdx-textarea');
    expect(textarea.value).toBe(content);
    
    // Toggle back to edit
    fireEvent.click(screen.getByText('Edit'));
    expect(textarea.value).toBe(content);
  });
});