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

export class CommonResponse {
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
    rolename: string

    constructor(opts: any) {
        this.id = opts.id;
        this.name = opts.name;
        this.rolename = opts.rolename;
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
    swim_duration: number;
    co_train_duration: number;
    stress_level: number;
    nutrition: number;
    sleep:  number;
    remarks: string;

    constructor(opts: any) {
        this.id = opts.id;
        this.user_id = opts.user_id;
        this.group_id = opts.group_id;
        this.date_time = opts.date_time;
        this.swim_duration = opts.swim_duration;
        this.co_train_duration = opts.co_train_duration;
        this.stress_level = opts.stress_level;
        this.nutrition = opts.nutrition;
        this.sleep = opts.sleep;
        this.remarks = opts.remarks;
    }
}

export class ReportData {
    count: number;
    stressLevelAverage: number;
    nutritionAverage: number;
    sleepAverage: number;
}

