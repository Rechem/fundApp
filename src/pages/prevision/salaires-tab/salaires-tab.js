import React from 'react';
import Toolbar from '../../../components/toolbar/toolbar'
import SalairesTable from './salaires-table';
const SalairesTab = () => {
    return (
        <div>
            <Toolbar style={{marginBlock : '1rem'}}/>
            <SalairesTable/>
        </div>
    );
};

export default SalairesTab;