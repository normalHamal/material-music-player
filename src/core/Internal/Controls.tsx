import React, { useCallback } from 'react';
import clsx from 'clsx';
import { IconButton as MuiIconButton, Theme } from '@material-ui/core';
import {
  makeStyles,
  createStyles,
  withStyles,
  useTheme,
} from '@material-ui/core/styles';

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import ListIcon from '@material-ui/icons/ListSharp';
import RepeatIcon from '@material-ui/icons/Repeat';
import RepeatOneIcon from '@material-ui/icons/RepeatOne';
import TransformIcon from '@material-ui/icons/Transform';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import { IMusicListContext } from '../common';
import { PlayModeHN } from '../constants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    playerControls: {
      position: 'absolute',
      top: 84,
      transform: 'translateY(-50%)',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
    },
    playOrPauseIcon: {
      height: 38,
      width: 38,
    },
    otherIcon: {
      height: 20,
      width: 20,
    },
  }),
);

const IconButton = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiIconButton);

const Controls = (props: ControlsProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const playPre = () => {
    props.playPre();
  };

  const playNext = () => {
    props.playNext();
  };

  const togglePlay = () => {
    props.toggle();
  };

  const togglePlayMode = () => {
    props.togglePlayMode();
  };

  const showPlayList = () => {
    props.onShowList();
  };

  const PlayModeBtn = useCallback(() => {
    const PlayModeIcon = [
      PlaylistPlayIcon,
      RepeatIcon,
      RepeatOneIcon,
      TransformIcon,
    ][props.playMode];
    const playModeDisc = PlayModeHN[props.playMode];

    return (
      <IconButton
        aria-label="mode"
        onClick={togglePlayMode}
        title={playModeDisc}
      >
        <PlayModeIcon className={classes.otherIcon} />
      </IconButton>
    );
  }, [props.playMode]);

  return (
    <div className={clsx(classes.controls, props.className)}>
      <PlayModeBtn />
      <IconButton aria-label="previous" onClick={playPre}>
        {theme.direction === 'rtl' ? (
          <SkipNextIcon className={classes.otherIcon} />
        ) : (
          <SkipPreviousIcon className={classes.otherIcon} />
        )}
      </IconButton>
      <IconButton aria-label="play/pause" onClick={togglePlay}>
        {props.isPlaying ? (
          <PauseIcon className={classes.playOrPauseIcon} />
        ) : (
          <PlayArrowIcon className={classes.playOrPauseIcon} />
        )}
      </IconButton>
      <IconButton aria-label="next" onClick={playNext}>
        {theme.direction === 'rtl' ? (
          <SkipPreviousIcon className={classes.otherIcon} />
        ) : (
          <SkipNextIcon className={classes.otherIcon} />
        )}
      </IconButton>
      <IconButton aria-label="list" onClick={showPlayList}>
        <ListIcon className={classes.otherIcon} />
      </IconButton>
    </div>
  );
};

interface ControlsProps
  extends Pick<
    IMusicListContext,
    | 'playPre'
    | 'playNext'
    | 'playMode'
    | 'isPlaying'
    | 'togglePlayMode'
    | 'toggle'
  > {
  className?: string;
  onShowList(): void;
}

export default Controls;
