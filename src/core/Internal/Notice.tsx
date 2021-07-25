import React from 'react';
import ReactDOM from 'react-dom';
import {
  Snackbar,
  makeStyles,
  lighten,
  darken,
  Paper,
  IconButton,
  Theme,
  StandardProps,
  PaperProps,
} from '@material-ui/core';
import clsx from 'clsx';
import SuccessOutlinedIcon from '@material-ui/icons/CheckCircleOutline';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { capitalize } from '@material-ui/core/utils';

const useStyles = makeStyles((theme: Theme) => {
  const getColor = theme.palette.type === 'light' ? darken : lighten;
  const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;

  return {
    /* Styles applied to the root element. */
    root: {
      ...theme.typography.body2,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: 'transparent',
      display: 'flex',
      padding: '6px 16px',
    },
    /* Styles applied to the root element if `variant="standard"` and `color="success"`. */
    standardSuccess: {
      color: getColor(theme.palette.success.main, 0.6),
      backgroundColor: getBackgroundColor(theme.palette.success.main, 0.9),
      '& $icon': {
        color: theme.palette.success.main,
      },
    },
    /* Styles applied to the root element if `variant="standard"` and `color="info"`. */
    standardInfo: {
      color: getColor(theme.palette.info.main, 0.6),
      backgroundColor: getBackgroundColor(theme.palette.info.main, 0.9),
      '& $icon': {
        color: theme.palette.info.main,
      },
    },
    /* Styles applied to the root element if `variant="standard"` and `color="warning"`. */
    standardWarning: {
      color: getColor(theme.palette.warning.main, 0.6),
      backgroundColor: getBackgroundColor(theme.palette.warning.main, 0.9),
      '& $icon': {
        color: theme.palette.warning.main,
      },
    },
    /* Styles applied to the root element if `variant="standard"` and `color="error"`. */
    standardError: {
      color: getColor(theme.palette.error.main, 0.6),
      backgroundColor: getBackgroundColor(theme.palette.error.main, 0.9),
      '& $icon': {
        color: theme.palette.error.main,
      },
    },
    /* Styles applied to the root element if `variant="outlined"` and `color="success"`. */
    outlinedSuccess: {
      color: getColor(theme.palette.success.main, 0.6),
      border: `1px solid ${theme.palette.success.main}`,
      '& $icon': {
        color: theme.palette.success.main,
      },
    },
    /* Styles applied to the root element if `variant="outlined"` and `color="info"`. */
    outlinedInfo: {
      color: getColor(theme.palette.info.main, 0.6),
      border: `1px solid ${theme.palette.info.main}`,
      '& $icon': {
        color: theme.palette.info.main,
      },
    },
    /* Styles applied to the root element if `variant="outlined"` and `color="warning"`. */
    outlinedWarning: {
      color: getColor(theme.palette.warning.main, 0.6),
      border: `1px solid ${theme.palette.warning.main}`,
      '& $icon': {
        color: theme.palette.warning.main,
      },
    },
    /* Styles applied to the root element if `variant="outlined"` and `color="error"`. */
    outlinedError: {
      color: getColor(theme.palette.error.main, 0.6),
      border: `1px solid ${theme.palette.error.main}`,
      '& $icon': {
        color: theme.palette.error.main,
      },
    },
    /* Styles applied to the root element if `variant="filled"` and `color="success"`. */
    filledSuccess: {
      color: '#fff',
      fontWeight: theme.typography.fontWeightMedium,
      backgroundColor: theme.palette.success.main,
    },
    /* Styles applied to the root element if `variant="filled"` and `color="info"`. */
    filledInfo: {
      color: '#fff',
      fontWeight: theme.typography.fontWeightMedium,
      backgroundColor: theme.palette.info.main,
    },
    /* Styles applied to the root element if `variant="filled"` and `color="warning"`. */
    filledWarning: {
      color: '#fff',
      fontWeight: theme.typography.fontWeightMedium,
      backgroundColor: theme.palette.warning.main,
    },
    /* Styles applied to the root element if `variant="filled"` and `color="error"`. */
    filledError: {
      color: '#fff',
      fontWeight: theme.typography.fontWeightMedium,
      backgroundColor: theme.palette.error.main,
    },
    /* Styles applied to the icon wrapper element. */
    icon: {
      marginRight: 12,
      padding: '7px 0',
      display: 'flex',
      fontSize: 22,
      opacity: 0.9,
    },
    /* Styles applied to the message wrapper element. */
    message: {
      padding: '8px 0',
    },
    /* Styles applied to the action wrapper element if `action` is provided. */
    action: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
      paddingLeft: 16,
      marginRight: -8,
    },
  };
});

const defaultIconMapping = {
  success: <SuccessOutlinedIcon fontSize="inherit" />,
  warning: <ReportProblemOutlinedIcon fontSize="inherit" />,
  error: <ErrorOutlineIcon fontSize="inherit" />,
  info: <InfoOutlinedIcon fontSize="inherit" />,
};

const Alert = (props: AlertProps) => {
  const {
    action,
    children,
    className,
    closeText = 'Close',
    color,
    icon,
    iconMapping = defaultIconMapping,
    onClose,
    role = 'alert',
    severity = 'success',
    variant = 'standard',
    ...other
  } = props;
  const classes = useStyles();

  return (
    <Paper
      role={role}
      square
      elevation={0}
      className={clsx(
        classes.root,
        // todo: ts怎么设定某个值一定是这个（对象｜接口）内的某个属性
        (classes as any)[`${variant}${capitalize(color || severity)}`],
        className,
      )}
      {...other}
    >
      {icon !== false ? (
        <div className={classes.icon}>
          {icon || iconMapping[severity] || defaultIconMapping[severity]}
        </div>
      ) : null}
      <div className={classes.message}>{children}</div>
      {action != null ? <div className={classes.action}>{action}</div> : null}
      {action == null && onClose ? (
        <div className={classes.action}>
          <IconButton
            size="small"
            aria-label={closeText}
            title={closeText}
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      ) : null}
    </Paper>
  );
};

const Notice = (props: INoticeProps) => {
  const { msg, delay = 2000, severity = 'info', onClose } = props;
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={true}
      autoHideDuration={delay}
      onClose={onClose}
      message={msg}
    >
      <Alert variant="filled" severity={severity}>
        {msg}
      </Alert>
    </Snackbar>
  );
};

Notice.open = (
  msg: string,
  severity: Severity = 'info',
  delay: number = 2000,
) => {
  const div = document.createElement('div');
  const destroy = () => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  };
  document.body.appendChild(div);

  ReactDOM.render(
    <Notice msg={msg} delay={delay} severity={severity} onClose={destroy} />,
    div,
  );
};

export type Severity = 'error' | 'warning' | 'info' | 'success';
export type AlertClassKey =
  | 'root'
  | 'standardSuccess'
  | 'standardInfo'
  | 'standardWarning'
  | 'standardError'
  | 'outlinedSuccess'
  | 'outlinedInfo'
  | 'outlinedWarning'
  | 'outlinedError'
  | 'filledSuccess'
  | 'filledInfo'
  | 'filledWarning'
  | 'filledError'
  | 'icon'
  | 'message'
  | 'action';

interface AlertProps
  extends StandardProps<PaperProps, AlertClassKey, 'variant'> {
  /**
   * The action to display. It renders after the message, at the end of the alert.
   */
  action?: React.ReactNode;
  /**
   * Override the default label for the *close popup* icon button.
   *
   * For localization purposes, you can use the provided [translations](/guides/localization/).
   */
  closeText?: string;
  /**
   * The main color for the alert. Unless provided, the value is taken from the `severity` prop.
   */
  color?: Severity;
  /**
   * The severity of the alert. This defines the color and icon used.
   */
  severity?: Severity;
  /**
   * Override the icon displayed before the children.
   * Unless provided, the icon is mapped to the value of the `severity` prop.
   */
  icon?: React.ReactNode | false;
  /**
   * The ARIA role attribute of the element.
   */
  role?: string;
  /**
   * The component maps the `severity` prop to a range of different icons,
   * for instance success to `<SuccessOutlined>`.
   * If you wish to change this mapping, you can provide your own.
   * Alternatively, you can use the `icon` prop to override the icon displayed.
   */
  iconMapping?: Partial<Record<Severity, React.ReactNode>>;
  /**
   * Callback fired when the component requests to be closed.
   * When provided and no `action` prop is set, a close icon button is displayed that triggers the callback when clicked.
   *
   * @param {object} event The event source of the callback.
   */
  onClose?: (event: React.SyntheticEvent) => void;
  /**
   * The variant to use.
   */
  variant?: 'standard' | 'filled' | 'outlined';
}

interface INoticeProps {
  msg: string;
  delay: number;
  severity: Severity;
  onClose(): void;
}

export default Notice;
