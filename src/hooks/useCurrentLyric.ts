import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import Lyric from '@/libs/lyric';
import useCurrentTime from './useCurrentTime';

const NO_LYRICS = '暂无歌词';

export default (params: IUseCurrentLyricParams) => {
  const { howl, lyric } = params;
  const [currentLyric, setCurrentLyric] = useState(NO_LYRICS);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const { currentTime } = useCurrentTime({ howl });

  useEffect(() => {
    if (!lyric) {
      setCurrentLyric(NO_LYRICS);
      return;
    }

    const { lines } = lyric;
    const len = lines.length;
    let currentIndex = len - 1;

    for (let i = 0; i < len; i++) {
      if (currentTime < lines[i].time) {
        currentIndex = Math.max(i - 1, 0);
        break;
      }
    }
    setCurrentLyric(lines[currentIndex].txt);
    setCurrentLyricIndex(currentIndex);
  }, [lyric, currentTime]);

  return {
    currentLyric,
    currentLyricIndex,
  };
};

interface IUseCurrentLyricParams {
  howl?: Howl;
  lyric?: Lyric;
}
