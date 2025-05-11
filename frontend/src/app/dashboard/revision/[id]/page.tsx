"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

const flashcards = [
  {
    front: "What is React?",
    back: "A JavaScript library for building user interfaces."
  },
  {
    front: "What is a component?",
    back: "Reusable piece of UI logic in React."
  },
  {
    front: "What is a hook?",
    back: "A special function to use state and other React features."
  }
]

export default function FlashcardRevision() {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const handleNext = () => {
    setFlipped(false)
    setIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handleFlip = () => {
    setFlipped((prev) => !prev)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center py-10 space-y-10">
      <div
        className="w-full max-w-2xl h-96 relative cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full rounded-lg bg-white border border-border p-6 flex flex-col justify-center items-center text-xl font-semibold backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h2 className="text-lg font-bold mb-4">Flashcard {index + 1}</h2>
            {flashcards[index].front}
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full rounded-lg bg-white border border-border p-6 flex flex-col justify-center items-center text-xl font-semibold"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden"
            }}
          >
            <h2 className="text-lg font-bold mb-4">Flashcard {index + 1}</h2>
            {flashcards[index].back}
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleFlip} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" /> Flip
        </Button>
        <Button onClick={handleNext}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
