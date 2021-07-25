import { IMusic } from './common';

interface IMediaSessionParams {
  music?: IMusic;
  play?(): void;
  pause?(): void;
  playPre?(): void;
  playNext?(): void;
}

// 如果执行该方法的元素位于类似Modal、Popper、Dialog等组件内，必须提供container参数
export const copy = (content: string, container?: HTMLElement | null) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(content);
  } else {
    const parentElem = container || document.body;
    const fakeElem = document.createElement('textarea');
    fakeElem.textContent = content;
    // style
    fakeElem.style.border = '0';
    fakeElem.style.padding = '0';
    fakeElem.style.margin = '0';
    fakeElem.style.position = 'absolute';
    fakeElem.style.right = '-9999px';
    fakeElem.style.top = `${
      window.pageYOffset || document.documentElement.scrollTop
    }px`;
    // copy
    parentElem.appendChild(fakeElem);
    fakeElem.setAttribute('readonly', '');
    fakeElem.select();
    fakeElem.setSelectionRange(0, content.length);
    fakeElem.removeAttribute('readonly');
    document.execCommand('copy');
    parentElem.removeChild(fakeElem);
  }
};

// 允许 //xxx.com/xxx
export const checkIfUrl = (u: string): boolean =>
  new RegExp(
    '^(https?://|ftp://|file://|//)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
  ).test(u);

export const formatFileSize = (size: number) => {
  const scale = 1024;
  const digitList = ['KB', 'MB'];
  let _integer = size / scale;
  let digit = 0;
  while (_integer > scale) {
    _integer = _integer / scale;
    digit++;
  }
  return `${_integer.toFixed(2)}${digitList[digit]}`;
};

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

export const findLastIndex = function <T>(arr: T[], cb: (item: T) => boolean) {
  const { length } = arr;

  for (let i = length - 1; i >= 0; i--) {
    if (cb.call(null, arr[i])) {
      return i;
    }
  }

  return -1;
};
// 兼容新版iPad(Mac OS)
export const isMobile = () =>
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
    navigator.userAgent,
  ) ||
  ('ontouchend' in document && /Mac OS X/i.test(navigator.userAgent));
export const isSafari = () =>
  /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);

export const toFixed = (num: string | number, fractionDigits: number = 0) =>
  Number(num).toFixed(fractionDigits);
export const noop = () => {};
export const UNDEF = void 0;
export const isNullOrUndefined = (val: any): boolean =>
  [0, '', false, NaN].every((_) => !Object.is(_, val)) &&
  Boolean(val) === false;

export const formatDuration = (duration: number | string) => {
  const min = (+duration / 60000) >> 0;
  const second = ((+duration - min * 60000) / 1000) >> 0;
  return `${min}分钟${second}秒`;
};

export const extname = (url: string) => url.match(/(\.\w+)$/)?.[1];

export const countScrollTop = (container: HTMLElement | Window | null) => {
  if (!container) return 0;

  if (container instanceof HTMLElement) {
    return container.scrollTop;
  }

  return container.pageYOffset;
};

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
          src: `${music?.picurl}?param=200y200`,
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
  copy,
  checkIfUrl,
  leftPad,
  ms2HS,
  genRandomNumber,
  findLastIndex,
  isMobile,
  isSafari,
  noop,
  UNDEF,
  toFixed,
  isNullOrUndefined,
  extname,
  formatDuration,
  countScrollTop,
  setMediaSession,
};
