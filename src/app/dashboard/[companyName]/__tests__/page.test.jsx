import { render, screen } from '@testing-library/react';
import DashboardPage, { generateMetadata } from '../page';
import { getPages } from '@/lib/api/pages';

// Mock the dependencies
jest.mock('@/lib/api/pages', () => ({
  getPages: jest.fn(),
}));

jest.mock('@/components/pages/TwoColumnPage/TwoColumnPage', () => ({
  __esModule: true,
  default: ({ leftContent, rightContent }) => (
    <div data-testid="two-column-page">
      <div data-testid="left-content">{leftContent}</div>
      <div data-testid="right-content">{rightContent}</div>
    </div>
  ),
}));

jest.mock('../DashboardSidebar', () => ({
  __esModule: true,
  default: ({ initialPages, companyName, initialSelectedId }) => (
    <div data-testid="dashboard-sidebar">
      <div data-testid="company-name">{companyName}</div>
      <div data-testid="pages-count">{initialPages.length}</div>
      <div data-testid="selected-id">{initialSelectedId}</div>
    </div>
  ),
}));

jest.mock('../DashboardPageClient', () => ({
  __esModule: true,
  default: ({ initialPages, selectedPageId }) => (
    <div data-testid="dashboard-client">
      <div data-testid="selected-page-id">{selectedPageId}</div>
      <div data-testid="pages-length">{initialPages.length}</div>
    </div>
  ),
}));

describe('DashboardPage', () => {
  const mockPages = [
    { id: '1', name: 'Claude.md', content: '# Claude', company: 'AEO' },
    { id: '2', name: 'Commands.md', content: '# Commands', company: 'AEO' },
  ];

  const mockParams = { companyName: 'AEO' };
  const mockSearchParams = {};

  beforeEach(() => {
    jest.clearAllMocks();
    getPages.mockResolvedValue({ data: mockPages });
  });

  describe('generateMetadata', () => {
    it('generates correct metadata for company', async () => {
      const metadata = await generateMetadata({ params: mockParams });
      
      expect(metadata).toEqual({
        title: 'AEO Dashboard | Ckye',
        description: 'Manage AEO pages and documentation in the Ckye dashboard',
        keywords: ['dashboard', 'markdown', 'pages', 'AEO', 'Ckye'],
        openGraph: {
          title: 'AEO Dashboard | Ckye',
          description: 'Manage AEO pages and documentation',
          type: 'website',
        },
      });
    });
  });

  describe('DashboardPage component', () => {
    it('renders the page with TwoColumnPage layout', async () => {
      const result = await DashboardPage({ params: mockParams, searchParams: mockSearchParams });
      const { container } = render(result);
      
      expect(screen.getByTestId('two-column-page')).toBeInTheDocument();
    });

    it('fetches pages on mount', async () => {
      await DashboardPage({ params: mockParams, searchParams: mockSearchParams });
      
      expect(getPages).toHaveBeenCalledWith('AEO');
    });

    it('passes company name to sidebar', async () => {
      const result = await DashboardPage({ params: mockParams, searchParams: mockSearchParams });
      render(result);
      
      expect(screen.getByTestId('company-name')).toHaveTextContent('AEO');
    });

    it('passes pages to both sidebar and client', async () => {
      const result = await DashboardPage({ params: mockParams, searchParams: mockSearchParams });
      render(result);
      
      expect(screen.getByTestId('pages-count')).toHaveTextContent('2');
      expect(screen.getByTestId('pages-length')).toHaveTextContent('2');
    });

    it('auto-selects first page when no page param', async () => {
      const result = await DashboardPage({ params: mockParams, searchParams: mockSearchParams });
      render(result);
      
      expect(screen.getByTestId('selected-id')).toHaveTextContent('1');
      expect(screen.getByTestId('selected-page-id')).toHaveTextContent('1');
    });

    it('selects page from URL params', async () => {
      const result = await DashboardPage({ 
        params: mockParams, 
        searchParams: { page: '2' } 
      });
      render(result);
      
      expect(screen.getByTestId('selected-id')).toHaveTextContent('2');
      expect(screen.getByTestId('selected-page-id')).toHaveTextContent('2');
    });

    it('handles empty pages list', async () => {
      getPages.mockResolvedValue({ data: [] });
      
      const result = await DashboardPage({ params: mockParams, searchParams: mockSearchParams });
      render(result);
      
      expect(screen.getByTestId('pages-count')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-id')).toBeEmptyDOMElement();
    });

    it('displays error state', async () => {
      getPages.mockRejectedValue(new Error('Failed to fetch'));
      
      const result = await DashboardPage({ params: mockParams, searchParams: mockSearchParams });
      const { container } = render(result);
      
      expect(container.textContent).toContain('Error: Failed to fetch');
    });
  });
});