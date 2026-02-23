'use client'

import { useState, useEffect } from 'react'

const slides = [
  { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600', destination: 'Santorini, Grčka' },
  { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600', destination: 'Pariz, Francuska' },
  { url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600', destination: 'Antalija, Turska' },
  { url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600', destination: 'Rim, Italija' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600', destination: 'Švajcarski Alpi' },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length)
        setVisible(true)
      }, 700)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[580px] overflow-hidden">
      {/* Slika */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url(${slides[current].url})`,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/50" />

      {/* Tekst - pomeren dole zbog navbar overlaya */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 pt-16">
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          Telly<span className="text-purple-400">Travel</span>
        </h1>
        <p
          className="text-lg md:text-2xl text-gray-200 transition-all duration-700 delay-200"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {slides[current].destination}
        </p>
        <p
          className="text-sm md:text-base text-gray-300 mt-2 transition-all duration-700 delay-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          Pronađite savršen aranžman za vaš odmor
        </p>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setVisible(false); setTimeout(() => { setCurrent(i); setVisible(true) }, 300) }}
            className={`h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
          />
        ))}
      </div>
    </div>
  )
}