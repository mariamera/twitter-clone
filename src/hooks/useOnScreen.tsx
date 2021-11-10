import { useRef, useEffect, useState } from "react";
import throttle from "lodash/throttle";

/**
 * Check if an element is in viewport

 * @param {number} offset - Number of pixels up to the observable element from the top
 * @param {number} throttleMilliseconds - Throttle observable listener, in ms
 */
export default function useOnScreen<Element extends HTMLElement>(
  offset = 0,
  throttleMilliseconds = 100
): [Boolean, React.RefObject<Element>] {
  const [isVisible, setIsVisible] = useState(false);
  const currentElement = useRef(null) as any; //TODO: clean this 

  const onScroll = throttle(() => {
    if (!currentElement) {
      setIsVisible(false);
      return;
    }

    const top: number = currentElement.current!.getBoundingClientRect().top;

    setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
  }, throttleMilliseconds);

  useEffect(() => {
    document.addEventListener('scroll', onScroll, true);
    return () => document.removeEventListener('scroll', onScroll, true);
  });

  return [isVisible, currentElement];
}