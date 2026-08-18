import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', style }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const characters = text.split('');
  let charCount = 0;

  return (
    <p ref={ref} className={`relative ${className}`} style={{ ...style, wordBreak: 'break-word' }}>
      {words.map((word, wordIndex) => {
        const wordNode = (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIndex) => {
              const globalIndex = charCount++;
              return (
                <CharacterSpan
                  key={charIndex}
                  char={char}
                  index={globalIndex}
                  total={characters.length}
                  progress={scrollYProgress}
                />
              );
            })}
          </span>
        );
        charCount++; // Account for the space between words
        return (
          <React.Fragment key={wordIndex}>
            {wordNode}
            {wordIndex < words.length - 1 && <span> </span>}
          </React.Fragment>
        );
      })}
    </p>
  );
};

interface CharacterSpanProps {
  char: string;
  index: number;
  total: number;
  progress: any;
}

const CharacterSpan: React.FC<CharacterSpanProps> = ({ char, index, total, progress }) => {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span
        className="absolute left-0 top-0"
        style={{ opacity }}
      >
        {char}
      </motion.span>
    </span>
  );
};

export default AnimatedText;
