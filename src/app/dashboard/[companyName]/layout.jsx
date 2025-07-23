export async function generateMetadata({ params }) {
  const { companyName } = params;
  
  return {
    title: `${companyName} Dashboard | Ckye`,
    description: `Manage ${companyName} pages and documentation in the Ckye dashboard`,
    keywords: ['dashboard', 'markdown', 'pages', companyName, 'Ckye'],
    openGraph: {
      title: `${companyName} Dashboard | Ckye`,
      description: `Manage ${companyName} pages and documentation`,
      type: 'website',
    },
  };
}

export default function DashboardLayout({ children }) {
  return children;
}