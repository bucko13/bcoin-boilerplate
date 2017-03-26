import childProcess from 'child_process';

const writeData = (data) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(`echo '${data}' | ${__dirname}/../paste.sh -p`, function (err, stdout, stderr) {
        var urlIndex = stdout.indexOf('https:');
        let pasteUrl = stdout.slice(urlIndex).trim();
        if (err !== null) {
          console.log('exec err: ' + err);
          reject(err);
        }
        resolve(pasteUrl);
      });
    });
}

const fetchData = (pasteUrl) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(`${__dirname}/../paste.sh ${pasteUrl}`, function (err, stdout, stderr) {
      stdout = stdout.trim();
      resolve(stdout.split("\n"));
     });
    });
};

export { writeData, fetchData };

// const data = [
//   'magnet:eafeafjaefjeaf&dn=Ubuntu+16',
//   'magnet:eafeafjaefjeaf&dn=Greatness+Behold',
//   'magnet:eafeafjaefjeaf&dn=Really+Awesome+Though',
// ]

// let compiledData = data.join("\n");
// console.log(`Writing data: ${compiledData}`);
// writeData(compiledData)
//   .then(url => {
//     console.log(url);
//     return fetchData(url);
//   })
//   .then(url => console.log(url));

// fetchData("https://paste.sh/p_Ody2FvE")
//   .then(url => console.log(url));