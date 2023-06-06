import React from 'react';
import { useField, useFormikContext } from 'formik';
import Form from 'react-bootstrap/esm/Form';

interface InSelectProps {
    name: string,
    children: any,
    otherProps: any
}

export default function OmSelect({name, children, otherProps}: InSelectProps) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    function handleChange(event: any) {
        const { value } = event.target;
        setFieldValue(name, value);
    }

    const configSelect = {
        ...field,
        ...otherProps,
        onChange: handleChange
    }

    if (meta && meta.touched && meta.error) {
        configSelect.isInvalid = true;
    }

    return (
        <div>
            <Form.Select {...configSelect} >
                {children}
            </Form.Select>
            {meta && meta.touched && meta.error && (
                <Form.Control.Feedback type="invalid">
                {meta.error}
                </Form.Control.Feedback>
            )}
        </div>
    );
}