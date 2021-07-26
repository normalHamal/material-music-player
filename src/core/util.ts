import { IMusic } from './common';

interface IMediaSessionParams {
  music?: IMusic;
  play?(): void;
  pause?(): void;
  playPre?(): void;
  playNext?(): void;
}

// 允许 //xxx.com/xxx
export const checkIfUrl = (u: string): boolean =>
  new RegExp(
    '^(https?://|ftp://|file://|//)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
  ).test(u);

export const leftPad = (
  str: number | string,
  len: number,
  ch: string,
): string => {
  return String(str).padStart(len, ch);
};

// example: 57210 => "00:57"
export const ms2HS = (duration: number) => {
  const seconds = (duration / 1000) >> 0;
  return `${leftPad(Math.floor(seconds / 60), 2, '0')}:${leftPad(
    seconds % 60,
    2,
    '0',
  )}`;
};

export const genRandomNumber = (from: number, to: number) => {
  if (from >= to) throw new Error('params "to" should be bigger than "from"');
  return (from + Math.random() * (to - from)) >> 0;
};

// 兼容新版iPad(Mac OS)
export const isMobile = () =>
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
    navigator.userAgent,
  ) ||
  ('ontouchend' in document && /Mac OS X/i.test(navigator.userAgent));

export const noop = () => {};
export const UNDEF = void 0;
export const isNullOrUndefined = (val: any): boolean =>
  [0, '', false, NaN].every((_) => !Object.is(_, val)) &&
  Boolean(val) === false;

export const setMediaSession = (params: IMediaSessionParams) => {
  const {
    music,
    play = noop,
    pause = noop,
    playPre = noop,
    playNext = noop,
  } = params;

  const navigator = window.navigator as any;
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new (window as any).MediaMetadata({
      title: music?.name,
      artist: music?.artistsname,
      // album: '',
      artwork: [
        {
          src: music?.picurl,
          sizes: '200x200',
          type: 'image/jpeg',
        },
      ],
    });
    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('previoustrack', playPre);
    navigator.mediaSession.setActionHandler('nexttrack', playNext);
  }
};

export default {
  checkIfUrl,
  leftPad,
  ms2HS,
  genRandomNumber,
  isMobile,
  noop,
  UNDEF,
  isNullOrUndefined,
  setMediaSession,
};
