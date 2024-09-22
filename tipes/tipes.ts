export type Save = {
    id: number;
    name: string;
    goshiType: number;
    goshiHealth: number;
    goshiSleep: number;
    goshiHappiness: number;
    goshiStatus: string;
}

export type Choice = 'rock' | 'paper' | 'scissors'| '';