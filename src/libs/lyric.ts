/**
 * 修复bugs：
 * https://github.com/ustbhuangyi/lyric-parser/issues/1
 */

type Tags = {
  album: string;
  artist: string;
  by: string;
  offset: string;
  title: string;
  [props: string]: string;
};

const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

const STATE_PAUSE = 0;
const STATE_PLAYING = 1;

const tagRegMap: Tags = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by',
};

function noop() {}

export default class Lyric {
  lrc: string;
  tags: Tags;
  lines: Array<{ time: number; txt: string }>;
  handler: (params: { lineNum: number; txt: string }) => void;
  state: number;
  startStamp: number = 0;
  pauseStamp: number = 0;
  curNum: number = 0;
  curLine: number = 0;
  timer: any = -1;

  constructor(lrc: string, hanlder = noop) {
    this.lrc = lrc;
    this.tags = {} as Tags;
    this.lines = [];
    this.handler = hanlder;
    this.state = STATE_PAUSE;

    this._init();
  }

  _init() {
    this._initTag();

    this._initLines();
  }

  _initTag() {
    for (let tag in tagRegMap) {
      const matches = this.lrc.match(
        new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'),
      );
      this.tags[tag] = (matches && matches[1]) || '';
    }
  }

  _initLines() {
    const lines = this.lrc.split('\n');
    const offset = parseInt(this.tags['offset']) || 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let result = timeExp.exec(line);
      if (result) {
        const txt = line.replace(timeExp, '').trim();
        const thirdResult = result[3] || '0';
        let length = thirdResult.length;
        let __thirdResult = parseInt(thirdResult);
        __thirdResult = length > 2 ? __thirdResult : __thirdResult * 10;
        if (txt) {
          this.lines.push({
            time:
              Number(result[1]) * 60 * 1000 +
              Number(result[2]) * 1000 +
              __thirdResult +
              offset,
            txt,
          });
        }
      }
    }

    this.lines.sort((a, b) => {
      return a.time - b.time;
    });
  }

  _findCurNum(time: number) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i;
      }
    }
    return this.lines.length - 1;
  }

  _callHandler(i: number) {
    if (i < 0) {
      return;
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i,
    });
  }

  _playRest() {
    let line = this.lines[this.curNum];
    let delay = line.time - (+new Date() - this.startStamp);

    this.timer = setTimeout(() => {
      this._callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest();
      }
    }, delay);
  }

  play(startTime = 0, skipLast?: boolean) {
    if (!this.lines.length) {
      return;
    }
    this.state = STATE_PLAYING;

    this.curNum = this._findCurNum(startTime);
    this.startStamp = +new Date() - startTime;

    if (!skipLast) {
      this._callHandler(this.curNum - 1);
    }

    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer);
      this._playRest();
    }
  }

  togglePlay() {
    var now = +new Date();
    if (this.state === STATE_PLAYING) {
      this.stop();
      this.pauseStamp = now;
    } else {
      this.state = STATE_PLAYING;
      this.play((this.pauseStamp || now) - (this.startStamp || now), true);
      this.pauseStamp = 0;
    }
  }

  stop() {
    this.state = STATE_PAUSE;
    clearTimeout(this.timer);
  }

  seek(offset: number) {
    this.play(offset);
  }
}
