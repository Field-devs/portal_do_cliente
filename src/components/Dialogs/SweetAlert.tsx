import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const AskDialog = async (text: string, title: string = "Atenção") => {
  return MySwal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  });
}

export const AlertDialog = async (text: string, title: string = "Atenção") => {
  return MySwal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: false,
    confirmButtonText: 'Ok',
    confirmButtonColor: '#3085d6'
  });
}