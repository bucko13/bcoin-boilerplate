import { script as Script } from 'bcoin';

const makeScript = (data) => {
  const opcodes = Script.opcodes;
  const script = new Script();
  script.push(opcodes.OP_RETURN);
  script.push(data);
  script.compile();
  return script.toJSON();
};

export { makeScript };