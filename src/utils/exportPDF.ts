import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Invoice {
  id: string;
  cliente_nome: string;
  valor: number;
  status: string;
  dt_vencimento: string;
  dt_pagamento?: string;
}

export const exportFinancialReport = (
  invoices: Invoice[],
  metrics: {
    totalReceivables: number;
    totalPaid: number;
    totalOverdue: number;
    defaultRate: number;
  }
) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Relatório Financeiro', 14, 22);

  // Add date
  doc.setFontSize(10);
  doc.text(
    `Gerado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`,
    14,
    30
  );

  // Add metrics summary
  doc.setFontSize(12);
  doc.text('Resumo Financeiro', 14, 40);

  const metrics_data = [
    ['Total a Receber', formatCurrency(metrics.totalReceivables)],
    ['Total Recebido', formatCurrency(metrics.totalPaid)],
    ['Total em Atraso', formatCurrency(metrics.totalOverdue)],
    ['Taxa de Inadimplência', `${metrics.defaultRate.toFixed(2)}%`]
  ];

  autoTable(doc, {
    startY: 45,
    head: [['Métrica', 'Valor']],
    body: metrics_data,
    theme: 'striped',
    headStyles: { fillColor: [7, 21, 46] }
  });

  // Add invoices table
  doc.text('Faturas', 14, doc.lastAutoTable.finalY + 20);

  const invoices_data = invoices.map(invoice => [
    invoice.id.slice(0, 8),
    invoice.cliente_nome,
    formatCurrency(invoice.valor),
    translateStatus(invoice.status),
    format(new Date(invoice.dt_vencimento), 'dd/MM/yyyy'),
    invoice.dt_pagamento
      ? format(new Date(invoice.dt_pagamento), 'dd/MM/yyyy')
      : '-'
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [['ID', 'Cliente', 'Valor', 'Status', 'Vencimento', 'Pagamento']],
    body: invoices_data,
    theme: 'striped',
    headStyles: { fillColor: [7, 21, 46] }
  });

  // Save the PDF
  doc.save(`relatorio-financeiro-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const translateStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    paid: 'Paga',
    pending: 'Pendente',
    overdue: 'Em Atraso'
  };
  return statusMap[status] || status;
};