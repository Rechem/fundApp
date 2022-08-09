import React, { useState } from 'react';
import classes from './commissions.module.css'
import { Typography, Dialog, Button, InputAdornment, Tabs, useTheme, Divider, Box }
    from '@mui/material';
import { CustomTextField } from '../../theme';
import { SearchNormal1 } from 'iconsax-react';
import useDebounce from '../../custom-hooks/use-debounce';
import TabPanel from '../../components/tab-panel/tab-panel';
import { CustomTab } from '../../theme';
import FormMembre from '../../components/form-membre/form-membre';
import CommissionTab from './commissions/commissions-tab';
import MembresTab from './members/membres-tab';

// const ToolBar = ({ tabValue }) => {

//     const onChangeHandler = e => {
//         const { name, value } = e.target
//         setSearchInput(value)
//     }

//     const [searchInput, setSearchInput] = useState('')

//     const debouncedSearchTerm = useDebounce(searchInput, 500);

//     const [open, setOpen] = useState(false);

//     const handleDialogClickOpen = () => {
//         setOpen(true);
//     };

//     const handleDialogClose = () => {
//         setOpen(false);
//     };

//     return (
//         <React.Fragment>

//             <Dialog open={open} onClose={handleDialogClose}>
//                 <Box>
//                     <FormMembre onClose={handleDialogClose}/>
//                 </Box>
//             </Dialog>
//         </React.Fragment>);
// };

const Commissions = () => {

    const theme = useTheme()

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <React.Fragment>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Commissions
            </Typography>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <CustomTab label="Commissions" {...a11yProps(0)} />
                <CustomTab label="Membres" {...a11yProps(1)} />
            </Tabs>
            <Divider />
            <TabPanel value={tabValue} index={0}>
                <CommissionTab />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <MembresTab/>
            </TabPanel>
        </React.Fragment>
    );
};

export default Commissions;