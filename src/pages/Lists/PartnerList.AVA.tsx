// const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50";
// const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";


// export default function PartnerListAVA() {
//       {/* Content */}
//       <div className={`${cardClass} mt-12`}>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50">
//             <thead>
//               <tr className="bg-light-secondary dark:bg-[#0F172A]/60">
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
//                   Nome
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
//                   Telefone
//                 </th>
//                 {activeTab === 'afiliado' && (
//                   <>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
//                       Cupom
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
//                       Taxas
//                     </th>
//                   </>
//                 )}
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
//                   Data de Criação
//                 </th>
//               </tr>
//             </thead>


//             <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
//               {filteredItems.map((item) => (
//                 <tr
//                   key={activeTab === 'afiliado' ? item.id : item.id}
//                   className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
//                       {item.nome}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-base text-light-text-secondary dark:text-gray-300">
//                       {item.email}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-base text-light-text-secondary dark:text-gray-300">
//                       {formatPhone(item.fone?.toString())}
//                     </div>
//                   </td>
//                   {activeTab === 'afiliado' && (
//                     <>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="relative">
//                           <button
//                             onClick={() => handleCopyToClipboard(item.cupom)}
//                             className="group px-3 py-1.5 inline-flex items-center space-x-2 text-sm leading-5 font-medium rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 border border-brand-200 dark:border-brand-700/30 transition-colors"
//                           >
//                             <span>{item.cupom}</span>
//                             <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
//                           </button>
//                           {showCopyTooltip === item.cupom && (
//                             <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
//                               <div className="flex items-center space-x-1">
//                                 <CheckCircle className="h-3 w-3" />
//                                 <span>Copiado!</span>
//                               </div>
//                               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-base text-light-text-secondary dark:text-gray-300">
//                           <div>Desconto: {item.desconto}%</div>
//                           <div>Comissão: {item.comissao}%</div>
//                         </div>
//                       </td>
//                     </>
//                   )}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 text-sm font-medium rounded-full ${item.status
//                       ? 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30'
//                       : 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30'
//                       }`}>
//                       {item.status ? 'Ativo' : 'Inativo'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-base text-light-text-secondary dark:text-gray-300">
//                       {/* {format(new Date(item?.datacriacao), 'dd/MM/yyyy')} */}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>
//         </div>
//       </div>
  
// }