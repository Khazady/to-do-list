import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {setAppErrorAC} from "../../app/app-reducer";

//всплывашка с ошибкой
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function ErrorSnackbar() {
    let error = useSelector<AppRootStateType, string | null>(state => state.app.error)
    let dispatch = useDispatch()

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        //??????????
        if (reason === "clickaway") {
            return;
        }
        //??????????????
        setTimeout(() =>dispatch(setAppErrorAC(null)), 3000)
    };

    return (
      //show only when error isn't null
      <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">{error}</Alert>
      </Snackbar>
    );
}