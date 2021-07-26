---
mobile: false
nav:
  title: NormalPlayer
  path: /normal-player
---

## NormalPlayer

Demo:

```tsx
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
  <NormalPlayer
    list={list.map((item) => ({
      ...item,
      lyrics: () => getLyrics(item.lyrics),
    }))}
    onShare={() => alert('点击分享')}
  />
);
```
