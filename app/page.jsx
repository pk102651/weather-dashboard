'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [forecast, setForecast] = useState(null)

  useEffect(() => {
    fetchWeatherByCoords()
  }, [])

  const fetchWeatherByCoords = async () => {
    try {
      setLoading(true)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            await fetchWeather(latitude, longitude)
          },
          () => {
            fetchWeatherByCity('London')
          }
        )
      }
    } catch (error) {
      console.error('Error fetching weather:', error)
      setLoading(false)
    }
  }

  const fetchWeather = async (lat, lon) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )
      setWeather(response.data)

      const forecastResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )
      setForecast(forecastResponse.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching weather:', error)
      setLoading(false)
    }
  }

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true)
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      )
      setWeather(response.data)

      const forecastResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      )
      setForecast(forecastResponse.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching weather:', error)
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchWeatherByCity(searchQuery)
      setSearchQuery('')
    }
  }

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase()
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️'
    if (desc.includes('cloud')) return '☁️'
    if (desc.includes('rain')) return '🌧️'
    if (desc.includes('snow')) return '❄️'
    if (desc.includes('thunder')) return '⛈️'
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️'
    return '🌤️'
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-black bg-opacity-50 backdrop-blur sticky top-0 z-50 border-b border-gray-700">
        <div className="container-custom flex items-center justify-between py-4">
          <h1 className="text-3xl font-bold text-secondary">🌤️ Weather Dashboard</h1>
          <Link href="/admin" className="btn-primary">Admin Panel</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container-custom">
          <form onSubmit={handleSearch} className="flex gap-4 justify-center mb-8">
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full max-w-md"
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>
      </section>

      {/* Weather Display */}
      <section className="py-8">
        <div className="container-custom">
          {loading ? (
            <LoadingSpinner />
          ) : weather ? (
            <div className="space-y-8">
              {/* Current Weather */}
              <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-2">{weather.name}, {weather.sys.country}</h2>
                    <p className="text-6xl mb-4">{getWeatherIcon(weather.weather[0].description)}</p>
                    <p className="text-2xl font-semibold mb-2">{Math.round(weather.main.temp)}°C</p>
                    <p className="text-gray-300 text-xl capitalize mb-4">{weather.weather[0].description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded">
                      <p className="text-gray-400">Feels Like</p>
                      <p className="text-2xl font-bold">{Math.round(weather.main.feels_like)}°C</p>
                    </div>
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded">
                      <p className="text-gray-400">Humidity</p>
                      <p className="text-2xl font-bold">{weather.main.humidity}%</p>
                    </div>
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded">
                      <p className="text-gray-400">Wind Speed</p>
                      <p className="text-2xl font-bold">{weather.wind.speed} m/s</p>
                    </div>
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded">
                      <p className="text-gray-400">Pressure</p>
                      <p className="text-2xl font-bold">{weather.main.pressure} hPa</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {forecast && (
                <div className="card">
                  <h3 className="text-2xl font-bold mb-6">5-Day Forecast</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {forecast.list.filter((_, i) => i % 8 === 0).map((item, idx) => (
                      <div key={idx} className="bg-gray-700 bg-opacity-50 p-4 rounded text-center">
                        <p className="text-gray-400 text-sm mb-2">
                          {new Date(item.dt * 1000).toLocaleDateString()}
                        </p>
                        <p className="text-3xl mb-2">{getWeatherIcon(item.weather[0].description)}</p>
                        <p className="font-bold">{Math.round(item.main.temp)}°C</p>
                        <p className="text-gray-400 text-sm capitalize">{item.weather[0].main}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center">
              <p className="text-xl text-gray-400">Unable to load weather data. Please try again.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
