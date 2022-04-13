/**
 * 简化获取元素
 * @param expr 选择器
 * @returns
 */
export const $ = (expr: string) => document.querySelector(expr);

/**
 * 获取文件提交记录
 * @param repo
 * @param file
 * @returns
 */
export const getCommits = async (
    repo: string,
    file: string
): Promise<{ author?: Author }[]> => {
    const res = await fetch(
        `https://api.github.com/repos/${repo}/commits?path=/${file}&per_page=100`
    );
    return await res.json();
};

/**
 * 从 commits 中提取贡献者数据并去重
 * @param data
 * @returns
 */
export const mapUser = (data: { author?: Author }[]) => {
    const set = new Set();
    return data
        .filter(({ author }) => author != null)
        .map(({ author }) => ({
            url: author.avatar_url,
            name: author.login
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
 * 创建 HTML 字符串
 * @param image
 * @param users
 * @returns
 */
export const createContributorsHTML = (
    image: Image,
    users: { url: string; name: string }[]
) => {
    const { size } = image;
    return users
        .map(
            ({ url, name }) => `
                <a href="https://github.com/${name}" target="_blank" data-title="@${name}">
                    <img src="${url}" width="${size}" height="${size}" alt="@${name}">
                </a>`
        )
        .join("");
};

/**
 * 是否属于需要忽略的文件
 * @param file
 * @param ignores
 * @returns
 */
export const isIgnore = (file: string, ignores: string[]) =>
    ignores.some(url => url === `/${file}`);
