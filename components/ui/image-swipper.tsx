'use client'

import React, { useRef, useState } from 'react'
import {
  LucideIcon
} from 'lucide-react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

// --- DATA STRUCTURE INTERFACE ---
interface CardData {
  id: number
  icon: LucideIcon
  title: string
}

// --- PROPS INTERFACE ---
interface ImageSwiperProps {
  cards: CardData[]
  cardWidth?: number
  cardHeight?: number
  className?: string
}

export const ImageSwiper: React.FC<ImageSwiperProps> = ({
  cards,
  cardWidth = 256,
  cardHeight = 352,
  className = ''
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null)
  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    Array.from({ length: cards.length }, (_, i) => i)
  )

  const handleSwipe = (index: number, direction: number) => {
    const threshold = 100
    if (Math.abs(direction) > threshold) {
      setTimeout(() => {
        setCardOrder(prev => [...prev.slice(1), prev[0]])
      }, 300)
    }
  }

  return (
    <section
      ref={cardStackRef}
      className={`relative grid place-content-center select-none ${className}`}
      style={{
        width: cardWidth + 32,
        height: cardHeight + 32,
        perspective: '1000px',
        touchAction: 'none'
      }}
    >
      {cardOrder.map((originalIndex, displayIndex) => {
        const card = cards[originalIndex]
        const Icon = card.icon

        const x = useMotionValue(0)
        const rotate = useTransform(x, [-200, 200], [-15, 15])
        const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])

        return (
          <motion.article
            key={card.id}
            className="image-card absolute cursor-grab active:cursor-grabbing
                       place-self-center border-2 border-slate-700 rounded-2xl
                       shadow-lg overflow-hidden will-change-transform bg-slate-800
                       flex flex-col items-center justify-center text-center px-4"
            drag={displayIndex === 0 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            style={{
              x,
              rotate,
              opacity,
              width: cardWidth,
              height: cardHeight,
              zIndex: cards.length - displayIndex,
              translateY: `${displayIndex * 10}px`,
              translateZ: `${-displayIndex * 45}px`
            }}
            onDragEnd={(_, info) => handleSwipe(displayIndex, info.offset.x)}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            <Icon className="w-20 h-20 text-white mb-4" />
            <h3 className="font-bold text-xl text-white drop-shadow-lg">{card.title}</h3>
          </motion.article>
        )
      })}
    </section>
  )
}
