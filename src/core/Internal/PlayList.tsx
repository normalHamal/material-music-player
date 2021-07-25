import React, { useRef, useCallback } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Drawer,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import { IMusicListContext } from '../common';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    playList: {
      width: 400,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    ellipsis: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
);

const PlayList = (props: IPlayListProps) => {
  const classes = useStyles();
  const listRef = useRef<FixedSizeList>(null);
  const {
    current,
    playList = [],
    playTo,
    toggle,
    remove,
    playIndex,
    isPlaying,
    visible,
    onClose,
    isMini,
  } = props;

  const renderRow = useCallback(
    (props: ListChildComponentProps) => {
      const { index, style } = props;
      const play = playList[index];
      const togglePlay = () => {
        if (current?.url !== play.url) {
          playTo(index);
        } else {
          toggle();
        }
      };

      const removeIt = () => {
        remove(index);
      };

      return (
        <div style={style} key={play.url}>
          <ListItem button={true} selected={index === playIndex}>
            <ListItemAvatar>
              <Avatar src={play.picurl} />
            </ListItemAvatar>
            <ListItemText
              primary={<div className={classes.ellipsis}>{play.name}</div>}
              secondary={
                <div className={classes.ellipsis}>{play.artistsname}</div>
              }
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="play" onClick={togglePlay}>
                {current?.url === play.url && isPlaying ? (
                  <PauseIcon />
                ) : (
                  <PlayArrowIcon />
                )}
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={removeIt}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </div>
      );
    },
    [playList, isPlaying, current, classes],
  );

  return (
    <Drawer
      anchor={isMini ? 'bottom' : 'right'}
      open={visible}
      onClose={onClose}
    >
      <Typography component="h6" variant="h6" style={{ padding: '16px' }}>
        {`播放列表（${playList.length}首）`}
      </Typography>
      <List className={classes.playList}>
        <FixedSizeList
          ref={listRef}
          height={isMini ? window.innerHeight * 0.5 : window.innerHeight - 80}
          width="100%"
          itemSize={72}
          itemCount={playList.length}
        >
          {renderRow}
        </FixedSizeList>
      </List>
    </Drawer>
  );
};

interface IPlayListProps
  extends Pick<
    IMusicListContext,
    | 'isPlaying'
    | 'current'
    | 'playList'
    | 'playTo'
    | 'toggle'
    | 'remove'
    | 'playIndex'
  > {
  visible: boolean;
  onClose(): void;
  isMini: boolean;
}

export default PlayList;
