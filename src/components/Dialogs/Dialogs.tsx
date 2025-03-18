import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './dialog.css'

const MySwal = withReactContent(Swal)

export const AskDialog = async (text: string, title: string = "Atenção") => {
  return MySwal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
    customClass: {
      popup: 'dialog-popup',
      title: 'dialog-title',
      htmlContainer: 'dialog-content',
      confirmButton: 'dialog-confirm-button',
      cancelButton: 'dialog-cancel-button',
      actions: 'dialog-actions'
    },
    buttonsStyling: false
  });
}

export const AlertDialog = async (text: string, title: string = "Atenção") => {
  return MySwal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: false,
    confirmButtonText: 'Ok',
    customClass: {
      popup: 'dialog-popup',
      title: 'dialog-title', 
      htmlContainer: 'dialog-content',
      confirmButton: 'dialog-confirm-button',
      actions: 'dialog-actions'
    },
    buttonsStyling: false
  });
}

export const SuccessDialog = async (text: string, title: string = "Sucesso") => {
  return MySwal.fire({
    title: title,
    text: text,
    icon: 'success',
    showCancelButton: false,
    confirmButtonText: 'Ok',
    customClass: {
      popup: 'dialog-popup',
      title: 'dialog-title',
      htmlContainer: 'dialog-content', 
      confirmButton: 'dialog-confirm-button',
      actions: 'dialog-actions'
    },
    buttonsStyling: false
  });
}

// error
export const ErrorDialog = async (text: string, title: string = "Erro") => {
  return MySwal.fire({
    title: title,
    text: text,
    icon: 'error',
    showCancelButton: false,
    confirmButtonText: 'Ok',
    customClass: {
      popup: 'dialog-popup',
      title: 'dialog-title',
      htmlContainer: 'dialog-content',
      confirmButton: 'dialog-confirm-button',
      actions: 'dialog-actions'
    },
    buttonsStyling: false
  });
}



