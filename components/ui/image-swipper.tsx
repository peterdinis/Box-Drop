'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface CardData {
  id: number
  icon: LucideIcon
  title: string
}

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
  const [activeCards, setActiveCards] = useState<CardData[]>(cards)
  const [dismissedId, setDismissedId] = useState<number | null>(null)

  // ✅ Motion hooky pre každý card (raz inicializované)
  const [motionStates] = useState(() =>
    cards.map(() => {
      const x = useMotionValue(0)
      const rotate = useTransform(x, [-200, 200], [-15, 15])
      const opacity = useTransform(x, [-300, 0, 300], [0, 1, 0])
      return { x, rotate, opacity }
    })
  )

  const handleSwipe = (cardId: number, offsetX: number) => {
    const threshold = 100
    if (offsetX > threshold || offsetX < -threshold) {
      setDismissedId(cardId)
      setTimeout(() => {
        setActiveCards(prev => prev.filter(card => card.id !== cardId))
        setDismissedId(null)
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
      <AnimatePresence>
        {activeCards.map((card, index) => {
          const Icon = card.icon
          const isTop = index === 0
          const motionData = motionStates[card.id % motionStates.length] // zaruč index
          const { x, rotate, opacity } = motionData

          return (
            <motion.article
              key={card.id}
              className="image-card absolute cursor-grab active:cursor-grabbing
                         place-self-center border-2 border-slate-700 rounded-2xl
                         shadow-lg overflow-hidden will-change-transform bg-slate-800
                         flex flex-col items-center justify-center text-center px-4"
              drag={isTop ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              style={{
                x,
                rotate,
                opacity,
                width: cardWidth,
                height: cardHeight,
                zIndex: activeCards.length - index,
                translateY: `${index * 10}px`,
                translateZ: `${-index * 45}px`
              }}
              onDragEnd={(_, info) => {
                if (isTop) handleSwipe(card.id, info.offset.x)
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                x: dismissedId === card.id
                  ? (x.get() < 0 ? -500 : 500)
                  : 0,
                opacity: 0,
                rotate: dismissedId === card.id
                  ? (x.get() < 0 ? -20 : 20)
                  : 0,
                transition: { duration: 0.3 }
              }}
            >
              <Icon className="w-20 h-20 text-white mb-4" />
              <h3 className="font-bold text-xl text-white drop-shadow-lg">{card.title}</h3>
            </motion.article>
          )
        })}
      </AnimatePresence>
    </section>
  )
}
