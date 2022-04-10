import { defaultConfig } from './config';
import {
    $,
    getCommits,
    createContributorsHTML,
    mapUser,
    isIgnore
} from './utils';

((window as any).$docsify as any).plugins = [].concat(
    (
        hook: any,
        vm: {
            config: { contributors: Config };
            route: { file: string };
        }
    ) => {
        const { contributors } = vm.config;

        const { ignores, style, image, repo } = {
            repo: contributors.repo,
            ignores: contributors.ignores ?? defaultConfig.ignores,
            style: {
                ...defaultConfig.style,
                ...(contributors.style ?? {})
            },
            image: {
                ...defaultConfig.image,
                ...(contributors.image ?? {})
            }
        };

        const className = `${repo.split('/')[1]}-contributors`;

        const map = new Map<string, { author?: Author }[]>();

        hook.init(() => {
            const { color, bgColor, extra } = style;
            const { margin, isRound } = image;

            const styleEle = document.createElement('style');
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

        hook.afterEach((html: string, next: (html: string) => void) => {
            const { file } = vm.route;
            if (isIgnore(file, ignores)) {
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
            let data: { author?: Author }[];
            if (map.has(file)) {
                data = map.get(file);
            } else {
                data = await getCommits(repo, file);
                map.set(file, data);
            }
            target.innerHTML = createContributorsHTML(image, mapUser(data));
        });
    },
    (window as any).$docsify.plugins
);
