const observer = new top.MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      mutation.type === "childList" &&
      mutation.removedNodes.length > 0 &&
      mutation.removedNodes[0].className === "editor-inner block-editor"
    ) {
      const uuid = mutation.target
        .closest('div[id^="ls-block"]')
        .getAttribute("blockid");

      const text = mutation.removedNodes[0].firstChild.value;

      if (text === "@embed") {
        const fileInput = document.createElement("input");
        const btn = document.createElement("button");
        fileInput.type = "file";
        fileInput.onchange = async () => {
          const file = fileInput.files[0];
          const { type, name } = file;

          if (type.startsWith("video")) {
            logseq.api.update_block(uuid, `![video](../assets/${name})`);
          } else if (type.startsWith("audio")) {
            logseq.api.update_block(uuid, `![audio](../assets/${name})`);
          } else {
            logseq.api.update_block(uuid, `![](../assets/${name})`);
          }
        };
        btn.addEventListener("click", () => {
          fileInput.click();
        });
        btn.click();
      }
    }
  }
});

observer.observe(top.document.getElementById("app-container"), {
  attributes: false,
  childList: true,
  subtree: true,
});
