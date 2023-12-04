import { id, windowData } from "./store";

// place files you want to import through the `$lib` alias in this folder.
export default class windowManager {
  id: number = 0;
  windows: string = "";
  constructor() {
    this.handleSS();
  }

  handleSS() {
    if (localStorage.getItem("windows")) {
      if (!sessionStorage.getItem("winId")) {
        this.id = Number(String(localStorage.getItem("windows")?.length)) + 1;
        sessionStorage.setItem("winId", String(this.id));
        this.windows = String(localStorage.getItem("windows")) + this.id;
        localStorage.setItem("windows", String(this.windows));
      } else {
        this.id = Number(sessionStorage.getItem("winId"));
        this.windows = String(localStorage.getItem("windows"));
      }
    } else {
      this.id = 1;
      localStorage.setItem("windows", String(this.id));
      this.windows = String(localStorage.getItem("windows"));
      sessionStorage.setItem("winId", String(this.id));
    }
  }
}

export const removeS = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export class WindowSCreen {
  id: number = 0;
  windowData: Object = {};
  windows = [];
  pos = { x: 0, y: 0 };

  constructor() {}

  setWindowData = (data) => {
    this.windowData = data;
    console.table(this.windowData);
    this.handleSS();
  };

  handleSS() {
    if (localStorage.getItem("windows")) {
      if (!sessionStorage.getItem("winId")) {
        this.id = Number(
          JSON.parse(String(localStorage.getItem("windows")))?.length
        );
        sessionStorage.setItem("winId", String(this.id));
        let windows = [];
        windows = JSON.parse(String(localStorage.getItem("windows")));
        this.windowData.id = this.id;
        windows.push(this.windowData);
        localStorage.setItem("windows", JSON.stringify(windows));
      } else {
        this.id = Number(sessionStorage.getItem("winId"));
        this.windowData = JSON.parse(String(localStorage.getItem("windows")))[
          this.id
        ];
      }
    } else {
      this.id = 0;
      let arr = [];
      this.windowData.id = this.id;
      arr.push(this.windowData);
      localStorage.setItem("windows", JSON.stringify(arr));
      this.windowData = JSON.parse(String(localStorage.getItem("windows")))[
        this.id
      ];
      sessionStorage.setItem("winId", String(this.id));
    }
  }

  update(data) {
    if (localStorage.getItem("windows")) {
      let windows = JSON.parse(String(localStorage.getItem("windows")));
      data.id = this.id;
      windows[this.id] = data;
      this.windowData = data;
      localStorage.setItem("windows", JSON.stringify(windows));
    }
  }

  getPos() {
    let data = this.windows[this.id];
    let pos = { x: 0, y: 0 };

    pos.x = this.windowData.screenX + this.windowData.width / 2;
    pos.y = this.windowData.screenY + this.windowData.height / 2;

    this.pos = pos;
  }

  setStore() {
    id.update(() => this.id);
    windowData.update(() => this.windowData);
  }
}
