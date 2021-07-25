import { useEffect, useState } from 'react';
import { Howl } from 'howler';

export default (params: IUseCurrentTimeParams) => {
  const { howl } = params;
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!howl) {
      setCurrentTime(0);
      setIsPlaying(false);
      return;
    }

    let rafId = -1;
    const state = howl.state();
    const refreshCurrentTime = () => {
      if (howl.state() !== 'unloaded') {
        setCurrentTime(((howl.seek() as number) * 1000) >> 0);
      }
      // 这里如果取howl.playing()会出现歌曲在临近播放完毕时，值就为false了
      // 所以改为从state里的isPlaying取
      if (isPlaying) {
        if (rafId > -1) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(refreshCurrentTime);
      }
    };
    const updateState = () => {
      setIsPlaying(howl.playing());
    };

    updateState();
    if (howl.playing()) {
      refreshCurrentTime();
    } else {
      setCurrentTime(
        state === 'loaded' ? (((howl.seek() as number) ?? 0) * 1000) >> 0 : 0,
      );
    }

    howl.on('seek', refreshCurrentTime);
    howl.on('play', updateState);
    howl.on('pause', updateState);
    howl.on('loaderror', updateState);
    howl.on('playerror', updateState);

    return () => {
      if (rafId > -1) cancelAnimationFrame(rafId);
      howl.off('seek', refreshCurrentTime);
      howl.off('play', updateState);
      howl.off('pause', updateState);
      howl.off('loaderror', updateState);
      howl.off('playerror', updateState);
    };
  }, [howl, isPlaying]);

  return {
    currentTime,
  };
};

interface IUseCurrentTimeParams {
  howl?: Howl;
}
