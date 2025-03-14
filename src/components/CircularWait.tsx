// messagefull - Texto completo da mensagem
export default function CircularWait({ messagefull, message, small = false }: { messagefull?: string, message?: string, small?: boolean }) {
  if (small) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
        {messagefull && <p className="mt-4 text-xl font-medium text-gray-300 dark:text-gray-300">{messagefull}, por favor aguarde</p>}
        {message && <p className="mt-4 text-xl font-medium text-gray-300 dark:text-gray-300">Carregando {message}, por favor aguarde</p>}
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="animate-spin rounded-full h-60 w-60 border-t-8 border-blue-500"></div>
      {messagefull && <p className="mt-4 text-3xl font-medium text-gray-300 dark:text-gray-300">{messagefull}, por favor aguarde</p>}
      {message && <p className="mt-4 text-3xl font-medium text-gray-300 dark:text-gray-300">Carregando {message}, por favor aguarde</p>}
    </div>
  );

}