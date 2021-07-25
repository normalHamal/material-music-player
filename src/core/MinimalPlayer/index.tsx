import React, { useEffect } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Slide,
  Typography,
  Dialog,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import { useBoolean, useMusicList } from '@/hooks';
import { MusicDetail, PlayList, ThemeContainer } from '@/core/Internal';
import { ISong } from '../common';
import { ThemeOptions } from '../Internal/ThemeContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    content: {
      flex: '1 0 auto',
      padding: theme.spacing(0.5),
      '&:last-child': {
        paddingBottom: theme.spacing(0.5),
      },
    },
    cover: {
      flex: 'none',
      width: 40,
      height: 40,
      margin: theme.spacing(1),
      borderRadius: theme.spacing(0.5),
    },
    ellipsis: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      width: 125,
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
}) as React.ComponentType<TransitionProps>;

const MinimalPlayer = (props: MinimalProps) => {
  const classes = useStyles();
  const musicListIns = useMusicList();
  const { className, list, onShare, themeOptions } = props;
  const { current, replacePlayList } = musicListIns;
  const {
    state: detailVisible,
    setTrue: showDetail,
    setFalse: hideDetail,
  } = useBoolean(false);
  const {
    state: listVisible,
    setTrue: showList,
    setFalse: hideList,
  } = useBoolean(false);

  const playPre = () => {
    musicListIns.playPre();
  };

  const playNext = () => {
    musicListIns.playNext();
  };

  const togglePlay = (e: React.MouseEvent) => {
    musicListIns.toggle();
    e.stopPropagation();
  };

  const togglePlayMode = () => {
    musicListIns.togglePlayMode();
  };

  useEffect(() => {
    replacePlayList(list);
  }, [list]);

  return (
    <ThemeContainer themeOptions={themeOptions}>
      <Card className={className}>
        <CardActionArea className={classes.root} onClick={showDetail}>
          <CardMedia
            className={classes.cover}
            image={current?.picurl}
            title={current?.name}
          />
          <CardContent className={classes.content}>
            <Typography
              variant="body2"
              color="textPrimary"
              className={classes.ellipsis}
            >
              {current?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {current?.artistsname}
            </Typography>
          </CardContent>
          <div>
            <IconButton aria-label="play/pause" onClick={togglePlay}>
              {musicListIns.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </div>
        </CardActionArea>
        <Dialog
          open={detailVisible}
          fullScreen={true}
          onClose={hideDetail}
          TransitionComponent={Transition}
          disableBackdropClick={true}
          maxWidth={false}
        >
          <MusicDetail
            onClose={hideDetail}
            onShowList={showList}
            isPlaying={musicListIns.isPlaying}
            isShowCloseBtn={true}
            isShowListBtn={true}
            isShowPlayModeBtn={true}
            source={current}
            onShare={onShare}
            playMode={musicListIns.playMode}
            togglePlayMode={togglePlayMode}
            playNext={playNext}
            playPre={playPre}
            togglePlay={togglePlay}
            seekTo={musicListIns.seekTo}
          />
        </Dialog>
        <PlayList
          {...musicListIns}
          visible={listVisible}
          onClose={hideList}
          isMini={true}
        />
      </Card>
    </ThemeContainer>
  );
};

interface MinimalProps {
  className?: string;
  list: ISong[];
  onShare?(song: ISong): void;
  themeOptions?: ThemeOptions;
}

export default MinimalPlayer;
