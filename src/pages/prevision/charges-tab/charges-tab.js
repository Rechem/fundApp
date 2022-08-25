import React from 'react';
import Toolbar from '../../../components/toolbar/toolbar'
import InvestissementsTable from '../investissements-tab/investissements-table';

const ChargesTab = () => {
    //provide an argument to specify wheter its charge or investissement for the type.
    return (
        <div>
            <Toolbar style={{marginBlock : '1rem'}}/>
            <InvestissementsTable/>
        </div>
    );
};

export default ChargesTab;