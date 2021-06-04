import React, {useContext} from 'react'
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Fab from '@material-ui/core/Fab';
import GetAppIcon from '@material-ui/icons/GetApp';
import triggeraxios from '../../config/axiosv2';

import popupsContext from '../../context/pop-ups/pop-upsContext';

const ButtonExport = ({ csvData, fileName, datatosend, columnsexport  }) => {

    const { setOpenBackdrop } = useContext(popupsContext);

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        let datafromtable = csvData;
        if (columnsexport) {
            datafromtable = csvData.map(x => {
                const newx = {};
                columnsexport.forEach(y => newx[y.Header] = x[y.accessor]);
                return newx;
            });
        }
        const ws = XLSX.utils.json_to_sheet(datafromtable);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const handleClick = async () => {
        setOpenBackdrop(true);
        if (csvData)
            exportToCSV(csvData, fileName);
        else  {
            const res = await triggeraxios('post', '/api/main/export', datatosend)
            if (res.success)
                exportToCSV(res.result, fileName);
        }
        setOpenBackdrop(false)
    }

    return (
        <Fab
            size="small"
            aria-label="add"
            color="primary"
            onClick={handleClick}
        >
            <GetAppIcon size="small" color="secondary" />
        </Fab>
    )
}


export default ButtonExport;