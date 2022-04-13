declare interface Style {
    color?: string;
    bgColor?: string;
    extra?: string;
}

declare interface Image {
    size?: number;
    margin?: string;
    isRound?: boolean;
}

declare interface Load {
    isOpen?: boolean;
    color?: string;
}

declare interface Config {
    repo: string;
    ignores?: string[];
    style?: Style;
    image?: Image;
    load?: Load;
}

declare interface Author {
    login: string;
    avatar_url: string;
}

declare interface Hook {
    init: (callback: () => void) => void;
    afterEach: (callback: (html: string, next: (html: string) => void) => void) => void;
    doneEach: (callback: () => void) => void;
}

declare interface Vm {
    config: {
        contributors: Config
    };
    route: {
        file: string
    };
}

interface Window {
    $docsify: {
        plugins: ((hook: Hook, vm: Vm) => void)[]
    };
}
