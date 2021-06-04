import React, { useContext } from 'react';
import assignmentContext from '../../context/assignment/assignmentContext';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import popupsContext from '../../context/pop-ups/pop-upsContext';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const CheckDistrict = ({ district }) => {
    const { setModalQuestion } = useContext(popupsContext);

    const { updateDistrictsSelected, dataAssignment, dataVisible } = useContext(assignmentContext);

    const handleChange = (e) => {
        let triggerquestion = false;
        if (!e.target.checked) {
            triggerquestion = dataVisible.some(x => x.district === district.district && !!x.selected);
        }

        const callback = () => {
            setModalQuestion({ visible: false });
            district.selected = false;
            updateDistrictsSelected(district)
        }

        if (triggerquestion)
            setModalQuestion({ visible: true, question: `Tiene almenos una guia marcada dentro de ese distrito. ¿Desea continuar?`, callback });
        else {
            district.selected = e.target.checked;
            updateDistrictsSelected(district)
        }
    }
    return (
        <FormControlLabel
            control={
                <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    checked={district.selected}
                    onChange={handleChange}
                    name="checkedB"
                    color="primary"
                />
            }
            label={`${district.district} (${district.count})`}
        />
    );
}

export default CheckDistrict;