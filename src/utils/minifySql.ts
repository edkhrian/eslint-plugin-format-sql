export const minifySql = (str: string) => {
  return str
    .replace(/--.*\n/g, '')
    .replace(/\/\*([\s\S]*?)\*\//g, '')
    .replace(' =', '=')
    .replace('= ', '=')
    .replace('( ', '(')
    .replace(' )', ')')
    .replace('\r', '')
    .replace('\n', ' ')
    .replace(/ +/g, ' ')
    .replace(/^ /g, '');
};
