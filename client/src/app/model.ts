export class User {
    user_id: string;
    email: string;
    nickname: string;

    constructor(opts: any) {
        this.user_id = opts.user_id;
        this.email = opts.email;
        this.nickname = opts.nickname;
    }
}

export class UserResponse {
    success: boolean;
    message: object;
}

export class LoginResponse {
    success: boolean;
    token: string;
    userId: string;
    nickname: string;
}

export class TrainingGroupsResponse {
    success: boolean;
    message: object[];
}

export class TrainingGroupResponse {
    success: boolean;
    message: object;
}

export class TrainingGroup {
    id: string;
    name: string;

    constructor(opts: any) {
        this.id = opts.id;
        this.name = opts.name;
    }
}

export class TrainingEventsResponse {
    success: boolean;
    message: object[];
}

export class TrainigEvent {
    id: string;
    user_id: string;
    group_id: string;
    date_time: Date;

    constructor(opts: any) {
        this.id = opts.id;
        this.user_id = opts.user_id;
        this.group_id = opts.group_id;
        this.date_time = opts.date_time;
    }
}

