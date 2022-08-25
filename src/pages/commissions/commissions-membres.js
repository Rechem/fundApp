import React, { useState } from 'react';
import classes from './commissions.module.css'
import { Typography, Tabs, useTheme, Divider } from '@mui/material';
import TabPanel from '../../components/tab-panel/tab-panel';
import { CustomTab } from '../../theme';
import CommissionTab from './commissions/commissions-tab';
import MembresTab from './members/membres-tab';

const Commissions = () => {

    const theme = useTheme()

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <React.Fragment>
            <Typography color={theme.palette.text.main}
                variant='h3' className={classes.hdr}>
                Commissions
            </Typography>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <CustomTab label="Commissions" />
                <CustomTab label="Membres" />
            </Tabs>
            <Divider />
            <TabPanel value={tabValue} index={0}>
                <CommissionTab />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <MembresTab />
            </TabPanel>
        </React.Fragment>
    );
};

export default Commissions;