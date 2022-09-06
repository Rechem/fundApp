import React from 'react';
import { Modal, Box, Fade } from '@mui/material'

const CustomModal = ({ open, onClose, children }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Fade in={open}>
                <Box>
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
};

export default CustomModal;