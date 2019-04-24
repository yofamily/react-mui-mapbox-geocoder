import React from 'react';
import debounceRender from 'react-debounce-render';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';

type Props = {
  show: boolean;
};

const debouncedProgressBar: React.FC<Props> = ({show = false}) => {
  return (
    <Fade in={show}>
      <LinearProgress style={{position: 'absolute', width: '100%'}} />
    </Fade>
  );
};

export default debounceRender(debouncedProgressBar, 100);
