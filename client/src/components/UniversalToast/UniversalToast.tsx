import React from 'react';
import { toast } from 'react-toastify';

const UniversalToast = {
  success(message: any) {
    toast.success(message);
  },
  error(message: any) {
    toast.error(message);
  },
  warning(message: any) {
    toast.warning(message);
  },
  info(message: any) {
    toast.info(message);
  },
};

export default UniversalToast;