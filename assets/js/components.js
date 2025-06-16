// assets/js/components.js
class ComponentLoader {
  static async load(container, url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      document.querySelector(container).innerHTML = html;

      // 执行组件内脚本
      const scripts = document
        .querySelector(container)
        .getElementsByTagName("script");
      for (let script of scripts) {
        if (script.src) {
          await this.loadScript(script.src);
        } else {
          eval(script.innerHTML);
        }
      }
    } catch (error) {
      console.error(`组件加载失败: ${error}`);
    }
  }

  static loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}
