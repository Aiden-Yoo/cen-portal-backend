import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  let name = '';
  const tempName = file.originalname.split('.');
  for (let i = 0; i < tempName.length; i++) {
    if (i !== tempName.length - 1) {
      if (i === 0) {
        name += tempName[i];
      } else {
        name += '.' + tempName[i];
      }
    }
  }
  const fileExtName = extname(file.originalname);
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
