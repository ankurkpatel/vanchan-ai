import { useScope } from "@/lib/hooks/use-scope";

import { useEffect, useState } from "react";
const useTypingEffect = (
    text: string,
    duration: number,
    isTypeByLetter = false
  ) => {
    const [currentPosition, setCurrentPosition] = useState(0);
    const items = isTypeByLetter ? text.split("") : text?.split(" ");
  
    useEffect(() => {
      setCurrentPosition(0);
    }, [text]);
  
    useEffect(() => {
      if (currentPosition >= items?.length) return;
  
      const intervalId = setInterval(() => {
        setCurrentPosition((prevPosition) => prevPosition + 1);
      }, duration);
  
      return () => {
        clearInterval(intervalId);
      };
    }, [currentPosition, items, duration]);
  
    return items?.slice(0, currentPosition).join(isTypeByLetter ? "" : " ");
  };

const texts = [
  'Struggling to grasp any complex topics?',
  'Confused by any difficult concepts?',
  "Ask me anything, I'll help you understand",
  "Step by step",
  "Let's go, Select a book below to start",
];

type TextTypingEffectProps = {
  isTypeByLetter?: boolean
  duration?: number
};
const TIME_TO_FADE = 300;
const TIME_INTERVAL = 3000;
const TIME_PER_LETTER = 150;


export const TextTypingEffectWithTextsFadeOut = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [fadeText, setFadeText] = useState(true);
  const [fadeCircle, setFadeCircle] = useState(true);
  const textToShow = useTypingEffect(texts[textIndex], TIME_PER_LETTER, false);
  const [isMessageDisplayed, setIsMessageDisplayed] = useState(false);
  const {setIsShowScopeOptionsStatus} = useScope()

  const timeToTypeText = texts[textIndex]?.split(" ").length * TIME_PER_LETTER;

  const colors = ['text-red-600', 'text-green-600', 'text-blue-600', 'text-purple-600', 'text-pink-500', 'text-indigo-500', 'text-yellow-600'];

  useEffect(() => {

    if(textIndex === 0) {
      setTimeout(() => {}, 5000);}

    if(!isMessageDisplayed){
  
    const circleTimeout = setTimeout(() => {
      setFadeCircle(false);
    }, timeToTypeText + 2000);

    const textTimeout = setTimeout(() => {
      setFadeText(false);

      setTimeout(() => {
        setTextIndex((prevIndex) => {
          if(prevIndex >= texts.length - 1)  {
            
            setIsMessageDisplayed(true)
            setIsShowScopeOptionsStatus(true)
            return prevIndex + 1
          }
          else return prevIndex + 1}
        );
        setFadeCircle(true);
        setFadeText(true);
      }, TIME_TO_FADE);
    }, TIME_INTERVAL);
  
    return () => {
      clearTimeout(circleTimeout);
      clearTimeout(textTimeout);
    };

  }
    
  }, [textIndex]);

  return (
    <>
      <span
        className={`inline-flex items-center text-black duration-300 dark:text-white ${colors[textIndex]}  ${
          fadeText ? "opacity-1 translate-y-0" : "translate-y-2 opacity-0"
        }`}
        key={textIndex}
      >
        {textToShow}{" "}
        {!isMessageDisplayed &&<div
          className={`ml-2 h-3 w-3 rounded-full bg-black duration-300 dark:bg-white ${
            fadeCircle ? "" : "h-0 w-0 opacity-0"
          }`}
        />}
      </span>
    </>
  );
};