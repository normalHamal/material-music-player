import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Howler } from 'howler';
import clsx from 'clsx';
import {
  CardMedia,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Slider,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import ExpandLess from '@material-ui/icons/ExpandMore';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ListIcon from '@material-ui/icons/ListSharp';
import RepeatIcon from '@material-ui/icons/Repeat';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import TransformIcon from '@material-ui/icons/Transform';
import RepeatOneIcon from '@material-ui/icons/RepeatOne';
import VolumeUp from '@material-ui/icons/VolumeUp';
import ShareIcon from '@material-ui/icons/Share';

import { useBoolean, useResponsive, useCurrentLyric } from '@/hooks';
import ProcessBar from './ProcessBar';
import { noop } from '../util';
import { IMusic, ISong, PlayMode } from '../common';
import { PlayModeHN } from '../constants';
import PlayWrapImg from './PlayWrapPng';

const MAX_WIDTH_PC_MODE = 884;

const useStyles = makeStyles((theme: Theme) => {
  const mobileBreakPoint = theme.breakpoints.down(MAX_WIDTH_PC_MODE);
  return createStyles({
    root: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
      '&>*, *::before, *::after': {
        boxSizing: 'inherit',
      },
    },
    backup: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      transition: 'all .3s',
    },
    main: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
    },
    topbar: {
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    header: {
      flex: 'none',
    },
    content: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: theme.spacing(4, 0),
      // 设置一个基础高度，以便于flex缩放
      height: 100,
      overflow: 'hidden',
      [mobileBreakPoint]: {
        flexDirection: 'column',
      },
    },
    controls: {
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0, 4),
      [mobileBreakPoint]: {
        padding: theme.spacing(0, 4, 2),
      },
    },
    bar: {
      margin: theme.spacing(0, 4),
      [mobileBreakPoint]: {
        margin: 0,
      },
    },
    cover: {
      position: 'relative',
      width: 350,
      height: 350,
      backgroundSize: '230px 230px',
      borderRadius: '50%',
      marginRight: theme.spacing(4),
      [theme.breakpoints.down('xs')]: {
        marginRight: 0,
        width: 250,
        height: 250,
        backgroundSize: '160px 160px',
      },
    },
    coverWrap: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 350,
      height: 350,
      backgroundImage: `url(${PlayWrapImg})`,
      backgroundSize: 'contain',
      [theme.breakpoints.down('xs')]: {
        width: 250,
        height: 250,
      },
    },
    rotateRight: {
      animation: 'rotateRight 30s linear infinite',
    },
    volume: {
      width: 200,
      margin: theme.spacing(0, 1),
    },
    lyricWrapper: {
      flex: 'auto',
      height: 500,
      maxWidth: 500,
      overflow: 'scroll',
      cursor: 'grab',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    empty: {
      height: 225,
      [mobileBreakPoint]: {
        maxHeight: '20vh',
      },
    },
    ellipsis: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    playOrPauseIcon: {
      width: 48,
      height: 48,
    },
  });
});

const Detail = (props: IDetailProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(MAX_WIDTH_PC_MODE));
  const {
    seekTo,
    onClose = noop,
    onShowList = noop,
    togglePlayMode = noop,
    playNext = noop,
    playPre = noop,
    togglePlay = noop,
    renderMoreBtn = noop,
    onShare,
    isShowPlayBtn = true,
    isShowShareBtn = true,
    isShowNextBtn = true,
    isShowPreBtn = true,
    isShowCloseBtn = false,
    isShowListBtn = false,
    isShowPlayModeBtn = false,
    playMode = PlayMode.REORDER,
    source = {} as IMusic,
    isPlaying,
  } = props;
  const lyricWrapRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(Howler.volume());
  const { currentLyricIndex } = useCurrentLyric({
    howl: source._howl,
    lyric: source._lyric,
  });
  const {
    state: lyricVisible,
    setTrue: showLyric,
    setFalse: hideLyric,
  } = useBoolean(false);
  const { visualHeight } = useResponsive({ offsetHeight: 0 });

  const handleVolumeChange = (event: object, value: number | number[]) => {
    Howler.volume(value as number);
    setVolume(value as number);
  };

  const handleShare = () => {
    onShare && onShare(source);
  };

  const PlayModeBtn = useCallback(() => {
    const PlayModeIcon = [
      PlaylistPlayIcon,
      RepeatIcon,
      RepeatOneIcon,
      TransformIcon,
    ][playMode];
    const playModeDisc = PlayModeHN[playMode];

    return (
      <IconButton
        aria-label="mode"
        onClick={togglePlayMode}
        title={playModeDisc}
        style={{ order: isMobile ? -1 : 4 }}
      >
        <PlayModeIcon />
      </IconButton>
    );
  }, [playMode, isMobile]);

  useEffect(() => {
    // 滚动歌词
    if (lyricWrapRef.current) {
      const currentLyricEle = lyricWrapRef.current.querySelector(
        `li:nth-child(${currentLyricIndex + 2})`, // 提前让下一个item滚动
      );
      currentLyricEle?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLyricIndex, source._lyric?.lines]);

  return (
    <div
      className={classes.root}
      style={isMobile ? { height: visualHeight } : {}}
    >
      <div className={classes.backup} />
      <div className={classes.main}>
        <div className={classes.topbar}>
          {isShowCloseBtn ? (
            <IconButton aria-label="close" onClick={onClose}>
              <ExpandLess />
            </IconButton>
          ) : null}
          {isMobile ? (
            <div style={{ flex: 1, width: 100 }}>
              <Typography
                variant="body1"
                align="center"
                className={classes.ellipsis}
              >
                {source.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                className={classes.ellipsis}
              >
                {source.artistsname}
              </Typography>
            </div>
          ) : null}
          {isShowShareBtn ? (
            <IconButton aria-label="share" onClick={handleShare}>
              <ShareIcon />
            </IconButton>
          ) : null}
        </div>
        {!isMobile ? (
          <div className={classes.header}>
            <Typography component="h5" variant="h5" align="center">
              {source.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              align="center"
            >
              {source.artistsname}
            </Typography>
          </div>
        ) : null}
        <div className={classes.content}>
          {!lyricVisible || !isMobile ? (
            <CardMedia
              onClick={showLyric}
              className={clsx(classes.cover, classes.rotateRight)}
              image={source.picurl}
              title={source.name}
              style={{
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <div className={classes.coverWrap} />
            </CardMedia>
          ) : null}
          {lyricVisible || !isMobile ? (
            <div
              ref={lyricWrapRef}
              className={classes.lyricWrapper}
              onClick={hideLyric}
            >
              <ul style={{ padding: 0 }}>
                <li className={classes.empty} />
                {(source._lyric?.lines || []).map((line, index) => (
                  <Typography
                    component="li"
                    variant={isMobile ? 'body1' : 'h6'}
                    color={
                      index === currentLyricIndex
                        ? 'textPrimary'
                        : 'textSecondary'
                    }
                    align="center"
                    style={{
                      lineHeight: 2.75,
                      fontWeight: index === currentLyricIndex ? 900 : 400,
                    }}
                  >
                    {line.txt}
                  </Typography>
                ))}
                {source._lyric?.lines ? null : (
                  <Typography
                    component="li"
                    variant="h6"
                    color={'textSecondary'}
                    align="center"
                    style={{ lineHeight: 2.75, fontWeight: 400 }}
                  >
                    暂无歌词信息~
                  </Typography>
                )}
                <li className={classes.empty} />
              </ul>
            </div>
          ) : null}
        </div>
        {isMobile ? (
          <div style={{ flex: 'none', padding: '0 28px' }}>
            <ProcessBar
              className={classes.bar}
              source={source}
              seekTo={seekTo}
            />
          </div>
        ) : null}
        <div className={classes.controls}>
          {isShowPlayModeBtn ? <PlayModeBtn /> : null}
          {isShowPreBtn ? (
            <IconButton aria-label="previous" onClick={playPre}>
              {theme.direction === 'rtl' ? (
                <SkipNextIcon />
              ) : (
                <SkipPreviousIcon />
              )}
            </IconButton>
          ) : null}
          {isShowPlayBtn ? (
            <IconButton aria-label="play/pause" onClick={togglePlay}>
              {isPlaying ? (
                <PauseIcon className={classes.playOrPauseIcon} />
              ) : (
                <PlayArrowIcon className={classes.playOrPauseIcon} />
              )}
            </IconButton>
          ) : null}
          {isShowNextBtn ? (
            <IconButton aria-label="next" onClick={playNext}>
              {theme.direction === 'rtl' ? (
                <SkipPreviousIcon />
              ) : (
                <SkipNextIcon />
              )}
            </IconButton>
          ) : null}
          {!isMobile ? (
            <ProcessBar
              className={classes.bar}
              source={source}
              seekTo={seekTo}
            />
          ) : null}
          {!isMobile ? (
            <Grid
              container={true}
              spacing={2}
              className={classes.volume}
              alignItems="center"
            >
              <Grid item={true}>
                <VolumeUp color="action" />
              </Grid>
              <Grid item={true} xs={true}>
                <Slider
                  value={volume}
                  min={0}
                  step={0.001}
                  max={1}
                  onChange={handleVolumeChange}
                />
              </Grid>
            </Grid>
          ) : null}
          {isShowListBtn ? (
            <IconButton
              aria-label="list"
              onClick={onShowList}
              style={{ order: 5 }}
            >
              <ListIcon />
            </IconButton>
          ) : null}
          {renderMoreBtn(source)}
        </div>
      </div>
    </div>
  );
};

interface IDetailProps {
  isShowPlayBtn?: boolean;
  isShowShareBtn?: boolean;
  isShowPreBtn?: boolean;
  isShowNextBtn?: boolean;
  isShowCloseBtn?: boolean;
  isShowListBtn?: boolean;
  isShowPlayModeBtn?: boolean;
  playMode?: PlayMode;
  isPlaying: boolean;
  source?: IMusic;
  onClose?(): void;
  onShowList?(): void;
  onShare?(song: ISong): void;
  seekTo(value: number): void;
  playPre?(): void;
  playNext?(): void;
  togglePlay?(e: React.MouseEvent): void;
  togglePlayMode?(): void;
  renderMoreBtn?(source: IMusic): React.ReactNode;
}

export default Detail;
