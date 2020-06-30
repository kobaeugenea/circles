import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

/*
    Round timer that users see
 */
export default function Timer(props) {
    const progress = (props.maxValue - props.value) / props.maxValue * 100;
    const label = props.value > 0 ? Math.round(props.value / 1000) : '∞';
    return (
        <Box position="fixed" display="inline-flex" className={props.className} onClick={props.onClick}>
            <div className='overlap'/>
            <CircularProgress variant="static" value={progress} size={'10vh'} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">{label}</Typography>
            </Box>
        </Box>
    );
}