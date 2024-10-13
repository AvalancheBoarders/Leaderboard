export interface IUser {
    userID: string;
    firstName: string;
    lastName: string;
}

export interface IBill {
    date: string;
    items: IBillLine[];
}

/** Line on the bill. */
export interface IBillLine {
    user: IUser;
    quantity: number;
    quantityShots: number;
}

export interface IUserDrinkData extends IBillLine {
    evenings: number;
    maxInOneNight: number;
    maxInOneNightShots: number;
    maxInOneNightBeers: number;
}

export interface ILeaderBoardItem {
    user: IUser;
    quantity: number;
    quantityShots: number;
}

export interface ILeaderboard {
    values: ILeaderboardItem[];
    max: number;
}

export interface ILeaderboardItem {
    user: IUser;
    values: number[];
    sublabel: string | null;
    label: string;
}

export interface IUserDrinks {
    billID: string;
    userID: string;
    quantity: number;
    quantityShots: number;
    date: string;
}

export enum LeaderBoardMode {
    MOST_DRINKS = 0,
    MOST_EVENINGS = 1,
    MOST_DRINKS_ONE_NIGHT = 2,
    MOST_DRINKS_RATIO = 3,
}

export interface IFeature {
    id: string;
    name: string;
    value: string;
    active: boolean;
}
