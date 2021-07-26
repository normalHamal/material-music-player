---
mobile: false
nav:
  title: NormalPlayer
  path: /normal-player
---

# NormalPlayer

## 普通用法

demo:

```tsx
/**
 * iframe: 768
 */
import React from 'react';
import { NormalPlayer } from 'material-music-player';

const list = [
  {
    id: 185929,
    name: '可爱女人',
    picurl:
      'http://p1.music.126.net/bbSPH2d48rRnNsIuazuAbQ==/109951165564940386.jpg',
    duration: 239000,
    artistsname: '周杰伦',
    lyrics: 'https://normalhamal.online/music/163/song/media?id=186145',
    url: 'https://normalhamal.gitee.io/music2/zjl/186145.mp3',
  },
  {
    id: 185930,
    name: '黑色幽默',
    picurl:
      'http://p1.music.126.net/bbSPH2d48rRnNsIuazuAbQ==/109951165564940386.jpg',
    duration: 283000,
    artistsname: '周杰伦',
    lyrics: 'https://normalhamal.online/music/163/song/media?id=185930',
    url: 'https://normalhamal.gitee.io/music1/zjl/185930.mp3',
  },
  {
    id: 185931,
    name: '忍者',
    picurl:
      'http://p1.music.126.net/bbSPH2d48rRnNsIuazuAbQ==/109951165564940386.jpg',
    duration: 159000,
    artistsname: '周杰伦',
    lyrics: 'https://normalhamal.online/music/163/song/media?id=186122',
    url: 'https://normalhamal.gitee.io/music2/zjl/186122.mp3',
  },
];

const getLyrics = (url?: string): Promise<string> => {
  if (!url) return Promise.resolve('');

  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      const { lyric, code } = res;
      if (code != 200) return Promise.reject(new Error('请求歌词数据失败'));

      return lyric;
    });
};

export default () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '768px',
    }}
  >
    <NormalPlayer
      list={list.map((item) => ({
        ...item,
        lyrics: () => getLyrics(item.lyrics),
      }))}
      onShare={() => alert('点击分享')}
    />
  </div>
);
```

## 暗黑模式

demo:

```tsx
/**
 * iframe: 768
 */
import React from 'react';
import { NormalPlayer } from 'material-music-player';

const list = [
  {
    id: 185929,
    name: '可爱女人',
    picurl:
      'http://p1.music.126.net/bbSPH2d48rRnNsIuazuAbQ==/109951165564940386.jpg',
    duration: 239000,
    artistsname: '周杰伦',
    lyrics: 'https://normalhamal.online/music/163/song/media?id=186145',
    url: 'https://normalhamal.gitee.io/music2/zjl/186145.mp3',
  },
  {
    id: 185930,
    name: '黑色幽默',
    picurl:
      'http://p1.music.126.net/bbSPH2d48rRnNsIuazuAbQ==/109951165564940386.jpg',
    duration: 283000,
    artistsname: '周杰伦',
    lyrics: 'https://normalhamal.online/music/163/song/media?id=185930',
    url: 'https://normalhamal.gitee.io/music1/zjl/185930.mp3',
  },
  {
    id: 185931,
    name: '忍者',
    picurl:
      'http://p1.music.126.net/bbSPH2d48rRnNsIuazuAbQ==/109951165564940386.jpg',
    duration: 159000,
    artistsname: '周杰伦',
    lyrics: 'https://normalhamal.online/music/163/song/media?id=186122',
    url: 'https://normalhamal.gitee.io/music2/zjl/186122.mp3',
  },
];

const getLyrics = (url?: string): Promise<string> => {
  if (!url) return Promise.resolve('');

  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      const { lyric, code } = res;
      if (code != 200) return Promise.reject(new Error('请求歌词数据失败'));

      return lyric;
    });
};

export default () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '768px',
    }}
  >
    <NormalPlayer
      list={list.map((item) => ({
        ...item,
        lyrics: () => getLyrics(item.lyrics),
      }))}
      onShare={() => alert('点击分享')}
      themeType="dark"
    />
  </div>
);
```

## 自定义主题

demo:

```tsx
/**
 * iframe: 768
 */
import React from 'react';
import { NormalPlayer } from 'material-music-player';

const list = [
  {
    id: 185929,
    name: '可爱女人',
    picurl:
      'http://p1.music.126.net/bbSPH2d48rRnNsIuazuAbQ==/109951165564940386.jpg',
    duration: 239000,
    artistsname: '周杰伦',
    lyrics: 'https://normalhamal.online/music/163/song/media?id=186145',
    url: 'https://normalhamal.gitee.io/music2/zjl/186145.mp3',
  },
  {
    id: 185930,
    name: '黑色幽默',
    picurl:
      'http://p1.music.126.net/bbSPH2d48rRnNsIuazuAbQ==/109951165564940386.jpg',
    duration: 283000,
    artistsname: '周杰伦',
    lyrics: 'https://normalhamal.online/music/163/song/media?id=185930',
    url: 'https://normalhamal.gitee.io/music1/zjl/185930.mp3',
  },
  {
    id: 185931,
    name: '忍者',
    picurl:
      'http://p1.music.126.net/bbSPH2d48rRnNsIuazuAbQ==/109951165564940386.jpg',
    duration: 159000,
    artistsname: '周杰伦',
    lyrics: 'https://normalhamal.online/music/163/song/media?id=186122',
    url: 'https://normalhamal.gitee.io/music2/zjl/186122.mp3',
  },
];

const getLyrics = (url?: string): Promise<string> => {
  if (!url) return Promise.resolve('');

  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      const { lyric, code } = res;
      if (code != 200) return Promise.reject(new Error('请求歌词数据失败'));

      return lyric;
    });
};

export default () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '768px',
    }}
  >
    <NormalPlayer
      list={list.map((item) => ({
        ...item,
        lyrics: () => getLyrics(item.lyrics),
      }))}
      onShare={() => alert('点击分享')}
      themeType="light"
      themeOptions={{
        light: {
          primary: {
            light: '#dd33fa',
            main: '#d500f9',
            dark: '#9500ae',
            contrastText: '#000',
          },
          background: {
            default: '#ff1744',
            level1: '#ff1744',
            level2: '#b2102f',
            paper: '#ff4569',
          },
          text: {
            disabled: 'rgba(255, 255, 255, 0.38)',
            hint: 'rgba(255, 255, 255, 0.38)',
            primary: 'rgba(255, 255, 255, 0.87)',
            secondary: 'rgba(255, 255, 255, 0.54)',
          },
          action: {
            activatedOpacity: 0.12,
            active: 'rgba(213, 0, 249, 0.54)',
            disabled: 'rgba(213, 0, 249, 0.26)',
            disabledBackground: 'rgba(213, 0, 249, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(213, 0, 249, 0.12)',
            focusOpacity: 0.12,
            hover: 'rgba(213, 0, 249, 0.04)',
            hoverOpacity: 0.04,
            selected: 'rgba(213, 0, 249, 0.08)',
            selectedOpacity: 0.08,
          },
        },
      }}
    />
  </div>
);
```
