---
nav:
  title: 组件
  path: /
---

## MinimalPlayer

Demo:

```tsx
import React from 'react';
import { MinimalPlayer } from 'material-music-player';

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

const getLyrics = (url?: string): Promise<string | undefined> => {
  if (!url) return Promise.resolve();

  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      const { lyric, code } = res;
      if (code != 200) Promise.reject(new Error('请求歌词数据失败'));

      return lyric;
    });
};

export default () => (
  <>
    <h5>正常主题，会自动检测当前用户的操作系统是否为深色主题来切换</h5>
    <MinimalPlayer
      list={list.map((item) => ({
        ...item,
        lyrics: () => getLyrics(item.lyrics),
      }))}
      onShare={() => alert('点击分享')}
    />
  </>
);
```
