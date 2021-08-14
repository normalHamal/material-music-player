import { useEffect, useState, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import Lyric from '../libs/lyric';

import { UNDEF, genRandomNumber, noop, setMediaSession } from '../core/util';
import { IMusic, IMusicListContext, ISong, PlayMode } from '../core/common';
import useBoolean from './useBoolean';
import useUpdateEffect from './useUpdateEffect';

enum PlayIndexStatus {
  DELETE_FROM_PLAYLIST = -1,
  TEMP_VAR = -2,
}

export default (): IMusicListContext => {
  const [current, setCurrent] = useState<IMusic>();
  const [playList, setPlayList] = useState<IMusic[]>([]);
  const [playIndex, setPlayIndex] = useState<number>(
    PlayIndexStatus.DELETE_FROM_PLAYLIST,
  );
  const {
    state: isPlaying,
    toggle,
    setTrue: play,
    setFalse: pause,
  } = useBoolean(false);
  const [playMode, setPlayMode] = useState<PlayMode>(PlayMode.REORDER);

  const playPre = (playImmediately?: boolean) => {
    if (!playList?.length) return;

    let index = PlayIndexStatus.TEMP_VAR;
    switch (playMode) {
      case PlayMode.REORDER:
      case PlayMode.REPEAT_LIST:
      case PlayMode.REPEAT_ONE:
        if (playIndex < 0) {
          index = 0;
        } else if (playIndex === 0) {
          index = playList.length - 1;
        } else {
          index = playIndex - 1;
        }
        break;
      case PlayMode.RANDOM:
        index = genRandomNumber(0, playList.length);
        while (index === playIndex) {
          index = genRandomNumber(0, playList.length);
        }
        break;
      default:
        break;
    }

    if (index !== PlayIndexStatus.TEMP_VAR) {
      setPlayIndex(index);
      if (playImmediately) {
        setTimeout(play, 0);
      }
    }
  };

  const playNext = (playImmediately?: boolean) => {
    if (!playList?.length) return;

    let index = PlayIndexStatus.TEMP_VAR;
    switch (playMode) {
      case PlayMode.REORDER:
      case PlayMode.REPEAT_LIST:
        if (playIndex === playList.length - 1) {
          index = 0;
        } else {
          index = playIndex + 1;
        }
        break;
      case PlayMode.REPEAT_ONE:
        const { _howl, ...rest } = playList[playIndex];
        setCurrent(rest);
        break;
      case PlayMode.RANDOM:
        index = genRandomNumber(0, playList.length);
        while (index === playIndex) {
          index = genRandomNumber(0, playList.length);
        }
        break;
      default:
        break;
    }

    if (index !== PlayIndexStatus.TEMP_VAR) {
      setPlayIndex(index);
      if (playImmediately) {
        setTimeout(play, 0);
      }
    }
  };

  const playTo = (index: number) => {
    setPlayIndex(index);
    setTimeout(play, 0);
  };

  const remove = (index: number) => {
    if (index >= 0 && index < playList.length) {
      playList.splice(index, 1);
      setPlayList(playList.slice());

      if (index === playIndex) {
        setPlayIndex(PlayIndexStatus.DELETE_FROM_PLAYLIST);
      } else if (playIndex > index) {
        // 保持当前播放歌曲状态不变
        setPlayIndex(playIndex - 1);
      }
    }
  };

  const seekTo = (value: number) => {
    current?._howl?.seek(value / 1000);
  };

  const changePlayMode = (mode: PlayMode) => {
    setPlayMode(mode);
  };

  const togglePlayMode = () => {
    setPlayMode((playMode + 1) % 4);
  };

  const createHowl = useCallback(
    (src: string) => {
      setMediaSession({
        music: current,
        play,
        pause,
        playNext,
        playPre,
      });
      const self = new Howl({
        src: [src],
        html5: true,
        preload: 'metadata',
        format: ['mp3'],
        onloaderror() {
          pause();
          current && (current.locked = true);
          console.error('歌曲资源加载失败');
        },
        onplayerror(soundId: number, error: unknown) {
          pause();
          console.error('歌曲播放异常');
        },
      });
      return self;
    },
    [current, PlayMode],
  );

  const replacePlayList = (songs: ISong[]) => {
    setPlayList(songs);
    setPlayIndex(0);
  };

  useEffect(() => {
    if (playIndex >= 0 && playIndex < playList.length) {
      setCurrent(playList[playIndex]);
    }
  }, [playIndex, playList]);

  useEffect(() => {
    if (current) {
      if (typeof current.lyrics !== 'undefined') {
        try {
          if (typeof current.lyrics === 'function') {
            Promise.resolve(current.lyrics()).then((lyrics) => {
              current._lyric = new Lyric(lyrics, noop);
            });
          } else {
            current._lyric = new Lyric(current.lyrics, noop);
          }
        } catch (e) {
          console.error(e);
        }
      }

      current._howl = createHowl(current.url);
      current._howl.load();
    }
    return () => {
      current && (current._lyric = UNDEF);
      current && (current._howl = UNDEF);
      Howler.unload();
    };
  }, [current]);

  useEffect(() => {
    const handleEnd = () => {
      if (playMode === PlayMode.REORDER && playIndex === playList.length - 1) {
        // 列表模式下播放完最后一首歌后停止
        pause();
      } else {
        playNext();
      }
    };
    current?._howl?.on('end', handleEnd);

    return () => {
      current?._howl?.off('end', handleEnd);
    };
  }, [current, playMode]);

  useUpdateEffect(() => {
    if (isPlaying) {
      if (current?.locked) {
        pause();
        // 重新加载资源
        current?._howl?.load();
      } else {
        current?._howl?.play();
      }
    } else {
      current?._howl?.pause();
    }
  }, [isPlaying, current]);

  return {
    current,
    playList,
    playMode,
    playIndex,
    isPlaying,
    play,
    pause,
    toggle,
    playPre,
    playNext,
    seekTo,
    playTo,
    remove,
    changePlayMode,
    togglePlayMode,
    replacePlayList,
  };
};
