import { useParams } from "react-router-dom";

export default function ProposalFormConfirm() {
  const { id } = useParams();
  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        {id}
      </div>
  )              
}
