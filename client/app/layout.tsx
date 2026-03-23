import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'E-Marts - Online Shopping Platform',
  description: 'Shop the latest products from E-Marts with premium quality items and great discounts',
  keywords: 'e-commerce, shopping, products, online store',
  icons: {
    icon: [
      {
        // E-mart Logo
        url: '/emart-logo.svg',
      },
    ]}
  }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
