let snackbarRef;
export const SnakeBarHelper = ({children, useSnakeBar}) => {
    snackbarRef = useSnakeBar;
    return children;
    
}

export const successMsg = (msg) => {
    snackbarRef.enqueueSnackbar(msg,{variant : "success"});
}

export const errorMsg = (msg) => {
    snackbarRef.enqueueSnackbar(msg,{variant : "error"});
}