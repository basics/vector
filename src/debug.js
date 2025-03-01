export default function debug(strings, ...values) {
  return strings
    .reduce((memo, string, index) => {
      memo.push(string);
      memo.push((values[index] || '').toString());
      return memo;
    }, [])
    .join('');
}
