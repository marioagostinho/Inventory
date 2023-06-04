import React from 'react';
import { useFormikContext } from 'formik';

import { Button } from 'react-bootstrap';

interface InSubmitButtonProps {
    children: any,
    otherProps: any
}

export default function InSubmitButton({children, otherProps}: InSubmitButtonProps) {
    const { submitForm } = useFormikContext();

    function handleSubmit() {
        submitForm();
    }

    const configButton = {
        ...otherProps,
        variant: 'success',
        onClick: handleSubmit
    }

    return (
        <Button  {...configButton}>
            {children}
        </Button>
    );
}