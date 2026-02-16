import { useSnackbar } from 'notistack';

let snackbarRef;

export const SnackBarConfigurator = () => {
  snackbarRef = useSnackbar();
  return null;
};

export const toast = {
  success: (msg) => {snackbarRef.enqueueSnackbar(msg, { variant: 'success' });},
  error: (msg) => {snackbarRef.enqueueSnackbar(msg, { variant: 'error' });},
};