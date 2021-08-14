import { Howl } from 'howler';
import Lyric from '../libs/lyric';

export enum PlayMode {
  REORDER,
  REPEAT_LIST,
  REPEAT_ONE,
  RANDOM,
}

export interface ISong {
  name: string;
  url: string;
  duration: number;
  picurl: string;
  artistsname?: string;
  lyrics?: string | (() => string) | (() => Promise<string>);
}

export interface IMusic extends ISong {
  _howl?: Howl;
  locked?: boolean;
  _lyric?: Lyric;
}

export interface IMusicListContext {
  current?: IMusic;
  playList: IMusic[];
  playMode: PlayMode;
  isPlaying: boolean;
  playIndex: number;
  play(): void;
  pause(): void;
  toggle(): void;
  playPre(playImmediately?: boolean): void;
  playNext(playImmediately?: boolean): void;
  seekTo(value: number): void;
  playTo(index: number): void;
  remove(index: number): void;
  changePlayMode(mode: PlayMode): void;
  togglePlayMode(): void;
  replacePlayList(songs: ISong[]): void;
}
