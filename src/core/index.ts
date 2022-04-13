import { defaultConfig } from "../config";
import {
    $,
    getCommits,
    createContributorsHTML,
    mapUser,
    isIgnore
} from "../utils";

window.$docsify.plugins = [].concat((hook, vm) => {
    const { contributors } = vm.config;

    const { ignores, style, image, repo, load } = {
        repo: contributors.repo,
        ignores: contributors.ignores ?? defaultConfig.ignores,
        style: {
            ...defaultConfig.style,
            ...(contributors.style ?? {})
        },
        image: {
            ...defaultConfig.image,
            ...(contributors.image ?? {})
        },
        load: {
            ...defaultConfig.load,
            ...(contributors.load ?? {})
        }
    };

    const className = `${repo.split("/")[1]}-contributors`;

    const map = new Map<string, { author?: Author }[]>();

    hook.init(() => {
        const { color, bgColor, extra } = style;
        const { margin, isRound } = image;
        const { isOpen, color: loadColor } = load;

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

            .${className} a::before,
            .${className} a::after {
                position: absolute;
                box-sizing: border-box;
                transition: 100ms;
                opacity: 0;
                z-index: -1;
                background-color: ${bgColor};
            }

            .${className} a::before {
                content: "contributor" attr(data-title);
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

            ${
                isOpen
                    ? `
            .load-container {
                width: 100px;
                height: 30px;
                font-size: 10px;
                text-align: center;
            }

            .load-container div {
                display: inline-block;
                height: 100%;
                width: 6px;
                margin-left: 5px;
                background-color: ${loadColor};
                animation: load 1.2s infinite ease-in-out;
            }

            .load-container div:nth-child(1) {
                animation-delay: -1.2s;
            }

            .load-container div:nth-child(2) {
                animation-delay: -1.1s;
            }

            .load-container div:nth-child(3) {
                animation-delay: -1.0s;
            }

            .load-container div:nth-child(4) {
                animation-delay: -0.9s;
            }

            .load-container div:nth-child(5) {
                animation-delay: -0.8s;
            }

            @keyframes load {
                0%,
                40%,
                100% {
                    transform: scaleY(0.4);
                }
                20% {
                    transform: scaleY(1);
                }
            }`
                    : ""
            }
        `;
        document.head.append(styleEle);
    });

    hook.afterEach((html, next) => {
        const { file } = vm.route;
        if (isIgnore(file, ignores)) {
            return next(html);
        }
        return next(`
            ${html}
            <div class="${className}">
                ${
                    load.isOpen
                        ? `
                    <div class="load-container">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                `
                        : ""
                }
            </div>`);
    });

    hook.doneEach(async () => {
        const target = $(`.${className}`);
        if (target == null) {
            return;
        }
        const { file } = vm.route;
        let data: { author?: Author }[];
        if (map.has(file)) {
            data = map.get(file);
        } else {
            data = await getCommits(repo, file);
            map.set(file, data);
        }
        target.innerHTML = createContributorsHTML(image, mapUser(data));
    });
}, window.$docsify.plugins);
