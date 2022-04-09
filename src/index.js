window.$docsify.plugins = [].concat((hook, vm) => {
  // 默认值配置
  const defaultConfigStyle = {
    color: "#ffffff",
    bgColor: "#404040",
    isRound: true,
    extra: ``,
  };

  const { repo, contributors = {} } = vm.config;
  const {
    ignores,
    style
  } = {
    ignores: contributors.ignores ?? [],
    style: {
      ...defaultConfigStyle,
      ...(contributors.style ?? {})
    }
  }

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
          <a href="${url}" target="_blank" dada-title="@${name}">
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
    const {
      color = "#ffffff",
      bgColor = "#404040",
      isRound = true,
      extra = ``,
    } = style;
    const styleEle = document.createElement("style");
    styleEle.innerText = `
      .docsify-contributors {
        display: flex;
        padding-top: 1em;
      }

      .docsify-contributors a {
        position: relative;
        margin: 0 0.5em;
      }

      .docsify-contributors a::before, .docsify-contributors a::after {
        position: absolute;
        box-sizing: border-box;
        transition: 100ms;
        opacity: 0;
        z-index: -1;
        background-color: ${bgColor};
      }

      .docsify-contributors a::before {
        content: "contributor" attr(dada-title);
        top: -100%;
        left: 50%;
        transform: translate(-50%, -100%);
        min-width: max-content;
        height: 27px;
        font-size: 12px;
        border-radius: 5px;
        padding: 0.5em;
        color: ${color};
      }

      .docsify-contributors a::after {
        content: '';
        top: calc(-100% + 26.5px);
        left: 50%;
        transform: translate(-50%, -500%);
        width: 20px;
        height: 7px;
        clip-path: path("m0 0 l10 7 l10 -7z");
      }

      .docsify-contributors a:hover::before,.docsify-contributors a:hover::after  {
        z-index: 2;
        opacity: 1;
        transform: translate(-50%, 0%);
      }

      .docsify-contributors a img {
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
    return next(html + `<div class="docsify-contributors"></div>`);
  });

  hook.doneEach(async () => {
    const target = $(".docsify-contributors");
    if (target == null) {
      return;
    }
    const { file } = vm.route;
    const data = await getCommits(file);
    target.innerHTML = createContributorsHTML(mapUser(data));
  });
}, window.$docsify.plugins);
