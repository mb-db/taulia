import { useState, useEffect } from 'react';
/* https://www.netlify.com/blog/2020/12/05/
building-a-custom-react-media-query-hook-for-more-
responsive-apps/?ck_subscriber_id=887763111

Hook for using media queries for conditional rendering
Usage example:
let isPageWide = useMediaQuery('(min-width: 800px)')
*/

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}
