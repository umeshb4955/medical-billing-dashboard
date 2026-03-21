
import './globals.css';

export const metadata = {
  title: 'Medical Billing Dashboard | Premium Healthcare Finance Management',
  description: 'Professional medical billing management system with real-time analytics'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
