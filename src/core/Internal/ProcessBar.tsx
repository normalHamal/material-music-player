import React from 'react';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  Slider,
  Typography,
} from '@material-ui/core';

import { IMusic } from '../common';
import { ms2HS } from '../util';
import { useCurrentTime } from '@/hooks';

const Bar = withStyles((theme: Theme) => ({
  marked: {
    marginBottom: 10,
  },
}))(Slider);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    time: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
);

const ProcessBar = (props: IProcessBarProps) => {
  const classes = useStyles();
  const { source, seekTo } = props;
  const { currentTime } = useCurrentTime({ howl: source?._howl });

  const handleCurrentTimeChange = (event: object, value: number | number[]) => {
    seekTo(value as number);
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <Bar
        value={currentTime}
        max={source?.duration}
        onChange={handleCurrentTimeChange}
        valueLabelDisplay="off"
      />
      <Typography
        variant="body2"
        color="textSecondary"
        className={classes.time}
      >
        <span>{ms2HS(currentTime)}</span>
        <span>{ms2HS(source?.duration || 0)}</span>
      </Typography>
    </div>
  );
};

interface IProcessBarProps {
  className?: string;
  source?: IMusic;
  seekTo(value: number): void;
}

export default ProcessBar;
