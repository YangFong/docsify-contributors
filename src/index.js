window.$docsify.plugins = [].concat((hook, vm) => {
  let { repo, contributors = {} } = vm.config;
  repo = contributors.repo || repo;
  if (!repo) {
    return;
  }

  const defaultConfig = {
    style: {
      color: "#ffffff",
      bgColor: "#404040",
      isRound: true,
      extra: ``,
    },
    image: {
      margin: "0.5em",
      isRound: true,
      size: 30,
    },
  };

  const className = `${repo.split("/")[1]}-contributors`;
  const { ignores, style, image } = {
    ignores: contributors.ignores ?? [],
    style: {
      ...defaultConfig.style,
      ...(contributors.style ?? {}),
    },
    image: {
      ...defaultConfig.image,
      ...(contributors.image ?? {}),
    },
  };

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
    const { size } = image;
    return users
      .map(
        ({ url, img, name }) => `
          <a href="${url}" target="_blank" dada-title="@${name}">
            <img src="${img}" width="${size}" height="${size}" alt="@${name}">
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
    let { color, bgColor, isRound, extra } = style;
    const { margin } = image;
    if (!image.isRound) {
      isRound = false;
    }

    const styleEle = document.createElement("style");
    styleEle.innerText = `
      .${className} {
        display: flex;
        flex-wrap: wrap;
        padding-top: 1em;
      }

      .${className} a {
        position: relative;
        margin: ${margin};
      }

      .${className} a::before, .${className} a::after {
        position: absolute;
        box-sizing: border-box;
        transition: 100ms;
        opacity: 0;
        z-index: -1;
        background-color: ${bgColor};
      }

      .${className} a::before {
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

      .${className} a::after {
        content: '';
        top: calc(-100% + 26.5px);
        left: 50%;
        transform: translate(-50%, -500%);
        width: 20px;
        height: 7px;
        clip-path: path("m0 0 l10 7 l10 -7z");
      }

      .${className} a:hover::before,
      .${className} a:hover::after  {
        z-index: 2;
        opacity: 1;
        transform: translate(-50%, 0%);
      }

      .${className} a img {
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
    return next(html + `<div class="${className}"></div>`);
  });

  hook.doneEach(async () => {
    const target = $(`.${className}`);
    if (target == null) {
      return;
    }
    const { file } = vm.route;
    const data = await getCommits(file);
    target.innerHTML = createContributorsHTML(mapUser(data));
  });
}, window.$docsify.plugins);
