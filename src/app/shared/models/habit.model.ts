import { IHabit } from "../interfaces/habit.interface";

export class Habit implements IHabit {
    constructor(
        public title: string,
        public status: boolean = false
    ) { }
}