import React, { useState } from 'react';
import classes from './prevision.module.css'
import {
    Box, Tabs, useTheme, Divider, Grid, MenuItem,
    CircularProgress, Popper, Grow, Button, Paper
} from '@mui/material';
import TabPanel from '../../components/tab-panel/tab-panel';
import { CustomSelect, CustomTab } from '../../theme';
import InvestissementsTab from './investissements-tab/investissements-tab';
import SalairesTab from './salaires-tab/salaires-tab';
import ChargesTab from './charges-tab/charges-tab';
import { useParams, useLocation } from 'react-router-dom';
import CustomStepper from '../../components/custom-stepper/custom-stepper';

const Prevision = () => {

    const theme = useTheme()

    const textColor = theme.palette.text.main
    const primaryColor = theme.palette.primary.main

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [total, setTotal] = useState(0)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    return (
        <>
            <Grid container columns={12} columnSpacing={6}>
                <Grid item xs={12} sm={4}>
                    <Box sx={{
                        color: theme.palette.text.main,
                        typography: 'h3'
                    }} className={classes.hdr}>
                        Prévision
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Box sx={{ typography: 'body2', color: textColor }} mb={1}>
                        Tranches
                    </Box>
                    {/* {projet.tranche ?
                        <CustomStepper steps={projet.tranche.nbTranches} activeSteps={getMaxTranchePrevisions()} />:  */}
                    <i style={{ display: 'block' }}>Pas encore soumis</i>
                    {/* } */}
                </Grid>
                <Grid item xs={12} sm={4}
                    sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'column' }}>
                    <CustomSelect>
                        <MenuItem style={{ opacity: 1 }} disabled>
                            <CircularProgress size='2rem' style={{ display: 'block', margin: 'auto' }} />
                        </MenuItem>
                        {/* <MenuItem>Option one</MenuItem>
                        <MenuItem>Option two</MenuItem> */}
                    </CustomSelect>
                </Grid>
            </Grid>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <CustomTab label="Investissements" />
                <CustomTab label="Salaires" />
                <CustomTab label="Charges externes" />
            </Tabs>
            <Divider />
            <TabPanel value={tabValue} index={0}>
                <InvestissementsTab />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <SalairesTab />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <ChargesTab />
            </TabPanel>
            <div className={classes.footer}>
                <div>
                    <span>Total:</span>
                    <Box component='span'
                    sx={{marginLeft: '0.5rem', color: primaryColor}}>{total}</Box>
                </div>
                <Box>
                    <Button variant='text' onClick={handleClick}>
                        <Box>
                            Aller a
                        </Box>
                    </Button>
                    <Popper open={open} anchorEl={anchorEl} placement={'top-end'} transition>
                        {({ TransitionProps }) => (
                            <Grow {...TransitionProps} timeout={350}>
                                <Paper>
                                    The content of the Popper.
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
            </div>
        </>
    );
};

export default Prevision;