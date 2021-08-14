import React, { useEffect } from 'react';
import clsx from 'clsx';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  Slide,
  Typography,
  Theme,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { useBoolean, useMusicList } from '../..//hooks';
import { BackgroundStyle } from '../../hooks/useBackgroundStyle';
import {
  MusicDetail,
  PlayList,
  ProcessBar,
  Controls,
  ThemeContainer,
} from '../../core/Internal';
import { ISong } from '../common';
import { ThemeOptions, ThemeType } from '../Internal/ThemeContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 230,
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    content: {
      width: '100%',
    },
    cover: {
      width: 151,
      height: 151,
      margin: `${theme.spacing(1)}px auto`,
      borderRadius: '50%',
    },
    rotateRight: {
      animation: 'rotateRight 20s linear infinite',
    },
    processBar: {
      width: 160,
    },
    ellipsis: {
      display: '-webkit-box',
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
    },
    upIcon: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
}) as React.ComponentType<TransitionProps>;

const NormalPlayer = (props: NormalProps) => {
  const classes = useStyles();
  const musicListIns = useMusicList();
  const { className, list, onShare, themeOptions, themeType, backgroundStyle } =
    props;
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
  const {
    state: upIconVisible,
    setTrue: showUpIcon,
    setFalse: hideUpIcon,
  } = useBoolean(false);

  const playPre = () => {
    musicListIns.playPre();
  };

  const playNext = () => {
    musicListIns.playNext();
  };

  const togglePlay = () => {
    musicListIns.toggle();
  };

  const togglePlayMode = () => {
    musicListIns.togglePlayMode();
  };

  useEffect(() => {
    replacePlayList(list);
  }, [list]);

  return (
    <ThemeContainer themeOptions={themeOptions} themeType={themeType}>
      <Card className={clsx(classes.root, className)}>
        <CardActionArea
          onClick={showDetail}
          onMouseOver={showUpIcon}
          onMouseLeave={hideUpIcon}
        >
          <CardMedia
            onClick={showDetail}
            className={clsx(classes.cover, classes.rotateRight)}
            image={current?.picurl}
            title={current?.name}
            style={{
              animationPlayState: musicListIns.isPlaying ? 'running' : 'paused',
            }}
          />
          {upIconVisible ? (
            <div className={classes.upIcon}>
              <ExpandLessIcon style={{ fontSize: 100 }} color="primary" />
            </div>
          ) : null}
        </CardActionArea>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography
              component="h5"
              variant="h5"
              className={classes.ellipsis}
              align="center"
            >
              {current?.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              align="center"
            >
              {current?.artistsname}
            </Typography>
          </CardContent>
          <div className={classes.processBar}>
            <ProcessBar source={current} seekTo={musicListIns.seekTo} />
          </div>
        </div>
        <Controls onShowList={showList} {...musicListIns} />
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
            backgroundStyle={backgroundStyle}
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
          isMini={false}
        />
      </Card>
    </ThemeContainer>
  );
};

interface NormalProps {
  className?: string;
  list: ISong[];
  onShare?(song: ISong): void;
  themeOptions?: ThemeOptions;
  themeType?: ThemeType;
  backgroundStyle?: BackgroundStyle;
}

export default NormalPlayer;
