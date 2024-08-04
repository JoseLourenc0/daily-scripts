export const shortenString = (text: string = '', chop: number = 20) => text?.length >= chop ? text.slice(0, chop) + '...' : text
