import pluginCall from "sketch-module-web-view/client";

// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

document.querySelector("#export").addEventListener("click", function() {
  const boardId = document.querySelector("#boards").value;
  const listId = document.querySelector("#lists").value;
  pluginCall("exportArtboards", boardId, listId);
});

document.querySelector("#boards").addEventListener("change", function(e) {
  const boardId = e.target.value;
  pluginCall("fetchLists", boardId);
});

window.fetchLists = function(token, boardId) {
  const url = `https://api.trello.com/1/boards/${boardId}/lists?key=2cd8017d639182f6c0f0d330ce5d19ca&token=${token}`;
  fetch(url)
    .then(response => response.json())
    .then(json => {
      const lists = json.map(list => {
        const listNode = document.querySelector("#list").cloneNode(true);
        listNode.setAttribute("value", list.id);
        listNode.innerHTML = list.name;

        return listNode;
      });
      document.querySelector("#lists").innerHTML = "";
      lists.forEach(list => {
        document.querySelector("#lists").appendChild(list);
      });
    });
};

window.fetchBoards = function(token) {
  const url = `https://api.trello.com/1/members/5695c318589a1dc4d30e8a4d/boards?key=2cd8017d639182f6c0f0d330ce5d19ca&token=${token}`;
  fetch(url)
    .then(response => response.json())
    .then(json => {
      const boards = json.map(board => {
        const boardNode = document.querySelector("#board").cloneNode(true);
        boardNode.setAttribute("value", board.id);
        boardNode.innerHTML = board.name;

        return boardNode;
      });
      boards.forEach(board => {
        document.querySelector("#boards").appendChild(board);
      });
    });
};
