const app = document.getElementById("app");

export const router = {
  async navigate(sceneFn) {
    app.innerHTML = "";

    const result = sceneFn();

    if (result instanceof Promise) {
      const node = await result;
      if (node instanceof Node) {
        app.appendChild(node);
      }
    }
    
    else if (result instanceof Node) {
      app.appendChild(result);
    } else {
      console.error("Scene must return a DOM node");
    }
  }
};
