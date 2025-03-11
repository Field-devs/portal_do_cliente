export default function ProposalConfirm() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const meuParametro = urlParams.get('id');
  console.log(meuParametro);

  const borderRadius = "rounded-lg";

  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className={`${borderRadius} bg-white p-6 shadow-md`}>
          {meuParametro}
        </div>
      </div>
  )              
}