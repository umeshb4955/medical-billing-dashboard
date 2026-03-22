
import './globals.css';

export const metadata = {
  title: 'Medical Billing Dashboard | Premium Healthcare Finance Management',
  description: 'Professional medical billing management system with real-time analytics',
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Medical Billing" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
