import React from "react";
import {Modal,Box, Typography, Button, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width : 400,
    bgcolor: 'background.paper',
    border: '2px solid black',
    p: 4,
  };

const CustomModal = ({open, handleClose, title, children}) => {
    return(
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} >
                <IconButton onClick={handleClose} sx={{position:"absolute", top:7, right:0}}>
                    <CloseIcon/>
                </IconButton>
                        
                <Typography variant="h6" component="h2">
                    {title}
                </Typography>

                <Box sx={{ mt: 2 }}>
                {children}
                </Box>
            
            </Box>
        </Modal>
    )
}
export default CustomModal;