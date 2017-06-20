
const QMote = {};

QMote.debug = (params) => {
  console.log(JSON.stringify(params));
  return Promise.resolve('success');
};

export default QMote;
