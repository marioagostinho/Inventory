import React, { Component } from 'react';
import { useField } from 'formik';
import Form from 'react-bootstrap/esm/Form';

interface InTextFieldProps {
    name: string;
    otherProps: any
}

export default function InTextField({name, otherProps}: InTextFieldProps){
    const [field, meta] = useField(name);

    const configTextField = {
        ...field,
        ...otherProps
    }

    if (meta && meta.touched && meta.error) {
        configTextField.isInvalid = true;
    }

    return(
        <div>
            <Form.Control 
            {...configTextField} />
            {meta && meta.touched && meta.error && (
                <Form.Control.Feedback type="invalid">
                {meta.error}
                </Form.Control.Feedback>
            )}
        </div>
    );
}