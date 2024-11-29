import cryto from 'crypto';
const SECRET = 'Thank-God-for-interAct-Take-rest-God-provides';

export const random = () => cryto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return cryto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};