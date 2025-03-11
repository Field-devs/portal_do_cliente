interface FormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit?: (data: any) => void;
  sender?: any;
  id?: any;
}

export default FormProps;