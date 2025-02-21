// Format CNPJ: XX.XXX.XXX/XXXX-XX
export function formatCNPJ(value: string | undefined | null) {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
}

// Format CPF: XXX.XXX.XXX-XX
export function formatCPF(value: string | undefined | null) {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
}

export function formatCNPJCPF(value: string | undefined | null) {
  //if value == 11 digits return formatCPF
  if (!value) return '';
  if (value.length === 11) {
    return formatCPF(value);
  }
  if (value.length === 14) {
    return formatCNPJ(value);
  }
}


// Format phone: (XX) XXXXX-XXXX
export function formatPhone(value: string | undefined | null) {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  }
  return numbers.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
}

// Format currency to BRL
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}