import React from 'react';

import { useField } from 'formik';
import Form from 'react-bootstrap/esm/Form';

interface InDatePickerProps {
    name: string,
    otherProps: any
}

export default function InDatePicker({name, otherProps}: InDatePickerProps) {
    const [field, meta] = useField(name);

    const configDatePicker = {
        ...field,
        ...otherProps,
        type: 'date',
        dateforma:"dd/mm/yyyy",
        className:"form-control"
    };

    if (meta && meta.touched && meta.error) {
        configDatePicker.isInvalid = true;
    }

    return (
        <div>
            <Form.Control  {...configDatePicker}/>
            {meta && meta.touched && meta.error && (
                <Form.Control.Feedback type="invalid">
                {meta.error}
                </Form.Control.Feedback>
            )}
        </div>
    );
}