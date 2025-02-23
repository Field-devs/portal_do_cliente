const getInitialArray = (startIndex: number, length: number = 10) => {
    return Array.from({ length: length }, (_, i) => i + startIndex);
};

export { getInitialArray };