window.$docsify.plugins = [].concat((hook, vm) => {
  const { repo } = vm.config;
  const {
    ignores = ["/README.md"],
    style = {
      color: "#ffffff",
      bgColor: "#404040",
      isRound: true,
      extra: ``,
    },
  } = vm.config.contributors ?? {};

  /**
   * 简化获取元素
   * @param {*} expr 选择器
   * @returns
   */
  const $ = (expr) => document.querySelector(expr);

  const getCommits = async (file) => {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/commits?path=/${file}&per_page=100`
    );
    return await res.json();
  };

  /**
   * 创建 HTML 字符串
   * @param {*} users
   * @returns
   */
  const createContributorsHTML = (users) => {
    return users
      .map(
        ({ url, img, name }) => `
          <a class="doocs-contributor" href="${url}" target="_blank" dada-title="@${name}">
            <img src="${img}" width="30" height="30" alt="@${name}">
          </a>`
      )
      .join("");
  };

  /**
   * 从 commits 中提取贡献者数据并去重
   * @param {*} data
   * @returns
   */
  const mapUser = (data) => {
    const set = new Set();
    return data
      .map(({ author }) => ({
        url: author.html_url,
        img: author.avatar_url,
        name: author.login,
      }))
      .filter(({ name }) => {
        if (set.has(name)) {
          return false;
        }
        set.add(name);
        return true;
      });
  };

  /**
   * 是否属于需要忽略的文件
   * @param {*} file
   * @returns
   */
  const isIgnore = (file) => ignores.some((url) => url === `/${file}`);

  hook.init(() => {
    const { color, bgColor, isRound, extra } = style;
    const styleEle = document.createElement("style");
    styleEle.innerText = `
      .doocs-contributors {
        display: flex;
        padding-top: 1em;
      }

      .doocs-contributors a {
        position: relative;
        margin: 0 0.5em;
      }

      .doocs-contributors a::before{
        box-sizing: border-box;
        content: "contributor" attr(dada-title);
        position: absolute;
        top: -100%;
        left: 50%;
        transform: translateX(-50%);
        transition: 200ms;
        min-width: max-content;
        font-size: 12px;
        border-radius: 5px;
        padding: 0.5em;
        color: ${color};
        background-color: ${bgColor};
        opacity: 0;
        z-index: -1;
      }

      .doocs-contributors a:hover::before  {
        z-index: 2;
        opacity: 1;
      }

      .doocs-contributors a img {
        border-radius: ${isRound ? 50 : 0}%;
      }

      ${extra}
    `;
    document.head.append(styleEle);
  });

  hook.afterEach((html, next) => {
    const { file } = vm.route;
    if (isIgnore(file)) {
      return next(html);
    }
    return next(html + `<div class="doocs-contributors"></div>`);
  });

  hook.doneEach(async () => {
    const target = $(".doocs-contributors");
    if (target == null) {
      return;
    }
    const { file } = vm.route;
    const data = await getCommits(file);
    target.innerHTML = createContributorsHTML(mapUser(data));
  });
}, window.$docsify.plugins);
