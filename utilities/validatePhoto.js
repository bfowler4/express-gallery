module.exports = {
  validatePhotoForInsert
};

const validKeys = [`author`, `link`, `description`];

function validatePhotoForInsert(photo) {
  return new Promise(function(resolve, reject) {
    let keys = Object.keys(photo);

    if (keys.length !== 3) {
      reject(new Error(`Invalid number of keys. Please make sure each new photo submission has an author, a link and a description.`));
    }
  
    for (let key of keys) {
      if (!validKeys.includes(key)) {
        reject(new Error(`Receieved invalid key '${key}`));
      }
  
      if (!keys[key]) {
        reject(new Error(`Receieved blank value on '${key}`));
      }
    }
  
    resolve(photo);
  });
}