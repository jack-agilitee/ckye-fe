import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariantsModal from './VariantsModal';

// Mock the MDXEditor component since it requires browser environment
jest.mock('@mdxeditor/editor', () => ({
  MDXEditor: ({ markdown, readOnly }) => (
    <div data-testid="mdx-editor" data-readonly={readOnly}>
      {markdown}
    </div>
  ),
  headingsPlugin: jest.fn(),
  codeBlockPlugin: jest.fn(),
  codeMirrorPlugin: jest.fn(),
  CodeMirrorEditor: jest.fn()
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}));

describe('VariantsModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    version: 'Version 1',
    codeContent: '```javascript\nconst test = "hello";\n```',
    onSetToMaster: jest.fn(),
    onCreateExperiment: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  it('should render when isOpen is true', () => {
    render(<VariantsModal {...defaultProps} />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Version 1')).toBeInTheDocument();
    expect(screen.getByText('Set to Master')).toBeInTheDocument();
    expect(screen.getByText('Create Experiment with Variant')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<VariantsModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should display code content in MDXEditor', () => {
    render(<VariantsModal {...defaultProps} />);
    
    const editor = screen.getByTestId('mdx-editor');
    expect(editor).toHaveTextContent('```javascript\nconst test = "hello";\n```');
    expect(editor).toHaveAttribute('data-readonly', 'true');
  });

  it('should call onClose when close button is clicked', () => {
    render(<VariantsModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onSetToMaster when Set to Master button is clicked', () => {
    render(<VariantsModal {...defaultProps} />);
    
    const setToMasterButton = screen.getByText('Set to Master');
    fireEvent.click(setToMasterButton);
    
    expect(defaultProps.onSetToMaster).toHaveBeenCalledTimes(1);
  });

  it('should call onCreateExperiment when Create Experiment button is clicked', () => {
    render(<VariantsModal {...defaultProps} />);
    
    const createExperimentButton = screen.getByText('Create Experiment with Variant');
    fireEvent.click(createExperimentButton);
    
    expect(defaultProps.onCreateExperiment).toHaveBeenCalledTimes(1);
  });

  it('should close when clicking outside the modal', async () => {
    const { container } = render(<VariantsModal {...defaultProps} />);
    
    // Click on the backdrop (outside the modal content)
    const backdrop = container.querySelector('.variants-modal');
    fireEvent.mouseDown(backdrop);
    
    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should not close when clicking inside the modal content', () => {
    const { container } = render(<VariantsModal {...defaultProps} />);
    
    // Click inside the modal content
    const modalContent = container.querySelector('.variants-modal__content');
    fireEvent.mouseDown(modalContent);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should prevent body scroll when modal is open', () => {
    render(<VariantsModal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when modal is closed', () => {
    const { rerender } = render(<VariantsModal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<VariantsModal {...defaultProps} isOpen={false} />);
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should use default values when props are not provided', () => {
    render(
      <VariantsModal 
        isOpen={true}
        onClose={jest.fn()}
      />
    );
    
    expect(screen.getByText('Clade.md')).toBeInTheDocument();
    expect(screen.getByText('Version 2')).toBeInTheDocument();
  });

  it('should handle empty code content', () => {
    render(
      <VariantsModal 
        {...defaultProps}
        codeContent=""
      />
    );
    
    const editor = screen.getByTestId('mdx-editor');
    expect(editor).toHaveTextContent('');
  });

  it('should have proper accessibility attributes', () => {
    render(<VariantsModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeInTheDocument();
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<VariantsModal {...defaultProps} />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(document.body.style.overflow).toBe('unset');
    
    removeEventListenerSpy.mockRestore();
  });

  it('should handle markdown content with multiple code blocks', () => {
    const multiBlockContent = `
\`\`\`javascript
const func1 = () => {};
\`\`\`

Some text between blocks

\`\`\`typescript
interface Test {
  name: string;
}
\`\`\`
    `;

    render(
      <VariantsModal 
        {...defaultProps}
        codeContent={multiBlockContent}
      />
    );
    
    const editor = screen.getByTestId('mdx-editor');
    expect(editor).toHaveTextContent(multiBlockContent);
  });

  it('should properly style buttons based on their variant', () => {
    const { container } = render(<VariantsModal {...defaultProps} />);
    
    const setToMasterButton = screen.getByText('Set to Master').closest('button');
    const createExperimentButton = screen.getByText('Create Experiment with Variant').closest('button');
    
    expect(setToMasterButton).toHaveClass('variants-modal__button--secondary');
    expect(createExperimentButton).toHaveClass('variants-modal__button--primary');
  });
});