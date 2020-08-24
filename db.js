const Keyv = require('keyv');
const keyv = new Keyv('sqlite://./.data/db.sqlite');

exports.set = async (variable, value) => {
  try {
    await keyv.set(variable, value);
  } catch (err) {
    console.error(err);
  }
  return;
}

exports.get = async (variable) => {
  let value;
  try {
    value = await keyv.get(variable);
  } catch (err) {
    console.error(err);
  }
  return value;
}

exports.delete = async (variable) => {
  try {
    await keyv.delete(variable);
  } catch (err) {
    console.error(err);
  }
  return;
}

exports.clear = async () => {
  try {
    await keyv.clear();
  } catch (err) {
    console.error(err);
  }
  return;
}