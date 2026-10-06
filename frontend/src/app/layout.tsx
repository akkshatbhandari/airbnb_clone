import type { Metadata } from 'next';
import './globals.css';
import { RoleProvider } from '@/context/RoleContext';
import { ToastContainer } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'Airbnb | Vacation Rentals, Cabins, Beach Houses & More',
  description: 'Find the perfect place to stay at amazing prices with Airbnb.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <RoleProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <ToastContainer />
          
          {/* Global Footer */}
          <footer className="bg-gray-100 border-t border-gray-200 mt-auto py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-airbnb-gray">
              <div className="flex items-center gap-2">
                <span>© 2026 Airbnb Clone, Inc.</span>
                <span>·</span>
                <span className="hover:underline cursor-pointer">Privacy</span>
                <span>·</span>
                <span className="hover:underline cursor-pointer">Terms</span>
                <span>·</span>
                <span className="hover:underline cursor-pointer">Sitemap</span>
              </div>
              <div className="flex items-center gap-4 font-semibold text-airbnb-dark">
                <span>🌐 English (US)</span>
                <span>$ USD</span>
              </div>
            </div>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
