
const getInitialArray = (startIndex: number, length: number = 10) => {
    return Array.from({ length: length }, (_, i) => i + startIndex);
};


const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    //   setCopied(true);
    //   setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };



export { getInitialArray, copyToClipboard };