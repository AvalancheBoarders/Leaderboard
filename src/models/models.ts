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

export interface IUserDrinks {
    billID: string;
    userID: string;
    quantity: number;
    quantityShots: number;
    date: string;
}
