export default function ProposalConfirm() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const meuParametro = urlParams.get('id');
  console.log(meuParametro);
  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        {meuParametro}
      </div>
  )              
}
