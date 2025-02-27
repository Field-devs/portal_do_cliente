
const getInitialArray = (startIndex: number, length: number = 10) => {
    return Array.from({ length: length }, (_, i) => i + startIndex);
};


// const CopyToClipboard = async (couponCode: string) => {

//     try {
//       await navigator.clipboard.writeText(couponCode);
//       setShowCopyTooltip(couponCode);
//       setTimeout(() => setShowCopyTooltip(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };
//   const handleCopyToClipboard = async (couponCode: string) => {
//     try {
//       await navigator.clipboard.writeText(couponCode);
//       setShowCopyTooltip(couponCode);
//       setTimeout(() => setShowCopyTooltip(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };


export { getInitialArray };