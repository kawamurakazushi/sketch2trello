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

document.querySelector("#logout").addEventListener("click", function() {
  pluginCall("logout");
});

document.querySelector("#fetch").addEventListener("click", function() {
  pluginCall("fetchBoards");
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

window.fetchBoards = async token => {
  try {
    const getMemberUrl = `https://api.trello.com/1/tokens/${token}?token=${token}&key=2cd8017d639182f6c0f0d330ce5d19ca`;

    console.log(getMemberUrl);
    const memberResponse = await fetch(getMemberUrl);
    const memberData = await memberResponse.json();
    console.log(memberData);

    if (!memberData) {
      return;
    }

    const getBoardsUrl = `https://api.trello.com/1/members/${
      memberData.idMember
    }/boards?key=2cd8017d639182f6c0f0d330ce5d19ca&token=${token}`;

    console.log(getBoardsUrl);
    const boardResponse = await fetch(getBoardsUrl);
    const boardsData = await boardResponse.json();

    const boards = boardsData.map(board => {
      const boardNode = document.querySelector("#board").cloneNode(true);
      boardNode.setAttribute("value", board.id);
      boardNode.innerHTML = board.name;
      return boardNode;
    });

    boards.forEach(board => {
      document.querySelector("#boards").appendChild(board);
    });
  } catch (error) {
    console.log(error);
  }
};

// (async token => {
//   try {
//     const getMemberUrl = `https://api.trello.com/1/tokens/${token}?token=${token}&key=2cd8017d639182f6c0f0d330ce5d19ca`;
//     console.log(getMemberUrl);
//     const memberResponse = await fetch(getMemberUrl);
//     console.log("lolo");
//     const memberData = await memberResponse.json();
//     console.log(memberData);
//     console.log("fuck");
//   } catch (error) {
//     console.log(error);
//   }
// })("ebd6938eaf72d251e5d745866802c0077428a61fd79af97e39d184de3cfbbf3c");
