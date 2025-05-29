"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Shuffle, TimerReset } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { fetchRevisionById } from "@/lib/api/revisionApi";
import { Skeleton } from "@/components/ui/skeleton"; // You must have this component

type Flashcard = {
  question: string;
  answer: string;
};

export default function FlashcardRevision() {
  const { id } = useParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  useEffect(() => {
    const loadFlashcards = async () => {
      if (typeof id === "string") {
        try {
          const res = await fetchRevisionById(id);
          let data = res.data.body || [];
          if (shuffle) data = shuffleArray(data);
          setFlashcards(data);
        } catch (error) {
          console.error("Failed to load flashcards:", error);
          toast.error("Error loading flashcards.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadFlashcards();
  }, [id, shuffle]);

  useEffect(() => {
    if (autoAdvance) {
      const timer = setTimeout(() => {
        handleNext();
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [index, autoAdvance]);

  const shuffleArray = (array: Flashcard[]) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const handleNext = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-10 space-y-6">
        <Skeleton className="w-full max-w-2xl h-96 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <p className="text-center mt-10 text-red-500">No flashcards found.</p>
    );
  }

  return (
    
    <div className="h-full flex flex-col items-center justify-center py-10 space-y-10">
      
      {/* Flashcard progress */}
      <p className="text-muted-foreground text-sm">
        Flashcard {index + 1} of {flashcards.length}
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((index + 1) / flashcards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard container */}
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
          {/* Question */}
          <div
            className="absolute w-full h-full rounded-lg bg-white dark:bg-gray-900 border border-border p-6 flex flex-col justify-center items-center text-xl font-semibold text-black dark:text-white"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h2 className="text-lg font-bold mb-4">Flashcard {index + 1}</h2>
            {flashcards[index]?.question}
          </div>

          {/* Answer */}
          <div
            className="absolute w-full h-full rounded-lg bg-white dark:bg-gray-900 border border-border p-6 flex flex-col justify-center items-center text-xl font-semibold text-black dark:text-white"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <h2 className="text-lg font-bold mb-4">Flashcard {index + 1}</h2>
            {flashcards[index]?.answer}
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={handleFlip} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" /> Flip
        </Button>
        <Button onClick={handleNext}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant={shuffle ? "default" : "outline"}
          onClick={() => {
            setShuffle((prev) => !prev);
            setIndex(0);
          }}
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle
        </Button>
        <Button
          variant={autoAdvance ? "default" : "outline"}
          onClick={() => setAutoAdvance((prev) => !prev)}
        >
          <TimerReset className="w-4 h-4 mr-2" />
          Auto-advance
        </Button>
      </div>
    </div>
  );
}
