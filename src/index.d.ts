declare interface Style {
    color?: string;
    bgColor?: string;
    extra?: string;
}

declare interface Image {
    margin?: string;
    isRound?: boolean;
    size?: number;
}

declare interface Config {
    repo: string;
    ignores?: string[];
    style?: Style;
    image?: Image;
}
declare interface Author {
    html_url: string;
    avatar_url: string;
    login: string;
}
