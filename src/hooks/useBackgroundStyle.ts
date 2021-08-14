import { useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { getImagePrimaryColor } from '../core/util';

export type BackgroundStyle = 'default' | 'filter' | 'linearGradient';

interface IUseBackgroundStyleParams {
  backgroundStyle: BackgroundStyle;
  backgroundImage?: string;
}

const DEFAULT_STYLE = {
  bgStyle: {},
  shadeTop: {},
  shadeBottom: {},
};

export default (params: IUseBackgroundStyleParams) => {
  const { backgroundStyle, backgroundImage } = params;
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const theme = useTheme();

  useEffect(() => {
    switch (backgroundStyle) {
      case 'default':
        setStyle(DEFAULT_STYLE);
        break;
      case 'filter':
        setStyle({
          bgStyle: {
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 1,
            height: '100%',
            overflow: 'hidden',
            backgroundPosition: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : '',
            transform: 'scale(1.5)',
            transformOrigin: 'center center',
            filter: 'blur(30px)',
          },
          shadeTop: {
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 2,
            width: '100%',
            height: '50%',
            background: `linear-gradient(to bottom, ${theme.palette.background.paper}, rgba(0, 0, 0, 0)`,
          },
          shadeBottom: {
            position: 'fixed',
            left: 0,
            bottom: 0,
            zIndex: 2,
            width: '100%',
            height: '50%',
            background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), ${theme.palette.background.paper}`,
          },
        });
        break;
      case 'linearGradient':
        if (!backgroundImage) break;

        getImagePrimaryColor(backgroundImage)
          .then((primaryColor) => {
            setStyle({
              bgStyle: {
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 1,
                height: '100%',
                overflow: 'hidden',
                background: `linear-gradient(to bottom,rgba(${primaryColor[0]},${primaryColor[1]},${primaryColor[2]}),${theme.palette.background.paper}`,
              },
              shadeTop: {
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 2,
                width: '100%',
                height: '50%',
                background: `linear-gradient(to bottom,${theme.palette.background.paper},rgba(0, 0, 0, 0)`,
              },
              shadeBottom: {
                position: 'fixed',
                left: 0,
                bottom: 0,
                zIndex: 2,
                width: '100%',
                height: '50%',
                background: `linear-gradient(to bottom,rgba(0, 0, 0, 0),${theme.palette.background.paper}`,
              },
            });
          })
          .catch((e) => {
            console.error(e);
          });

        break;
      default:
        throw new TypeError(
          'value of backgroundStyle must be one of BackgroundStyle: [none|filter|linearGradient]',
        );
    }
  }, [backgroundStyle, backgroundImage]);

  return style;
};
