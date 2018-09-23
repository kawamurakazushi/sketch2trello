export const post = (url, filePath) => {
  log(url);
  log(filePath);
  const task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");
  const args = [
    "-X",
    "POST",
    "-H",
    "Content-Type: multipart/form-data",
    "-H",
    "X-Accept: application/json",
    "-F",
    "file=@" + filePath,
    url
  ];
  task.setArguments(args);
  var outputPipe = NSPipe.pipe();
  task.setStandardOutput(outputPipe);
  task.launch();
  const outputData = outputPipe.fileHandleForReading().readDataToEndOfFile();
  const outputString = NSString.alloc().initWithData_encoding_(
    outputData,
    NSUTF8StringEncoding
  );

  log(outputString);
};

export const sync = (context, key, token, listId) => {
  // get the document
  const doc = context.document;

  // get all the pages
  const pages = doc.pages();

  // get the current page
  const currentPage = doc.currentPage();

  // get all the artboards of the page
  const artboards = currentPage.artboards();

  let slices = [];
  artboards.forEach(artboard => {
    fetch(
      `https://api.trello.com/1/cards?name=${escape(
        artboard.name()
      )}&desc=Desc&pos=top&idList=${listId}&keepFromSource=all&key=${key}&token=${token}`,
      {
        method: "POST"
      }
    )
      .then(res => {
        return res.json();
      })
      .then(json => {
        log(json.id);
        const path = `${NSTemporaryDirectory()}${artboard.name()}.png`;
        doc.saveArtboardOrSlice_toFile(artboard, path);
        const url = `https://api.trello.com/1/cards/${
          json.id
        }/attachments?key=${key}&token=${token}`;
        post(url, path);
      })
      .catch(error => {
        log(error);
      });
  });
};
