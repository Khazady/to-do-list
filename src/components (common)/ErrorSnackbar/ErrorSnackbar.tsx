import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../app/store";
import {setAppErrorAC} from "../../app/app-reducer";

// error popup
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function ErrorSnackbar() {
    let error = useSelector<RootStateType, string | null>(state => state.app.error)
    let dispatch = useDispatch()

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        dispatch(setAppErrorAC({error: null}))
    };

    //show only when error isn't null
    const isOpen = error !== null
    return (
      <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">{error}</Alert>
      </Snackbar>
    );
}