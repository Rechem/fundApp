import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@mui/material';
import classes from './confirmation-dialog.module.css'
import { toast } from 'react-toastify';

const ConfirmationDialog = props => {

  const onConfirm = async () => {
    try {
      await props.onConfirm();
      props.onClose();
      props.afterSubmit()
    } catch (e) {
      toast.error(e.response.data.message, { toastId: 'deprogrammerId' })
    }
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props.title ? props.title : 'Confirmation'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.children}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.btnContainer}>
        <Button onClick={props.onClose} className={classes.btnSecondary}>
          {props.secondaryButtonLabel ? props.secondaryButtonLabel : 'Annuler'}
        </Button>
        <Button onClick={onConfirm} className={classes.btnSecondary}>
          {props.primaryButtonLabel ? props.primaryButtonLabel : 'Confirmer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;