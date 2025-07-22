import { render, screen, fireEvent } from '@testing-library/react';
import AccountChanger from './AccountChanger';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock console.log to test if it's called
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('AccountChanger', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('renders with default props', () => {
    render(<AccountChanger />);
    
    expect(screen.getByText('Agilitee')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch account from Agilitee')).toBeInTheDocument();
    expect(screen.getByLabelText('Create new note')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    render(
      <AccountChanger 
        accountName="CustomAccount" 
        accountInitial="C"
      />
    );
    
    expect(screen.getByText('CustomAccount')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch account from CustomAccount')).toBeInTheDocument();
  });

  it('handles account click', () => {
    const handleAccountClick = jest.fn();
    render(<AccountChanger onAccountClick={handleAccountClick} />);
    
    const accountButton = screen.getByLabelText('Switch account from Agilitee');
    fireEvent.click(accountButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Account dropdown clicked - TODO: Open modal');
    expect(handleAccountClick).toHaveBeenCalledTimes(1);
  });

  it('handles notes click', () => {
    const handleNotesClick = jest.fn();
    render(<AccountChanger onNotesClick={handleNotesClick} />);
    
    const notesButton = screen.getByLabelText('Create new note');
    fireEvent.click(notesButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Notes button clicked - TODO: Create new document');
    expect(handleNotesClick).toHaveBeenCalledTimes(1);
  });

  it('renders chevron icon', () => {
    render(<AccountChanger />);
    
    const chevronIcon = screen.getByAltText('');
    expect(chevronIcon).toHaveAttribute('src', '/chevron-down.svg');
    expect(chevronIcon).toHaveAttribute('width', '16');
    expect(chevronIcon).toHaveAttribute('height', '16');
  });

  it('renders notes icon', () => {
    render(<AccountChanger />);
    
    const notesIcons = screen.getAllByAltText('');
    const notesIcon = notesIcons.find(icon => icon.src.includes('note.svg'));
    expect(notesIcon).toHaveAttribute('src', '/note.svg');
    expect(notesIcon).toHaveAttribute('width', '16');
    expect(notesIcon).toHaveAttribute('height', '16');
  });

  it('logs console message without callback', () => {
    render(<AccountChanger />);
    
    const accountButton = screen.getByLabelText('Switch account from Agilitee');
    fireEvent.click(accountButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Account dropdown clicked - TODO: Open modal');
  });

  it('has proper accessibility attributes', () => {
    render(<AccountChanger />);
    
    const accountButton = screen.getByLabelText('Switch account from Agilitee');
    expect(accountButton).toHaveAttribute('aria-label', 'Switch account from Agilitee');
    
    const notesButton = screen.getByLabelText('Create new note');
    expect(notesButton).toHaveAttribute('aria-label', 'Create new note');
  });

  // Admin variant tests
  describe('Admin variant', () => {
    it('renders admin variant when isAdmin is true', () => {
      render(<AccountChanger isAdmin={true} />);
      
      expect(screen.getByText('Ckye Admin')).toBeInTheDocument();
      expect(screen.getByLabelText('Exit admin mode')).toBeInTheDocument();
      
      // Should not render default variant elements
      expect(screen.queryByText('Agilitee')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Create new note')).not.toBeInTheDocument();
    });

    it('renders chevron-left icon in admin mode', () => {
      render(<AccountChanger isAdmin={true} />);
      
      const chevronIcon = screen.getByAltText('');
      expect(chevronIcon).toHaveAttribute('src', '/chevron-left.svg');
      expect(chevronIcon).toHaveAttribute('width', '16');
      expect(chevronIcon).toHaveAttribute('height', '16');
    });

    it('handles admin back click', () => {
      const handleAdminBack = jest.fn();
      render(<AccountChanger isAdmin={true} onAdminBack={handleAdminBack} />);
      
      const backButton = screen.getByLabelText('Exit admin mode');
      fireEvent.click(backButton);
      
      expect(mockConsoleLog).toHaveBeenCalledWith('Admin back clicked - reverting to default view');
      expect(handleAdminBack).toHaveBeenCalledTimes(1);
    });

    it('logs console message without admin back callback', () => {
      render(<AccountChanger isAdmin={true} />);
      
      const backButton = screen.getByLabelText('Exit admin mode');
      fireEvent.click(backButton);
      
      expect(mockConsoleLog).toHaveBeenCalledWith('Admin back clicked - reverting to default view');
    });

    it('has proper accessibility attributes in admin mode', () => {
      render(<AccountChanger isAdmin={true} />);
      
      const backButton = screen.getByLabelText('Exit admin mode');
      expect(backButton).toHaveAttribute('aria-label', 'Exit admin mode');
    });
  });
});