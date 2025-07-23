// Helper function to get base URL for SSR
const getBaseUrl = () => {
  return typeof window === 'undefined' 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`
    : '';
};

export async function getPages(companyName) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/pages?company=${encodeURIComponent(companyName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch pages');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
}

export async function upsertPage(pageData) {
  try {
    const baseUrl = getBaseUrl();
    
    const response = await fetch(`${baseUrl}/api/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: pageData.name,
        content: pageData.content || '',
        company: pageData.company,
        id: pageData.id || null
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error upserting page:`, error);
    throw error;
  }
}
