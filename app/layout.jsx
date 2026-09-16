import './globals.css'

export const metadata = {
  title: 'Weather Dashboard',
  description: 'Real-time weather information with forecasts and location search',
  keywords: 'weather, forecast, temperature, dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
